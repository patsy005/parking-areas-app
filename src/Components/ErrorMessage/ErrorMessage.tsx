type ErrorMessageProps = {
	message: string
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
	return (
		<div className="container-box container-box__error">
			<h3>{message}</h3>
		</div>
	)
}
