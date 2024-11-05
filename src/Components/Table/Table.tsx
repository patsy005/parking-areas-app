import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import React from 'react'
import Pagination from '../../Pages/ParkingAreasPage/Table/Pagination'

type TableProps<T> = {
	data: T[]
	columns: ColumnDef<T, unknown>[]
	pagination: {
		pageIndex: number
		pageSize: number
	}
	setPagination: React.Dispatch<
		React.SetStateAction<{
			pageIndex: number
			pageSize: number
		}>
	>
}

export default function Table<T>({ data, columns, pagination, setPagination }: TableProps<T>) {
	const table = useReactTable({
		data,
		columns,
		state: {
			pagination,
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
	})

	return (
		<div className={`col-12 table-container`}>
			<table className="table table-hover">
				<thead className="border-bottom">
					{table.getHeaderGroups().map(headerGroup => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map(header => (
								<th className="table__header" key={header.id}>
									{flexRender(header.column.columnDef.header, header.getContext())}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{data.length === 0 ? (
						<tr>
							<td colSpan={columns.length} style={{ textAlign: 'center', color: '#091F42' }}>
								No parking areas found for the provided search criteria. Please try again with different search.
							</td>
						</tr>
					) : (
						table.getRowModel().rows.map(row => (
							<tr key={row.id} className="border-bottom">
								{row.getVisibleCells().map(cell => (
									<td className="table__cell" key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))
					)}
				</tbody>
			</table>
			{data.length > 0 && <Pagination table={table} />}
		</div>
	)
}
