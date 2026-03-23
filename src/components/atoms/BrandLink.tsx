interface BrandLinkProps {
  href?: string
  name: string
}

export default function BrandLink({
  href = '/',
  name,
}: BrandLinkProps) {
  return (
    <a href={href} className="logo">
      {name}
    </a>
  )
}
