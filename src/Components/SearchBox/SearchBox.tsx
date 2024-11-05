import { useDispatch, useSelector } from 'react-redux'
import { ExitSmallIcon, SearchIcon } from '../../assets/icons/Icons'
import { AppDispatch } from '../../store'
import Input from '../Input/Input'
import { selectSearchQuery, setSearchQuery } from '../../slices/ParkingAreasSlice'
import { useState } from 'react'

export default function SearchBox() {
	const dispatch: AppDispatch = useDispatch()
	const searchQuery = useSelector(selectSearchQuery)
	const [value, setValue] = useState('')

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(setSearchQuery(e.target.value))
		setValue(e.target.value)
	}

	const handleClearSearch = () => {
		dispatch(setSearchQuery(''))
		setValue('')
	}

	return (
		<div className="search-box">
			<div>{searchQuery ? <ExitSmallIcon onClick={handleClearSearch} /> : <SearchIcon />}</div>
			<div className="search-box__input-box">
				<Input
					placeholder="Search parking areas"
					value={value}
					name="search"
					className="search-box__input"
					onChange={handleSearch}
				/>
			</div>
		</div>
	)
}
