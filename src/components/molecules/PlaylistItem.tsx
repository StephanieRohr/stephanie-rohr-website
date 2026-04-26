import clsx from 'clsx'

import type { PlaylistVideo } from '../../types/playlist.types'

interface PlaylistItemProps {
  video: PlaylistVideo
  isActive: boolean
  onSelect: (videoId: string) => void
  className?: string
}

export const PlaylistItem = ({
  video,
  isActive,
  onSelect,
  className,
}: PlaylistItemProps) => (
  <button
    type="button"
    onClick={() => onSelect(video.videoId)}
    className={clsx(
      'flex w-full items-center gap-3 rounded-lg p-2 text-left outline-1 -outline-offset-1',
      isActive
        ? 'bg-fg/4 outline-fg/10'
        : 'outline-transparent hover:bg-fg/2 hover:outline-fg/5',
      className,
    )}
  >
    <img
      src={video.thumbnail}
      alt=""
      className="h-11 w-19 shrink-0 rounded object-cover outline-1 -outline-offset-1 outline-black/5 sm:h-9 sm:w-16"
    />
    <div className="min-w-0 flex-1">
      <p
        className={clsx(
          'truncate text-base/5 sm:text-[0.85rem]/4.5',
          isActive ? 'font-medium text-fg' : 'text-muted',
        )}
      >
        {video.title}
      </p>
    </div>
  </button>
)
