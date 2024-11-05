import { ComponentPropsWithoutRef } from 'react'
import { FieldErrors, FieldValues, Path, RegisterOptions, UseFormRegister } from 'react-hook-form'

type InputProps<T extends FieldValues = FieldValues> = {
	className?: string
	name: Path<T>
	register?: UseFormRegister<T>
	isRequired?: boolean
	errors?: FieldErrors<T>
	validate?: RegisterOptions['validate']
} & ComponentPropsWithoutRef<'input'>

export default function Input<T extends FieldValues>({
	className,
	name,
	register,
	isRequired,
	errors,
	validate,
	...rest
}: InputProps<T>) {
	return (
		<>
			<input
				className={`${className} ${errors && errors[name] ? 'input-error' : ''}`}
				{...(register
					? register(name, {
							required: isRequired ? 'This field is required' : '',
							validate: validate,
					  })
					: {})}
				{...rest}
			/>
			{errors && errors[name] && <span className="input-error__text">{String(errors[name]?.message)}</span>}
		</>
	)
}
