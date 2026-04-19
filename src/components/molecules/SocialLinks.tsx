import { SocialIconLink } from '../atoms/SocialIconLink'

type SocialLink = {
  name: string
  url: string
  icon: 'linkedin' | 'soundcloud' | 'facebook' | 'instagram'
}

type SocialLinksProps = {
  links: readonly SocialLink[]
  className?: string
}

export const SocialLinks = ({
  links,
  className = 'flex items-center gap-3 max-lg:hidden',
}: SocialLinksProps) => {
  return (
    <div className={className}>
      {links.map((social) => (
        <SocialIconLink
          key={social.url}
          icon={social.icon}
          name={social.name}
          url={social.url}
        />
      ))}
    </div>
  )
}
