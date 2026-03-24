interface BrandLinkProps {
  href?: string
  name: string
}

export const BrandLink = ({ href = '/', name }: BrandLinkProps) => {
  return (
    <a href={href} className="logo">
      {name}
    </a>
  )
}
