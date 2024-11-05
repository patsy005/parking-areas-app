import { SubmitHandler } from 'react-hook-form'
import FormTitle from './FormTitle'
import { ExitBigIcon } from '../../assets/icons/Icons'
import { AppDispatch } from '../../store'
import { useDispatch } from 'react-redux'
import { closeModal } from '../../slices/ModalSlice'

type FormProps = {
	title: string
	inputs?: React.ReactNode
	children?: React.ReactNode
	onSubmit: SubmitHandler<any>
	exitIcon?: boolean
}

export default function Form({ title, inputs, children, exitIcon, onSubmit }: FormProps) {
	const dispatch: AppDispatch = useDispatch()

	const handleSubmit = (data: any) => {
		onSubmit(data)
	}

	const handleCloseModal = () => {
		dispatch(closeModal())
	}
	return (
		<form className="form row container-box" onSubmit={handleSubmit}>
			<div className="form__top d-flex justify-content-between col-12">
				<FormTitle title={title} />
				{exitIcon && (
					<button className="form__exit-button" onClick={handleCloseModal}>
						<ExitBigIcon />
					</button>
				)}
			</div>

			<div className="form__inputs col-12">{inputs}</div>
			<div className="form__actions col-12">{children}</div>
		</form>
	)
}
