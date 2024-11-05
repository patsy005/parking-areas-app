import { DocumentStore } from 'ravendb'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const authOptions = {
	certificate: fs.readFileSync(process.env.RAVEN_CLIENT_CERTIFICATE_PATH), 
	type: 'pfx',
	password: process.env.RAVENDB_CERTIFICATE_PASSWORD,
}

const store = new DocumentStore(process.env.REACT_APP_API_URL, 'ravenDB', authOptions)
store.initialize()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function importData() {
	const dataFilePath = path.join(__dirname, 'data.json')
	const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'))
	const session = store.openSession()
	const parkingAreas = data.parkingAreas

	for (const parkingArea of parkingAreas) {
		parkingArea['@metadata'] = { '@collection': 'parkingAreas' }
		await session.store(parkingArea)
	}


	await session.saveChanges()
	console.log('Data imported successfully')
}

importData().catch(err => console.error(err))
