import clsx from 'clsx'

import type { PlaylistVideo } from '../../types/playlist.types'
import { PlaylistItem } from './PlaylistItem'

interface PlaylistSidebarProps {
  videos: PlaylistVideo[]
  activeVideoId: string | null
  onSelect: (videoId: string) => void
  isPortrait: boolean
  className?: string
}

export const PlaylistSidebar = ({
  videos,
  activeVideoId,
  onSelect,
  isPortrait,
  className,
}: PlaylistSidebarProps) => (
  <div
    className={clsx(
      isPortrait ? 'relative min-w-0 sm:flex-1' : 'max-h-64 overflow-y-auto',
      className,
    )}
  >
    <div
      className={clsx(
        isPortrait && 'sm:absolute sm:inset-0 sm:overflow-y-auto',
      )}
    >
      <div className="space-y-1.5">
        {videos.map((video) => (
          <PlaylistItem
            key={video.videoId}
            video={video}
            isActive={video.videoId === activeVideoId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  </div>
)
