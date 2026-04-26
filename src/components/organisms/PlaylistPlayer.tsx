import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { VideoPlayer } from '../atoms/VideoPlayer'

interface YTPlayer {
  getPlaylist(): string[] | null
  destroy(): void
}

interface YTPlayerEvent {
  target: YTPlayer
}

interface YTPlayerCtor {
  new (
    el: HTMLElement,
    opts: {
      width?: number
      height?: number
      playerVars?: Record<string, string | number>
      events?: { onReady?: (e: YTPlayerEvent) => void }
    },
  ): YTPlayer
}

interface YTGlobal {
  Player: YTPlayerCtor
}

interface PlaylistVideo {
  videoId: string
  title: string
  thumbnail: string
}

interface YouTubeWindow {
  YT?: YTGlobal
  onYouTubeIframeAPIReady?: () => void
}

export interface PlaylistPlayerProps {
  playlistUrl: string
  orientation: 'landscape' | 'portrait'
  title: string
}

const extractPlaylistId = (url: string): string | null =>
  url.match(/[?&]list=([\w_-]+)/)?.[1] ?? null

const getVideoUrl = (videoId: string) =>
  `https://www.youtube.com/watch?v=${videoId}`

const getAspectRatio = (orientation: PlaylistPlayerProps['orientation']) =>
  orientation === 'portrait' ? '9 / 16' : '16 / 9'

const getYouTubeWindow = (): YouTubeWindow => globalThis as YouTubeWindow

const createYouTubeAPIScript = (onError: () => void) => {
  const tag = document.createElement('script')
  tag.src = 'https://www.youtube.com/iframe_api'
  tag.onerror = onError
  return tag
}

const loadYouTubeAPI = (): Promise<YTGlobal> =>
  new Promise((resolve, reject) => {
    const win = getYouTubeWindow()

    if (win.YT?.Player) {
      resolve(win.YT)
      return
    }

    const timeout = setTimeout(() => {
      reject(new Error('YouTube IFrame API failed to load within 15 seconds'))
    }, 15_000)

    const prev = win.onYouTubeIframeAPIReady
    win.onYouTubeIframeAPIReady = () => {
      clearTimeout(timeout)
      prev?.()
      if (win.YT?.Player) {
        resolve(win.YT)
      }
    }

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      document.head.appendChild(
        createYouTubeAPIScript(() => {
          clearTimeout(timeout)
          reject(new Error('Failed to load YouTube IFrame API script'))
        }),
      )
    }
  })

