import { useCallback, useEffect, useState } from 'react'
import Table from '../../../Components/Table/Table'
import useTableColumns from '../../../hooks/useTableColumns'
import { useSelector } from 'react-redux'
import {
	parkingAreasSelector,
	ParkingAreaType,
} from '../../../slices/ParkingAreasSlice'

export default function ParkingAreasTable() {
	const parkingAreas = useSelector(parkingAreasSelector)

	const [data, setData] = useState<ParkingAreaType[]>(() => parkingAreas as ParkingAreaType[])

	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 })
	const [isSmallScreen, setIsSmallScreen] = useState(false)

	const checkScreenSize = () => {
		if (window.innerWidth < 768) {
			setIsSmallScreen(true)
		} else {
			setIsSmallScreen(false)
		}
	}

	const setTableDataCallback = useCallback(() => {
		setData(parkingAreas)
	}, [parkingAreas])

	useEffect(() => {
		setTableDataCallback()
	}, [setTableDataCallback])


	useEffect(() => {
		checkScreenSize()
		window.addEventListener('resize', checkScreenSize)
		return () => {
			window.removeEventListener('resize', checkScreenSize)
		}
	}, [])

	const columns = useTableColumns(isSmallScreen)

	return (
		<>
			<Table
				data={data}
				columns={columns}
				pagination={pagination}
				setPagination={setPagination}
			/>
		</>
	)
}
