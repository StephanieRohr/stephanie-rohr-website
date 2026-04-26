interface BrandLinkProps {
  href?: string
  name: string
}

export const BrandLink = ({ href = '/', name }: BrandLinkProps) => {
  return (
    <a
      href={href}
      className="font-heading gradient-logo text-[1.2rem] font-bold tracking-widest whitespace-nowrap transition-opacity hover:opacity-70"
    >
      {name}
    </a>
  )
}
