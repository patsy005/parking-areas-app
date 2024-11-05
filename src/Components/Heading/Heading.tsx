import { type ReactNode } from 'react'

type HeadingProps = {
	title: string
	children?: ReactNode
}

export default function Heading({ title, children }: HeadingProps) {
	return (
		<header className="header d-flex">
			<h1>{title}</h1>
			<div>{children}</div>
		</header>
	)
}
