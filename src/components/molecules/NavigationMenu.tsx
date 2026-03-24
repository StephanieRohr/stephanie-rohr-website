import { useState } from 'react'

import { NavToggleButton } from '../atoms/NavToggleButton'
import { SocialLinks } from './SocialLinks'

type SocialLink = {
  name: string
  url: string
  icon: 'linkedin' | 'soundcloud' | 'facebook' | 'instagram'
}

interface NavigationMenuProps {
  nav: Array<{ label: string; href: string }>
  social?: readonly SocialLink[]
}

export const NavigationMenu = ({ nav, social }: NavigationMenuProps) => {
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
        {social && (
          <li className="nav-social">
            <SocialLinks links={social} />
          </li>
        )}
      </ul>
    </nav>
  )
}
