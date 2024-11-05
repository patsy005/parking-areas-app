import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../Components/Sidebar/Sidebar'
import { AppDispatch } from '../store'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchParkingAreas, selectError, selectIsLoading } from '../slices/ParkingAreasSlice'
import Spinner from '../Components/Spinner/Spinner'
import ToasterComponent from '../Components/Toaster/Toaster'
import ErrorMessage from '../Components/ErrorMessage/ErrorMessage'

export default function Layout() {
	const dispatch: AppDispatch = useDispatch()
	const isLoading = useSelector(selectIsLoading)
	const error = useSelector(selectError)
	const location = useLocation()

	useEffect(() => {
		dispatch(fetchParkingAreas())
	}, [dispatch])

	return (
		<>
			{isLoading && (
				<div className="isLoading">
					<Spinner className="page" />
				</div>
			)}

			{!isLoading && error && <ErrorMessage message={error} />}

			{!isLoading && !error && (
				<div className={`layout d-flex flex-column ${location.pathname.replace('/', '')}-layout`}>
					<div className="col-12 col-lg-2 order-2 order-lg-1 sidebarContainer left-column">
						<Sidebar />
					</div>
					<main className="main col-12 col-lg-10 order-1 order-lg-2 right-column container">
						<ToasterComponent />
						<Outlet />
					</main>
				</div>
			)}
		</>
	)
}
