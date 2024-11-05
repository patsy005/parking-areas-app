import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'

export type ParkingAreaType = {
	name: string
	hourlyRate: {
		weekdays: number
		weekends: number
	}
	id: string
	discount: number
}

export type DiscountType = {
	percentage: number
	from: string
	to: string
	parkingAreas: string[]
}

type ParkingAreasStateType = {
	parkingAreas: ParkingAreaType[]
	discounts: DiscountType[]
	isLoading: boolean
	isSaving: boolean
	error: string
	searchQuery: string
	sortBy: string
	calculatedPayment: number
}

const initialState: ParkingAreasStateType = {
	parkingAreas: [],
	discounts: [],
	isLoading: false,
	isSaving: false,
	error: '',
	searchQuery: '',
	sortBy: 'name',
	calculatedPayment: 0,
}

export const fetchParkingAreas = createAsyncThunk('parkingAreas/fetchParkingAreas', async () => {
	const response = await fetch('http://localhost:8080/api/parkingAreas')
	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message)
	}

	return response.json()
})

export const editParkingArea = createAsyncThunk(
	'parkingAreas/editParkingArea',
	async ({ id, data }: { id: string; data: ParkingAreaType }) => {
		let query
		if (id.includes('parkingAreas')) {
			query = id
		} else {
			query = `parkingAreas/${id}`
		}
		const response = await fetch(`http://localhost:8080/api/${query}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.message)
		}

		return response.json()
	}
)

export const addParkingArea = createAsyncThunk('parkingAreas/addParkingArea', async (data: ParkingAreaType) => {
	const response = await fetch('http://localhost:8080/api/parkingAreas', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message)
	}

	return response.json()
})

export const deleteParkingArea = createAsyncThunk('parkingAreas/deleteParkingArea', async ({ id }: { id: string }) => {
	const response = await fetch(`http://localhost:8080/api/parkingAreas/${id}`, {
		method: 'DELETE',
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message)
	}

	return id
})

export const calculatePayment = createAsyncThunk('parkingAreas/calculatePayment', async (data: any) => {
	const response = await fetch('http://localhost:8080/api/calculate-payment', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message)
	}

	return await response.json()
})

const parkingAreasSlice = createSlice({
	name: 'parkingAreas',
	initialState,
	reducers: {
		setSearchQuery: (state, action) => {
			state.searchQuery = action.payload
		},
		setSortBy: (state, action) => {
			state.sortBy = action.payload
		},
		setCaltulatedPayment: (state, action) => {
			state.calculatedPayment = action.payload
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchParkingAreas.pending, state => {
				state.isLoading = true
				state.error = ''
			})
			.addCase(fetchParkingAreas.fulfilled, (state, action) => {
				state.isLoading = false
				state.parkingAreas = action.payload
			})
			.addCase(fetchParkingAreas.rejected, (state) => {
				state.isLoading = false
				state.error = 'There was an error while fetching parking areas'
			})
			.addCase(editParkingArea.pending, state => {
				state.isSaving = true
				state.error = ''
			})
			.addCase(editParkingArea.fulfilled, (state, action) => {
				state.isSaving = false
				state.parkingAreas = state.parkingAreas.map(area => {
					if (area.id === action.payload.id) {
						return action.payload
					}
					return area
				})
			})
			.addCase(editParkingArea.rejected, (state) => {
				state.isSaving = false
				state.error = 'Failed to edit parking area'
			})
			.addCase(addParkingArea.pending, state => {
				state.isSaving = true
				state.error = ''
			})
			.addCase(addParkingArea.fulfilled, (state, action) => {
				state.isSaving = false
				state.parkingAreas = [action.payload, ...state.parkingAreas]
			})
			.addCase(addParkingArea.rejected, (state) => {
				state.isSaving = false
				state.error = 'Failed to add parking area'
			})
			.addCase(deleteParkingArea.pending, state => {
				state.isSaving = true
				state.error = ''
			})
			.addCase(deleteParkingArea.fulfilled, (state, action) => {
				state.isSaving = false
				state.parkingAreas = state.parkingAreas.filter(area => area.id !== action.payload)
			})
			.addCase(deleteParkingArea.rejected, (state) => {
				state.isSaving = false
				state.error = 'Failed to delete parking area'
			})
			.addCase(calculatePayment.pending, state => {
				state.isSaving = true
				state.error = ''
			})
			.addCase(calculatePayment.fulfilled, (state, action) => {
				state.isSaving = false
				state.calculatedPayment = action.payload
				console.log(state.calculatedPayment)
			})
			.addCase(calculatePayment.rejected, (state) => {
				state.isSaving = false
				state.error = 'Failed to calculate payment'
			})
	},
})

export const selectParkingAreas = (state: { parkingAreas: ParkingAreasStateType }) => state.parkingAreas.parkingAreas
export const selectDiscounts = (state: { parkingAreas: ParkingAreasStateType }) => state.parkingAreas.discounts
export const selectIsLoading = (state: { parkingAreas: ParkingAreasStateType }) => state.parkingAreas.isLoading
export const selectIsSaving = (state: { parkingAreas: ParkingAreasStateType }) => state.parkingAreas.isSaving
export const selectError = (state: { parkingAreas: ParkingAreasStateType }) => state.parkingAreas.error
export const selectSearchQuery = (state: { parkingAreas: ParkingAreasStateType }) => state.parkingAreas.searchQuery
export const selectSortBy = (state: { parkingAreas: ParkingAreasStateType }) => state.parkingAreas.sortBy
export const selectCalculatedPayment = (state: { parkingAreas: ParkingAreasStateType }) =>
	state.parkingAreas.calculatedPayment

export const parkingAreasSelector = createSelector(
	[selectParkingAreas, selectSearchQuery, selectSortBy],
	(parkingAreas, searchQuery, sortBy) => {
		let newParkingAreas = [...parkingAreas]

		if (searchQuery) {
			return (newParkingAreas = newParkingAreas.filter(area => {
				const { name, hourlyRate, discount } = area

				return (
					name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					hourlyRate.weekdays.toString().includes(searchQuery) ||
					hourlyRate.weekends.toString().includes(searchQuery) ||
					discount.toString().includes(searchQuery)
				)
			}))
		}

		if (sortBy === 'name') {
			newParkingAreas = [...newParkingAreas].sort((a, b) => a.name.localeCompare(b.name))
		}

		if (sortBy === 'weekdays') {
			newParkingAreas = [...newParkingAreas].sort((a, b) => a.hourlyRate.weekdays - b.hourlyRate.weekdays)
		}

		if (sortBy === 'weekends') {
			newParkingAreas = [...newParkingAreas].sort((a, b) => a.hourlyRate.weekends - b.hourlyRate.weekends)
		}

		if (sortBy === 'discount') {
			newParkingAreas = [...newParkingAreas].sort((a, b) => b.discount - a.discount)
		}

		return newParkingAreas
	}
)

export const { setSearchQuery, setSortBy, setCaltulatedPayment } = parkingAreasSlice.actions
export default parkingAreasSlice.reducer
