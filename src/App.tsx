import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layouts/Layout'
import ParkingAreasPage from './Pages/ParkingAreasPage/ParkingAreasPage'
import PaymentsPage from './Pages/PaymentsPage/PaymentsPage'

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <ParkingAreasPage />,
			},
			{
				path: '/payments',
				element: <PaymentsPage />,
			},
		],
	},
])
function App() {

	return <RouterProvider router={router}></RouterProvider>
}

export default App
