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

  const mobilePanel = menuOpen
    ? 'absolute inset-x-0 top-nav flex flex-col border-b border-line bg-white/95 px-6 py-4'
    : 'hidden'

  return (
    <nav aria-label="Main navigation">
      <NavToggleButton
        expanded={menuOpen}
        controls="nav-menu"
        onClick={toggleMenu}
      />
      <ul
        id="nav-menu"
        className={`list-none lg:static lg:flex lg:gap-8 lg:border-0 lg:bg-transparent lg:p-0 ${mobilePanel}`}
      >
        {nav.map((item) => (
          <li
            key={item.href}
            className="border-b border-line py-3 last:border-0 lg:border-0 lg:p-0"
          >
            <a
              href={item.href}
              onClick={closeMenu}
              className="font-heading relative py-1 text-[0.85rem] font-bold tracking-[0.15em] uppercase transition-colors hover:text-accent after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:gradient-underline after:transition-[width] hover:after:w-full"
            >
              {item.label}
            </a>
          </li>
        ))}
        {social && (
          <li className="pt-2 lg:hidden">
            <SocialLinks links={social} className="flex items-center gap-4" />
          </li>
        )}
      </ul>
    </nav>
  )
}
