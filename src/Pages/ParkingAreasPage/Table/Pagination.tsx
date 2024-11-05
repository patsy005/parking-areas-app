import { useMemo } from 'react'
import { ArrowIcon } from '../../../assets/icons/Icons'
import Button from '../../../Components/Button/Button'
import SelectComponent from '../../../Components/Select/Select'
import { Table } from '@tanstack/react-table'

type PaginationProps = {
	table: Table<any>
}

export default function Pagination({ table }: PaginationProps) {
	const selectOptions = useMemo(() => {
		const sizes = []
		const pageSize = table.getState().pagination.pageSize
		const totalResultsNum = Object.keys(table.getRowModel().rowsById).length

		for (let size = pageSize; size <= totalResultsNum; size += pageSize) {
			sizes.push(size)
		}

		const sizesOptions = sizes.map(o => ({
			value: o.toString(),
			label: o.toString(),
		}))

		return [...sizesOptions, { value: totalResultsNum.toString(), label: 'All' }]
	}, [table])

	const handleSelectChange = (newValue: unknown) => {
		const value = (newValue as { value: string }).value
		const pageIndex = 0
		const pageSize = Number(value)
		table.setPageSize(pageSize)
		table.setPageIndex(pageIndex)
	}

	return (
		<div className="pagination-row">
			<div className="pagination-num-results d-flex">
				<p>Show</p>
				<SelectComponent options={selectOptions} onChange={handleSelectChange} defaultValue={selectOptions[0]} />
				<span>of {Object.keys(table.getRowModel().rowsById).length} results</span>
			</div>
			<p className="pagination-page-count">
				Page <span className="pagination-page-count__current-page">{table.getState().pagination.pageIndex + 1} </span>
				<span>of {table.getPageCount()}</span>
			</p>
			{Object.keys(table.getRowModel().rowsById).length > table.getState().pagination.pageSize && (
				<div className="pagination-btns d-flex justify-content-end">
					<div className="pagination-btns__next-prev">
						<Button
							className="pagination-btns__next-prev--prev pagination-btns__next-prev--btn button__secondary"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}>
							<ArrowIcon />
							<span>Prev</span>
						</Button>
					</div>
					<div className="pagination-btns__next-prev">
						<Button
							className="pagination-btns__next-prev--next pagination-btns__next-prev--btn button__secondary"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}>
							<span>Next</span>
							<ArrowIcon />
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
