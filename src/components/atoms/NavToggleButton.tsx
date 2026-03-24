interface NavToggleButtonProps {
  expanded: boolean
  controls: string
  onClick: () => void
}

export const NavToggleButton = ({
  expanded,
  controls,
  onClick,
}: NavToggleButtonProps) => {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls={controls}
      aria-label="Toggle navigation"
      onClick={onClick}
      className="nav-toggle"
    >
      <span className="sr-only">Menu</span>
      <svg
        className="nav-toggle-icon"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <rect
          className="nav-toggle-bar nav-toggle-bar--top"
          y="7"
          width="9"
          height="2"
          rx="1"
        />
        <rect
          className="nav-toggle-bar nav-toggle-bar--middle"
          y="7"
          width="16"
          height="2"
          rx="1"
        />
        <rect
          className="nav-toggle-bar nav-toggle-bar--bottom"
          y="7"
          width="9"
          height="2"
          rx="1"
        />
      </svg>
    </button>
  )
}
