import { ComponentPropsWithoutRef } from 'react'
import ReactDOM from 'react-dom'
import { useDispatch } from 'react-redux'
import { closeModal } from '../../slices/ModalSlice'

type ModalProps = {
	isOpen: boolean
	children: React.ReactNode
} & ComponentPropsWithoutRef<'div'>

export default function Modal({ isOpen, children, ...props }: ModalProps) {
	const dispatch = useDispatch()

	if (!isOpen) return null

	const handleOverlayClick = () => {
		dispatch(closeModal())
	}

	return ReactDOM.createPortal(
		<div className="modal__overlay" {...props} onClick={handleOverlayClick}>
			<div className="modal__content">{children}</div>
		</div>,
		document.body
	)
}
