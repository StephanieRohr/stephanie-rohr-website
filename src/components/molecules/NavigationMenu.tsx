import { useState } from 'react'

import { NavToggleButton } from '../atoms/NavToggleButton'

interface NavigationMenuProps {
  nav: Array<{ label: string; href: string }>
}

export const NavigationMenu = ({ nav }: NavigationMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <nav className="main-nav" aria-label="Main navigation">
      <NavToggleButton
        expanded={menuOpen}
        controls="nav-menu"
        onClick={toggleMenu}
      />
      <ul id="nav-menu" className={`nav-list ${menuOpen ? 'open' : ''}`}>
        {nav.map((item) => (
          <li key={item.href}>
            <a href={item.href} className="nav-link" onClick={closeMenu}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
