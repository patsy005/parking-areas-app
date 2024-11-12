import { ComponentPropsWithoutRef } from 'react'
import ReactDOM from 'react-dom'

type ModalProps = {
	isOpen: boolean
	children: React.ReactNode
} & ComponentPropsWithoutRef<'div'>

export default function Modal({ isOpen, children, ...props }: ModalProps) {

	if (!isOpen) return null

	return ReactDOM.createPortal(
		<div className="modal__overlay" {...props}>
			<div className="modal__content">{children}</div>
		</div>,
		document.body
	)
}
