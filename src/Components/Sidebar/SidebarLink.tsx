import { type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

type SidebarLinkProps = {
	icon: ReactNode
	activeIcon: ReactNode
	to: string
}

export default function SidebarLink({ icon, activeIcon, to }: SidebarLinkProps) {
	const linkText = to === '/' ? 'Parking Areas' : to.replace('/', '')
	return (
		<>
			<NavLink to={to} className="sidebar__link">
				{({ isActive }) => (
					<>
						{isActive ? activeIcon : icon}
						<span>{linkText}</span>
					</>
				)}
			</NavLink>
		</>
	)
}
