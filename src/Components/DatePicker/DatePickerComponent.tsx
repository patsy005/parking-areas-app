import { FieldErrors, FieldValues } from 'react-hook-form'
import DatePicker, { DatePickerProps } from 'react-datepicker'
import { type ReactNode } from 'react'

type DatePickerComponentProps<T extends FieldValues = FieldValues> = {
	errors: FieldErrors<T>
	name: string
	icon: ReactNode
} & Pick<
	DatePickerProps,
	| 'onChange'
	| 'dateFormat'
	| 'date'
	| 'minDate'
	| 'locale'
	| 'withPortal'
	| 'value'
	| 'shouldCloseOnSelect'
	| 'timeFormat'
	| 'showTimeSelect'
	| 'showDateSelect'
	| 'showTimeSelectOnly'
	| 'selected'
	| 'minTime'
	| 'maxTime'
	| 'timeIntervals'
> & {
		onChange: (date: Date | null) => void
	}

export default function DatePickerComponent<T extends FieldValues>({
	errors,
	name,
	onChange,
	icon,
	...props
}: DatePickerComponentProps<T>) {
	return (
		<>
			<div className={`date-picker ${errors[name] ? 'date-picker__error' : ''}`}>
				<div className="date-picker__input">
					<DatePicker {...props} onChange={onChange} />
				</div>
				<div>{icon}</div>
			</div>
		</>
	)
}