const fetchTitle = async (videoId: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`,
    )
    const data = await response.json()

    if (typeof data.title === 'string' && data.title.length > 0) {
      return data.title
    }
  } catch {
    // Fall back to the ID so the playlist remains usable without metadata.
  }

  return videoId
}

const createHiddenPlayerHost = () => {
  const wrapper = document.createElement('div')
  wrapper.style.cssText =
    'position:fixed;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;top:-9999px;left:-9999px'

  const target = document.createElement('div')
  wrapper.appendChild(target)
  document.body.appendChild(wrapper)

  return {
    target,
    cleanup: () => wrapper.remove(),
  }
}

const destroyPlayer = (player: YTPlayer) => {
  try {
    player.destroy()
  } catch {
    // Ignore duplicate cleanup.
  }
}

const waitForPlaylistIds = async (player: YTPlayer): Promise<string[]> => {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const ids = player.getPlaylist() ?? []

    if (ids.length > 0) {
      return ids
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  return []
}

const toPlaylistVideo = async (videoId: string): Promise<PlaylistVideo> => ({
  videoId,
  title: await fetchTitle(videoId),
  thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
})

const fetchPlaylistVideos = (playlistId: string): Promise<PlaylistVideo[]> =>
  new Promise((resolve, reject) => {
    const { target, cleanup } = createHiddenPlayerHost()
    let settled = false

    const finish = (callback: () => void) => {
      if (settled) {
        return
      }

      settled = true
      cleanup()
      callback()
    }

    const start = async () => {
      try {
        const YT = await loadYouTubeAPI()
        const tempPlayer = new YT.Player(target, {
          width: 1,
          height: 1,
          playerVars: { listType: 'playlist', list: playlistId },
          events: {
            onReady: async (event) => {
              const ids = await waitForPlaylistIds(event.target)
              destroyPlayer(event.target)

              const videos = await Promise.all(ids.map(toPlaylistVideo))
              finish(() => resolve(videos))
            },
          },
        })

        setTimeout(() => {
          destroyPlayer(tempPlayer)
          finish(() => resolve([]))
        }, 30_000)
      } catch (error) {
        finish(() => reject(error))
      }
    }

    start()
  })

const usePlaylistVideos = (playlistId: string) =>
  useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: () => fetchPlaylistVideos(playlistId),
    staleTime: 1000 * 60 * 60,
  })

const useDelayedValue = (value: boolean, delayMs: number) => {
  const [delayedValue, setDelayedValue] = useState(false)

  useEffect(() => {
    if (!value) {
      setDelayedValue(false)
      return
    }

    const timeout = window.setTimeout(() => {
      setDelayedValue(true)
    }, delayMs)

    return () => window.clearTimeout(timeout)
  }, [delayMs, value])

  return delayedValue
}

interface PlaylistSidebarProps {
  videos: PlaylistVideo[]
  activeVideoId: string | null
  onSelect: (videoId: string) => void
  isPortrait: boolean
}

const SidebarCompactCards = ({
  videos,
  activeVideoId,
  onSelect,
  isPortrait,
}: PlaylistSidebarProps) => (
  <div
    className={
      isPortrait ? 'relative min-w-0 sm:flex-1' : 'max-h-64 overflow-y-auto'
    }
  >
    <div
      className={isPortrait ? 'sm:absolute sm:inset-0 sm:overflow-y-auto' : ''}
    >
      <div className="space-y-1.5">
        {videos.map((video) => {
          const isActive = video.videoId === activeVideoId

          return (
            <button
              type="button"
              key={video.videoId}
              onClick={() => onSelect(video.videoId)}
              className={[
                'flex w-full items-center gap-3 rounded-lg p-2 text-left outline-1 -outline-offset-1',
                isActive
                  ? 'bg-fg/4 outline-fg/10'
                  : 'outline-transparent hover:bg-fg/2 hover:outline-fg/5',
              ].join(' ')}
            >
              <img
                src={video.thumbnail}
                alt=""
                className="h-11 w-19 shrink-0 rounded object-cover outline-1 -outline-offset-1 outline-black/5 sm:h-9 sm:w-16"
              />
              <div className="min-w-0 flex-1">
                <p
                  className={[
                    'truncate text-base/5 sm:text-[0.85rem]/4.5',
                    isActive ? 'font-medium text-fg' : 'text-muted',
                  ].join(' ')}
                >
                  {video.title}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  </div>
)

const PlaylistLoadingNotice = ({ isPortrait }: { isPortrait: boolean }) => (
  <div className={isPortrait ? 'relative min-w-0 sm:flex-1' : ''}>
    <div
      className={[
        'flex items-center justify-center rounded-lg border border-dashed border-line p-4 text-base text-muted sm:text-sm',
        isPortrait ? 'sm:absolute sm:inset-0' : '',
      ].join(' ')}
    >
      Loading playlist…
    </div>
  </div>
)

const PlaylistPlayerInner = ({
  playlistId,
  playlistUrl,
  aspectRatio,
  orientation,
  title,
}: {
  playlistId: string
  playlistUrl: string
  aspectRatio: string
  orientation: PlaylistPlayerProps['orientation']
  title: string
}) => {
  const { data: videos, isPending } = usePlaylistVideos(playlistId)
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
  const showLoadingNotice = useDelayedValue(isPending && !videos, 400)

  const activeVideoId =
    selectedVideoId &&
    videos?.some((video) => video.videoId === selectedVideoId)
      ? selectedVideoId
      : (videos?.[0]?.videoId ?? null)

  const playerUrl = activeVideoId ? getVideoUrl(activeVideoId) : playlistUrl

  const isPortrait = orientation === 'portrait'

  const sidebarProps: PlaylistSidebarProps = {
    videos: videos ?? [],
    activeVideoId,
    onSelect: setSelectedVideoId,
    isPortrait,
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-bg p-3 shadow-sm outline-1 -outline-offset-1 outline-fg/6 sm:p-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(200_200_200)_20%,rgb(160_160_160)_50%,rgb(200_200_200)_80%,transparent)]" />
      <div
        className={[
          'flex flex-col gap-3',
          isPortrait ? 'sm:flex-row' : '',
        ].join(' ')}
      >
        <section aria-label={title} className="shrink-0">
          <VideoPlayer url={playerUrl} aspectRatio={aspectRatio} />
        </section>

        {videos && videos.length > 1 ? (
          <SidebarCompactCards {...sidebarProps} />
        ) : null}

        {!videos?.length && showLoadingNotice ? (
          <PlaylistLoadingNotice isPortrait={isPortrait} />
        ) : null}
      </div>
    </div>
  )
}

export const PlaylistPlayer = ({
  playlistUrl,
  orientation,
  title,
}: PlaylistPlayerProps) => {
  const [queryClient] = useState(() => new QueryClient())
  const playlistId = extractPlaylistId(playlistUrl)

  if (!playlistId) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PlaylistPlayerInner
        playlistId={playlistId}
        playlistUrl={playlistUrl}
        aspectRatio={getAspectRatio(orientation)}
        orientation={orientation}
        title={title}
      />
    </QueryClientProvider>
  )
}
