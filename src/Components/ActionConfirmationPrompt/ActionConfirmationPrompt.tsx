import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../store'
import Button from '../Button/Button'
import FormTitle from '../Form/FormTitle'
import { closeModal, selectModalProps } from '../../slices/ModalSlice'
import { parkingAreasSelector, selectIsSaving } from '../../slices/ParkingAreasSlice'
import { AsyncThunk } from '@reduxjs/toolkit'
import Spinner from '../Spinner/Spinner'
import toast from 'react-hot-toast'

type ActionConfirmationPromptProps = {
	onConfirm?: AsyncThunk<any, { id: string }, {}>
}

export default function ActionConfirmationPrompt({ onConfirm }: ActionConfirmationPromptProps) {
	const dispatch: AppDispatch = useDispatch()
	const modalProps = useSelector(selectModalProps)
	const parkingAreas = useSelector(parkingAreasSelector)
	const isSaving = useSelector(selectIsSaving)

	const handleConfirm = () => {
		if (modalProps && onConfirm) {
			dispatch(onConfirm({ id: modalProps?.id }))
				.unwrap()
				.then(() => handleClose())
				.then(() => toast.success(`Parking area ${modalProps.type}ed successfully`))
				.catch(() => toast.error(`Failed to ${modalProps.type} parking area`))
		}
	}

	const handleClose = () => {
		dispatch(closeModal())
	}

	const generateMessage = () => {
		if (modalProps) {
			const parkingArea = parkingAreas.find(area => area.id === modalProps.id)
			return `Are you sure you want to ${modalProps.type} ${parkingArea?.name} area?`
		}
		return 'Are you sure you want to perform this action?'
	}

	return (
		<div className="container-box confirmation-prompt">
			<FormTitle title={generateMessage()} />

			<div className="confirmation-prompt__btns d-flex justify-content-end">
				<Button className="button__secondary mx-4" onClick={handleClose}>
					Cancel
				</Button>
				<Button className="button__danger" onClick={handleConfirm}>
					{isSaving ? <Spinner className="form" /> : 'Delete'}
				</Button>
			</div>
		</div>
	)
}
