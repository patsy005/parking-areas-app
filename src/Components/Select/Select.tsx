import Select, { components } from 'react-select'
import { ArrowIcon } from '../../assets/icons/Icons'
import { AppDispatch } from '../../store'
import { useDispatch } from 'react-redux'

type OptionType = {
	value: string
	label: string
}

type OptionsType = OptionType[]

type SelectProps = {
	options: OptionsType
	dispatchFn?: (value: string) => { type: string; payload: string }
	onChangeFn?: (value: string) => void
} & React.ComponentProps<typeof Select>

export default function SelectComponent({ options, dispatchFn, onChangeFn, ...props }: SelectProps) {
	const dispatch: AppDispatch = useDispatch()

	const CustomDropdownIndicator = (props: any) => {
		return (
			<components.DropdownIndicator {...props}>
				<ArrowIcon />
			</components.DropdownIndicator>
		)
	}

	const onChange = (e: any) => {
		if (dispatchFn) {
			dispatch(dispatchFn(e.value))
		} else {
			if (onChangeFn) {
				onChangeFn(e.value)
			}
		}
	}

	return (
		<Select
			options={options}
			className="select"
			classNamePrefix="select"
			components={{ DropdownIndicator: CustomDropdownIndicator }}
			onChange={(e: any) => onChange(e)}
			{...props}
		/>
	)
}
