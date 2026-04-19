import type { IconType } from 'react-icons'
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaSoundcloud,
} from 'react-icons/fa'

type SocialIconName = 'linkedin' | 'soundcloud' | 'facebook' | 'instagram'

type SocialIconLinkProps = {
  icon: SocialIconName
  name: string
  url: string
}

const socialIcons: Record<SocialIconName, IconType> = {
  linkedin: FaLinkedin,
  soundcloud: FaSoundcloud,
  facebook: FaFacebook,
  instagram: FaInstagram,
}

export const SocialIconLink = ({ icon, name, url }: SocialIconLinkProps) => {
  const Icon = socialIcons[icon]

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener"
      aria-label={name}
      className="flex text-muted transition-colors hover:text-accent"
    >
      <Icon aria-hidden="true" focusable="false" />
    </a>
  )
}
