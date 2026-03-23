interface NavToggleButtonProps {
  expanded: boolean
  controls: string
  onClick: () => void
}

export default function NavToggleButton({
  expanded,
  controls,
  onClick,
}: NavToggleButtonProps) {
  return (
    <button
      type="button"
      className="nav-toggle"
      aria-expanded={expanded}
      aria-controls={controls}
      aria-label="Toggle navigation"
      onClick={onClick}
    >
      <span className="hamburger"></span>
    </button>
  )
}
