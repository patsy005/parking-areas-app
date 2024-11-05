import { NavLinkActiveParkingAreasIcon, NavLinkActivePaymentsIcon, NavLinkParkingAreasIcon, NavLinkPaymentsIcon } from '../../assets/icons/Icons'
import SidebarLink from './SidebarLink'

export default function Sidebar() {
	return (
		<nav className="sidebar">
			<ul className="sidebar__list d-flex align-items-center justify-content-center">
				<SidebarLink to="/" icon={<NavLinkParkingAreasIcon />} activeIcon={<NavLinkActiveParkingAreasIcon />} />
				<SidebarLink to="/payments" icon={<NavLinkPaymentsIcon />} activeIcon={<NavLinkActivePaymentsIcon />} />
			</ul>
		</nav>
	)
}
