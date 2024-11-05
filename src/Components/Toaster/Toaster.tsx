import { Toaster } from 'react-hot-toast'

export default function ToasterComponent() {
	return (
		<>
			<Toaster
				position="top-center"
				gutter={12}
				containerStyle={{ margin: '10px', borderRadius: '8px' }}
				toastOptions={{
					success: {
						duration: 5000,
						style: {
							backgroundColor: '#3192a3',
							border: '1px solid #3192a3',
						},
						iconTheme: {
							primary: '#fff',
							secondary: '#3192a3',
						},
					},
					error: {
						duration: 5000,
						style: {
							backgroundColor: '#C71F3C',
							border: '1px solid #C71F3C',
						},
						iconTheme: {
							primary: '#fff',
							secondary: '#C71F3C',
						},
					},
					style: {
						fontFamily: 'inherit',
						borderRadius: '8px',
						fontSize: '14px',
						maxWidth: '400px',
						padding: '16px',
						color: '#fff',
						boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
						gap: '8px',
					},
				}}
			/>
		</>
	)
}
