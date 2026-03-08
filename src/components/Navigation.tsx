import { useState } from 'react'

interface NavigationProps {
  name: string
  nav: Array<{ label: string; href: string }>
}

export default function Navigation({ name, nav }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <>
      <a href="/" className="logo">
        {name}
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <span className="hamburger"></span>
        </button>
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
    </>
  )
}
