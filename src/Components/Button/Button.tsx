import { type ReactNode, type ComponentPropsWithoutRef } from 'react'

type ButtonProps = {
	children?: string | ReactNode
	className: string
} & ComponentPropsWithoutRef<'button'>

export default function Button({ children, className, ...props }: ButtonProps) {
	return (
		<button className={`button ${className}`} {...props}>
			{children}
		</button>
	)
}
