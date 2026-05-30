// Inspired by https://cruip.com/hamburger-menu-button-animations-with-tailwind-css/

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
      className="group inline-flex size-12 items-center justify-center transition-all duration-150 ease-in-out lg:hidden"
    >
      <span className="sr-only">Menu</span>
      <svg
        className="pointer-events-none size-6 fill-current"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <rect
          className="origin-center -translate-y-1.25 translate-x-1.75 transition-all duration-300 ease-[cubic-bezier(0.5,0.85,0.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
          y="7"
          width="9"
          height="2"
          rx="1"
        />
        <rect
          className="origin-center transition-all duration-300 ease-[cubic-bezier(0.5,0.85,0.25,1.8)] group-aria-expanded:rotate-45"
          y="7"
          width="16"
          height="2"
          rx="1"
        />
        <rect
          className="origin-center translate-y-1.25 transition-all duration-300 ease-[cubic-bezier(0.5,0.85,0.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
          y="7"
          width="9"
          height="2"
          rx="1"
        />
      </svg>
    </button>
  )
}
