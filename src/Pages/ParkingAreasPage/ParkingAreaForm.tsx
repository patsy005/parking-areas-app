import { useForm } from 'react-hook-form'

type FormValues = {
	areaName: string
	weekdays: number
	weekends: number
	discount: number
}

import Button from '../../Components/Button/Button'
import Form from '../../Components/Form/Form'
import Input from '../../Components/Input/Input'
import Label from '../../Components/Label/Label'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal, selectModalProps } from '../../slices/ModalSlice'
import {
	addParkingArea,
	editParkingArea,
	parkingAreasSelector,
	ParkingAreaType,
	selectIsSaving,
} from '../../slices/ParkingAreasSlice'
import { AppDispatch } from '../../store'
import Spinner from '../../Components/Spinner/Spinner'
import toast from 'react-hot-toast'

export default function ParkingAreaForm() {
	const parkingAreaId = useSelector(selectModalProps)
	const parkingAreas = useSelector(parkingAreasSelector)
	const isSaving = useSelector(selectIsSaving)
	const dispatch: AppDispatch = useDispatch()

	const {
		handleSubmit,
		register,
		setValue,
		formState: { errors },
	} = useForm<FormValues>()
	const [formTitle, setFormTitle] = useState('Add Parking Area')

	const handleCloseModal = () => {
		dispatch(closeModal())
	}

	const handleFormatInput = (value: string) => {
		if (value === '') return ''

		if (value.includes(',')) {
			return value.replace(/,/g, '.')
		} else {
			return value.replace(/^0+(?=\d)/, '')
		}
	}

	const onSubmit = (data: FormValues) => {
		const { areaName, weekdays, weekends, discount } = data

		const transformedData: ParkingAreaType = {
			name: areaName,
			hourlyRate: {
				weekdays: +handleFormatInput(weekdays.toString()),
				weekends: +handleFormatInput(weekends.toString()),
			},
			discount: +handleFormatInput(discount.toString()),
			id: '',
		}

		if (parkingAreaId?.id) {
			dispatch(editParkingArea({ id: parkingAreaId.id as string, data: transformedData }))
				.unwrap()
				.then(() => {
					handleCloseModal()
				})
				.then(() => {
					toast.success('Parking area updated successfully')
				})
				.catch(() => {
					toast.error('Failed to update parking area')
				})
		} else {
			dispatch(addParkingArea(transformedData))
				.unwrap()
				.then(() => {
					handleCloseModal()
				})
				.then(() => {
					toast.success('Parking area added successfully')
				})
				.catch(() => {
					toast.error('Failed to add parking area')
				})
		}
	}

	useEffect(() => {
		if (parkingAreaId?.id) {
			setValue('areaName', parkingAreas.find((area: ParkingAreaType) => area.id === parkingAreaId.id)?.name || '')
			setValue(
				'weekdays',
				parkingAreas.find((area: ParkingAreaType) => area.id === parkingAreaId.id)?.hourlyRate.weekdays || 0
			)
			setValue(
				'weekends',
				parkingAreas.find((area: ParkingAreaType) => area.id === parkingAreaId.id)?.hourlyRate.weekends || 0
			)
			setValue('discount', parkingAreas.find((area: ParkingAreaType) => area.id === parkingAreaId.id)?.discount || 0)
			setFormTitle('Edit Parking Area')
		}
	}, [parkingAreaId]) // eslint-disable-line react-hooks/exhaustive-deps

	const Inputs = () => (
		<>
			<div className="form__input-box col-12">
				<Label htmlFor="areaName" label="Parking area name" />
				<Input
					name="areaName"
					className="input w-100"
					placeholder="min. 5 characters"
					register={register}
					errors={errors}
					validate={value => {
						if (value.length < 5) return 'Parking area name must be at least 5 characters'
					}}
				/>
			</div>

			<div className="form__input-box col-12">
				<p className="label">Hourly rate (USD)</p>
				<div className="row">
					<div className="form__input-box--double-input col-6">
						<Label htmlFor="weekdays" label="Weekdays" />
						<Input
							name="weekdays"
							type="number"
							step="0.01"
							className="input w-100"
							placeholder="e.g. 10 or 10.50"
							register={register}
							errors={errors}
							validate={value => {
								if (!value) return 'Weekdays rate is required'
								if (+value < 0) return 'Weekends rate must be greater than 0'
							}}
							// autoFocus
							key={'weekdays'}
						/>
					</div>
					<div className="form__input-box--double-input col-6">
						<Label htmlFor="weekends" label="Weekends" />
						<Input
							name="weekends"
							type="number"
							step="0.01"
							className="input w-100"
							placeholder="e.g. 15 or 15.50"
							register={register}
							errors={errors}
							validate={value => {
								if (!value) return 'Weekends rate is required'
								if (+value < 0) return 'Weekends rate must be greater than 0'
							}}
						/>
					</div>
				</div>
			</div>

			<div className="form__input-box col-12">
				<Label htmlFor="discount" label="Discount (%)" />
				<Input
					name="discount"
					type="number"
					className="input w-100"
					placeholder="e.g. 5"
					register={register}
					errors={errors}
					validate={value => {
						if (value === undefined || value === null || value === '') return 'Discount is required'
						if (value < 0 || value > 100) return 'Discount must be between 0 and 100'
					}}
				/>
			</div>
		</>
	)
	return (
		<Form title={formTitle} exitIcon={true} onSubmit={handleSubmit(onSubmit)} inputs={<Inputs />}>
			<Button className="button__secondary" onClick={handleCloseModal}>
				Cancel
			</Button>
			<Button type="submit" className="button__primary">
				{isSaving ? <Spinner className="form" /> : 'Save'}
			</Button>
		</Form>
	)
}
