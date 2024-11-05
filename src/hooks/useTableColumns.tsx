import { useMemo } from 'react'
import { EditIcon, TrashIcon } from '../assets/icons/Icons'
import Button from '../Components/Button/Button'
import { ParkingAreaType } from '../slices/ParkingAreasSlice'
import { AppDispatch } from '../store'
import { useDispatch } from 'react-redux'
import { openModal } from '../slices/ModalSlice'

export default function useTableColumns(isSmallScreen: boolean) {
	const dispatch: AppDispatch = useDispatch()

	return useMemo(() => {
		if (isSmallScreen) {
			return [
				{
					header: 'Name',
					accessorKey: 'name',
					cell: ({ row }: { row: { original: ParkingAreaType } }) => {
						return (
							<div className="parking-areas-table__name-small">
								<p className="parking-areas-table__name">{row.original.name}</p>
								<div className="parking-areas-table__discount-small">
									{row.original.discount !== 0 && (
										<>
											<p>
												Discount: <span>{row.original.discount}%</span>
											</p>
										</>
									)}

									{row.original.discount === 0 && <p className="parking-areas-table__no-discount">-</p>}
								</div>
							</div>
						)
					},
				},
				{
					header: 'Hourly rate',
					accessorKey: 'hourlyRate',
					cell: ({ row }: { row: { original: ParkingAreaType } }) => {
						return (
							<div className="parking-areas-table__rate">
								<p>
									Weekdays: <span>${row.original.hourlyRate.weekdays}</span>
								</p>
								<p>
									Weekends: <span>${row.original.hourlyRate.weekends}</span>
								</p>
							</div>
						)
					},
				},
				{
					header: 'Actions',
					accessorKey: 'actions',
					cell: ({ row }: { row: { original: ParkingAreaType } }) => {
						return (
							<div className="parking-areas-table__actions">
								<Button
									className="button parking-areas-table__actions--btn button__secondary"
									onClick={() => {
										dispatch(openModal({ type: 'edit', id: row.original.id }))
									}}>
									<EditIcon />
								</Button>

								<Button
									className="button parking-areas-table__actions--btn button__secondary"
									onClick={() => {
										dispatch(openModal({ type: 'delete', id: row.original.id }))
									}}>
									<TrashIcon />
								</Button>
							</div>
						)
					},
				},
			]
		}

		return [
			{
				header: 'Name',
				accessorKey: 'name',
				cell: ({ row }: { row: { original: ParkingAreaType } }) => {
					return <p className="parking-areas-table__name">{row.original.name}</p>
				},
			},
			{
				header: 'Hourly rate',
				accessorKey: 'hourlyRate',
				cell: ({ row }: { row: { original: ParkingAreaType } }) => {
					return (
						<div className="parking-areas-table__rate">
							<p>
								Weekdays: <span>${row.original.hourlyRate.weekdays}</span>
							</p>
							<p>
								Weekends: <span>${row.original.hourlyRate.weekends}</span>
							</p>
						</div>
					)
				},
			},
			{
				header: 'Discount',
				accessorKey: 'discount',
				cell: ({ row }: { row: { original: ParkingAreaType } }) => {
					return (
						<div className="parking-areas-table__discount">
							{row.original.discount !== 0 && (
								<>
									<p>{row.original.discount}%</p>
								</>
							)}

							{row.original.discount === 0 && <p className="parking-areas-table__no-discount">-</p>}
						</div>
					)
				},
			},
			{
				header: 'Actions',
				accessorKey: 'actions',
				cell: ({ row }: { row: { original: ParkingAreaType } }) => {
					return (
						<div className="parking-areas-table__actions">
							<Button
								className="button parking-areas-table__actions--btn button__secondary"
								onClick={() => {
									dispatch(openModal({ type: 'edit', id: row.original.id }))
								}}>
								<EditIcon />
							</Button>

							<Button
								className="button parking-areas-table__actions--btn button__secondary"
								onClick={() => {
									dispatch(openModal({ type: 'delete', id: row.original.id }))
								}}>
								<TrashIcon />
							</Button>
						</div>
					)
				},
			},
		]
	}, [isSmallScreen]) // eslint-disable-line react-hooks/exhaustive-deps
}
