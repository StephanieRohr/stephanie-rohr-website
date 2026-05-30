import clsx from 'clsx'

interface PlaylistLoadingNoticeProps {
  isPortrait: boolean
  className?: string
}

export const PlaylistLoadingNotice = ({
  isPortrait,
  className,
}: PlaylistLoadingNoticeProps) => (
  <div className={clsx(isPortrait && 'relative min-w-0 sm:flex-1', className)}>
    <div
      className={clsx(
        'flex items-center justify-center rounded-lg border border-dashed border-line p-4 text-base text-muted sm:text-sm',
        isPortrait && 'sm:absolute sm:inset-0',
      )}
    >
      Loading playlist...
    </div>
  </div>
)
