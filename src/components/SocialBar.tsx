import type { IconType } from 'react-icons'
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaSoundcloud,
} from 'react-icons/fa'

type SocialIconName = 'linkedin' | 'soundcloud' | 'facebook' | 'instagram'

type SocialLink = {
  name: string
  url: string
  icon: SocialIconName
}

type SocialBarProps = {
  links: readonly SocialLink[]
}

const socialIcons: Record<SocialIconName, IconType> = {
  linkedin: FaLinkedin,
  soundcloud: FaSoundcloud,
  facebook: FaFacebook,
  instagram: FaInstagram,
}

export default function SocialBar({ links }: SocialBarProps) {
  return (
    <div className="social-bar">
      {links.map((social) => {
        const Icon = socialIcons[social.icon]

        return (
          <a
            key={social.url}
            href={social.url}
            target="_blank"
            rel="noopener"
            aria-label={social.name}
          >
            <Icon aria-hidden="true" focusable="false" />
          </a>
        )
      })}
    </div>
  )
}
