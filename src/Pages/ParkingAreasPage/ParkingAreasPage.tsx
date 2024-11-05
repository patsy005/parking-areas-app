import { useDispatch, useSelector } from 'react-redux'
import Heading from '../../Components/Heading/Heading'
import Modal from '../../Components/Modal/Modal'
import SearchBox from '../../Components/SearchBox/SearchBox'

import SelectComponent from '../../Components/Select/Select'
import ParkingAreaForm from './ParkingAreaForm'
import ParkingAreasTable from './Table/ParkingAreasTable'
import { openModal, selectIsModalOpen, selectModalProps } from '../../slices/ModalSlice'
import Button from '../../Components/Button/Button'
import { AppDispatch } from '../../store'
import ActionConfirmationPrompt from '../../Components/ActionConfirmationPrompt/ActionConfirmationPrompt'
import { deleteParkingArea, setSortBy } from '../../slices/ParkingAreasSlice'

export default function ParkingAreasPage() {
	const isOpen = useSelector(selectIsModalOpen)
	const modalProps = useSelector(selectModalProps)

	const dispatch: AppDispatch = useDispatch()

	const selectOptions = [
		{ value: 'name', label: 'Name' },
		{ value: 'weekdays', label: 'Weekdays hourly rate ↓' },
		{ value: 'weekends', label: 'Weekends hourly rate ↓' },
		{ value: 'discount', label: 'Discount ↑' },
	]

	const openAddParkingAreaModal = () => {
		dispatch(openModal({ type: 'add' }))
	}

	const loadModalContent = () => {
		if (modalProps) {
			if (modalProps.type === 'add') {
				return <ParkingAreaForm />
			}
			if (modalProps.type === 'edit') {
				return <ParkingAreaForm />
			}
			if (modalProps.type === 'delete') {
				return <ActionConfirmationPrompt onConfirm={deleteParkingArea} />
			}
		}
	}

	return (
		<>
			<Modal isOpen={isOpen}>
				{loadModalContent()}
			</Modal>
			<Heading title="Parking Areas">
				<Button className="button__primary" onClick={openAddParkingAreaModal}>
					+ Add new parking area
				</Button>
			</Heading>
			<section className="section parking-areas">
				<div className="container-box">
					<div className="parking-areas__actions">
						<SearchBox />
						<div className="parking-areas__select-box">
							<p>Sort by</p>
							<SelectComponent options={selectOptions} dispatchFn={setSortBy} defaultValue={selectOptions[0]} />
						</div>
					</div>

					<ParkingAreasTable />
				</div>
			</section>
		</>
	)
}
