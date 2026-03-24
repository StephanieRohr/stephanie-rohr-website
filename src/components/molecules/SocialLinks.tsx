import { SocialIconLink } from '../atoms/SocialIconLink'

type SocialLink = {
  name: string
  url: string
  icon: 'linkedin' | 'soundcloud' | 'facebook' | 'instagram'
}

type SocialLinksProps = {
  links: readonly SocialLink[]
}

export const SocialLinks = ({ links }: SocialLinksProps) => {
  return (
    <div className="social-bar">
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
