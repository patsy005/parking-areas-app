import { DocumentStore } from 'ravendb'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import fs from 'fs'
import moment from 'moment'
import fetch from 'node-fetch'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = ['http://localhost:5173', 'http://localhost:8080']

app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin) return callback(new Error('Not allowed by CORS'))
			if (allowedOrigins.indexOf(origin) === -1) {
				const message = 'The CORS policy for this site does not allow access from the specified Origin.'
				return callback(new Error(message), false)
			}
			return callback(null, true)
		},
		methods: ['GET', 'POST', 'PATCH', 'DELETE'],
	})
)

const authOptions = {
	certificate: fs.readFileSync(process.env.RAVEN_CLIENT_CERTIFICATE_PATH), 
	type: 'pfx',
	password: process.env.RAVENDB_CERTIFICATE_PASSWORD,
}

const store = new DocumentStore(process.env.REACT_APP_API_URL, 'ravenDB', authOptions)
store.conventions.findCollectionNameForObjectLiteral = entity => entity.collection
store.initialize()

app.use(express.json())

app.get('/api/parkingAreas', async (req, res) => {
	const session = store.openSession()
	try {
		const parkingAreas = await session
			.query({ collection: 'parkingAreas' })
			.selectFields(['name', 'hourlyRate', 'id', 'discount'])
			.all()
		res.json(parkingAreas)
	} catch (err) {
		res.status(500).json({ error: err.message })
	} finally {
		session.dispose()
	}
})

app.get('/api/discounts', async (req, res) => {
	const session = store.openSession()
	try {
		const discounts = await session
			.query({ collection: 'discounts' })
			.selectFields(['name', 'percentage', 'from', 'to', 'parkingAreas'])
			.all()
		res.json(discounts)
	} catch (err) {
		res.status(500).json({ error: err.message })
	} finally {
		session.dispose()
	}
})

app.patch('/api/parkingAreas/:id', async (req, res) => {
	const session = store.openSession()

	const { id } = req.params

	try {
		const parkingArea = await session.load(id)

		if (parkingArea) {
			Object.assign(parkingArea, req.body)

			await session.saveChanges()

			res.json(parkingArea)
		} else {
			res.status(404).json({ message: 'Parking Area not found' })
		}
	} catch (error) {
		res.status(500).json({ error: 'Error updating parking area' })
	}
})

app.delete('/api/parkingAreas/:id', async (req, res) => {
	const { id } = req.params
	const session = store.openSession()

	try {
		const parkingArea = await session.load(id)

		if (!parkingArea) {
			return res.status(404).json({ message: 'Parking Area not found' })
		}

		await session.delete(parkingArea)
		await session.saveChanges()

		res.status(200).json({ message: 'Parking Area deleted successfully' })
	} catch (err) {
		res.status(500).json({ error: err.message })
	} finally {
		session.dispose()
	}
})

app.post('/api/parkingAreas', async (req, res) => {
	const session = store.openSession()

	try {
		const parkingArea = {
			...req.body,
			'@metadata': {
				'@collection': 'parkingAreas',
			},
		}

		await session.store(parkingArea)
		await session.saveChanges()

		res.json(parkingArea)
	} catch (error) {
		res.status(500).json({ error: 'Error adding parking area' })
	}
})

app.post('/api/calculate-payment', async (req, res) => {
	const session = store.openSession()

	const { areaName, date, timeFrom, timeTo, currency } = req.body

	const documentId = `${areaName}`

	try {
		const parkingArea = await session.load(documentId)

		if (!parkingArea) {
			return res.status(404).json({ message: 'Parking Area not found' })
		}

		const startDateTime = moment(`${date} ${timeFrom}`)
		const endDateTime = moment(`${date} ${timeTo}`)

		const isWeekend = startDateTime.isoWeekday() >= 6

		const rate = isWeekend ? parkingArea.hourlyRate.weekends : parkingArea.hourlyRate.weekdays

		const duration = moment.duration(endDateTime.diff(startDateTime))

		const hours = duration.asHours()

		const discount = parkingArea.discount

		const baseAmount = rate * hours

		let finalRate = baseAmount

		if (currency !== 'USD') {
			const convertedAmount = await convertCurrency(baseAmount, currency)
			finalRate = convertedAmount.result
		}

		if (discount > 0) {
			finalRate = finalRate - (finalRate * discount) / 100
		}

		res.json(finalRate.toFixed(2))
	} catch (error) {
		res.status(500).json({ error: 'Error calculating payment' })
	}
})

async function convertCurrency(amount, targetCurrency) {
	// The free subscription of the exchangeratesapi.io API only allows using basic endpoint showed below which has EUR as a base and returns exchange rates for all available currencies. Adding any additional endpoints or changing the base currency will result in an error. I used a different API for this project.

	// allowed url
	// const url = `https://api.exchangeratesapi.io/v1/latest?access_key=API_KEY`
	// see image for reference : ../images/exchangeRatesApi.png

	// The following is an example of how the URL would look if I had a paid subscription and could use USD as the base currency, specify the target currency, amount, and the payment due date:
	// https://api.exchangeratesapi.io/v1/convert?access_key=API_KEY?from=USD&to=${targetCurrency}&amount=${amount}$format=json&places=2&date=${dueDate}

	const dueDate = moment().format('YYYY-MM-DD')

	// working url with free subscription
	const url = `https://api.fxratesapi.com/convert?from=USD&to=${targetCurrency}&date=${dueDate}&amount=${amount}&format=json&places=2`

	const response = await fetch(url)
	const data = await response.json()

	return data
}

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`)
})
