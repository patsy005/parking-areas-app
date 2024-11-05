import Heading from '../../Components/Heading/Heading'
import { Controller, useForm } from 'react-hook-form'
import Form from '../../Components/Form/Form'
import Button from '../../Components/Button/Button'
import Label from '../../Components/Label/Label'
import SelectComponent from '../../Components/Select/Select'
import { useDispatch, useSelector } from 'react-redux'
import {
	calculatePayment,
	parkingAreasSelector,
	selectCalculatedPayment,
	selectIsSaving,
	setCaltulatedPayment,
} from '../../slices/ParkingAreasSlice'
import DatePickerComponent from '../../Components/DatePicker/DatePickerComponent'
import moment from 'moment'
import { useState } from 'react'
import { CalendarIcon, ClockIcon } from '../../assets/icons/Icons'
import { AppDispatch } from '../../store'
import Spinner from '../../Components/Spinner/Spinner'
import toast from 'react-hot-toast'

type FormValues = {
	areaName: string
	date: string
	timeFrom: string
	timeTo: string
	currency: string
}

export default function PaymentsPage() {
	const parkingAreas = useSelector(parkingAreasSelector)
	const isSaving = useSelector(selectIsSaving)
	const calculatedPayment = useSelector(selectCalculatedPayment)
	const [parkingDate, setParkingDate] = useState<Date | null>(null)
	const [startTime, setStartTime] = useState<Date | null>(null)
	const dispatch: AppDispatch = useDispatch()

	const {
		handleSubmit,
		control,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<FormValues>()

	const onSubmit = (data: FormValues) => {
		const { areaName, date, timeFrom, timeTo, currency } = data
		console.log(data)

		const transformedData = {
			areaName: areaName,
			date: moment(date).format('YYYY-MM-DD'),
			timeFrom: moment(timeFrom).format('HH:mm'),
			timeTo: moment(timeTo).format('HH:mm'),
			currency: currency === undefined ? 'USD' : currency,
		}

		dispatch(calculatePayment(transformedData))
			.then(() => {
				toast.success('Payment calculated successfully')
			})
			.catch(() => {
				toast.error('An error occurred while calculating payment')
			})
	}

	const onClearForm = () => {
		setValue('areaName', '')
		setValue('date', '')
		setValue('timeFrom', '')
		setValue('timeTo', '')
		setValue('currency', '')
		dispatch(setCaltulatedPayment(null))
	}

	const currencyOptions = [
		{ value: 'USD', label: 'USD' },
		{ value: 'EUR', label: 'EUR' },
		{ value: 'PLN', label: 'PLN' },
	]

	const parkingAreasOptions = parkingAreas.map(area => ({
		value: area.id,
		label: area.name,
	}))

	const Inputs = () => (
		<>
			<div className="form__input-box col-12">
				<Label htmlFor="areaName" label="Parking area name" />
				<Controller
					control={control}
					name="areaName"
					rules={{
						required: 'Parking area selection is required',
						validate: value => value !== '' || 'Please select parking area',
					}}
					render={({ field: { onChange, value } }) => (
						<SelectComponent
							id="areaName"
							name="areaName"
							options={parkingAreasOptions}
							onChangeFn={onChange}
							placeholder="Select parking area"
							value={parkingAreasOptions.find(option => option.value === value)}
						/>
					)}
				/>
				{errors.areaName && <span className="input-error__text">{errors.areaName.message}</span>}
			</div>

			<div className="form__input-box col-12">
				<Label htmlFor="date" label="Parking date" />
				<Controller
					control={control}
					name="date"
					rules={{
						validate: value => {
							if (!value) return 'Start date is required'
						},
					}}
					render={({ field: { onChange } }) => (
						<DatePickerComponent
							name="date"
							errors={errors}
							onChange={(date: Date | null) => {
								setParkingDate(date)
								onChange(date)
							}}
							shouldCloseOnSelect={true}
							dateFormat="dd.MM.yyyy"
							minDate={moment().toDate()}
							locale="en"
							withPortal
							selected={parkingDate}
							icon={<CalendarIcon />}
						/>
					)}
				/>
				{errors.date && <span className="input-error__text">{errors.date.message}</span>}
			</div>

			<div className="form__input-box col-12">
				<div className="row">
					<div className="form__input-box col-6">
						<Label htmlFor="timeFrom" label="Time from" />
						<Controller
							control={control}
							name="timeFrom"
							rules={{
								validate: value => {
									if (!value) return 'Start date is required'
								},
							}}
							render={({ field: { onChange, value } }) => (
								<DatePickerComponent
									name="timeFrom"
									errors={errors}
									onChange={(time: Date | null) => {
										setStartTime(time)
										onChange(time)
									}}
									shouldCloseOnSelect={true}
									timeFormat="HH:mm"
									showTimeSelect
									showTimeSelectOnly
									value={value ? moment(value).format('HH:mm') : ''}
									selected={value ? new Date(value) : null}
									timeIntervals={15}
									icon={<ClockIcon />}
								/>
							)}
						/>
						{errors.timeFrom && <span className="input-error__text">{errors.timeFrom.message}</span>}
					</div>

					<div className="form__input-box col-6">
						<Label htmlFor="timeTo" label="Time to" />
						<Controller
							control={control}
							name="timeTo"
							rules={{
								validate: value => {
									if (!value) return 'Start date is required'
									if (value <= getValues('timeFrom')) return 'End time should be greater than start time'
								},
							}}
							render={({ field: { onChange, value } }) => (
								<DatePickerComponent
									name="timeTo"
									errors={errors}
									onChange={(time: Date | null) => {
										onChange(time)
									}}
									shouldCloseOnSelect={true}
									timeFormat="HH:mm"
									minTime={moment(startTime).toDate()}
									maxTime={new Date(new Date().setHours(23, 59, 59))}
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={15}
									value={value ? moment(value).format('HH:mm') : ''}
									selected={value ? new Date(value) : null}
									icon={<ClockIcon />}
								/>
							)}
						/>
						{errors.timeTo && <span className="input-error__text">{errors.timeTo.message}</span>}
					</div>
				</div>
			</div>

			<div className="form__input-box">
				<Label htmlFor="currency" label="Currency" />
				<Controller
					control={control}
					name="currency"
					rules={{}}
					render={({ field: { onChange, value } }) => (
						<SelectComponent
							id="currency"
							name="currency"
							options={currencyOptions}
							onChangeFn={onChange}
							placeholder="Select parking area"
							defaultValue={currencyOptions[0]}
							value={currencyOptions.find(option => option.value === value)}
						/>
					)}
				/>
				{errors.currency && <span className="input-error__text">{errors.currency.message}</span>}
			</div>
		</>
	)

	return (
		<>
			<Heading title="Calculate parking payment" />
			<section className="section payments-page">
				<Form title="Enter parking data" onSubmit={handleSubmit(onSubmit)} inputs={<Inputs />}>
					{calculatedPayment > 0 && !isSaving && (
						<div className="d-flex gap-3 calculate-result flex-column">
							<p className="amount">
								Amount to be paid:{' '}
								<span>
									{calculatedPayment} {getValues('currency') ?? 'USD'}
								</span>
							</p>
							<p className="due-date">
								Due date: <span>{moment().format('DD-MM-YYYY')}</span>
							</p>
						</div>
					)}
					<div className="d-flex justify-content-end">
						<Button type="reset" className="button__secondary me-4" onClick={onClearForm}>
							Clear
						</Button>
						<Button type="submit" className="button__primary">
							{isSaving ? <Spinner className="form" /> : 'Calculate'}
						</Button>
					</div>
				</Form>
			</section>
		</>
	)
}
