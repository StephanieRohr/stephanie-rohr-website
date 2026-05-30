import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

import { usePlaylistVideos } from '../../hooks/usePlaylistVideos'
import { extractPlaylistId, getVideoUrl } from '../../lib/youtube-api'
import { PlaylistLoadingNotice } from '../atoms/PlaylistLoadingNotice'
import { VideoPlayer } from '../atoms/VideoPlayer'
import { PlaylistSidebar } from '../molecules/PlaylistSidebar'

export interface PlaylistPlayerProps {
  playlistUrl: string
  orientation: 'landscape' | 'portrait'
  title: string
}

const getAspectRatio = (orientation: PlaylistPlayerProps['orientation']) =>
  orientation === 'portrait' ? '9 / 16' : '16 / 9'

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

  const isPortrait = orientation === 'portrait'

  if (isPending && !videos) {
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
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width: '100%', height: 'auto', aspectRatio }}
            >
              <PlaylistLoadingNotice isPortrait={isPortrait} />
            </div>
          </section>

          {/* Reserve the sidebar's footprint so loading the playlist data
              doesn't shift the content below. Matches the loaded layout:
              a 16rem-tall list in landscape, a flexible column in portrait. */}
          <div
            aria-hidden
            className={isPortrait ? 'relative min-w-0 sm:flex-1' : 'h-64'}
          />
        </div>
      </div>
    )
  }

  const activeVideoId =
    selectedVideoId &&
    videos?.some((video) => video.videoId === selectedVideoId)
      ? selectedVideoId
      : (videos?.[0]?.videoId ?? null)

  const playerUrl = activeVideoId ? getVideoUrl(activeVideoId) : playlistUrl

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
          <PlaylistSidebar
            videos={videos}
            activeVideoId={activeVideoId}
            onSelect={setSelectedVideoId}
            isPortrait={isPortrait}
          />
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
