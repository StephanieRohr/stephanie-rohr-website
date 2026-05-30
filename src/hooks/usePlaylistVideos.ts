import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { fetchPlaylistVideos, fetchTitle } from '../lib/youtube-api'
import type { PlaylistVideo } from '../types/playlist.types'

export const usePlaylistVideos = (playlistId: string) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: ({ signal }) => fetchPlaylistVideos(playlistId, signal),
    retry: 3,
  })

  useEffect(() => {
    const videos = query.data
    if (!videos) return

    const untitled = videos.filter((v) => v.title === null)
    if (untitled.length === 0) return

    let cancelled = false

    const resolve = async () => {
      for (const video of untitled) {
        if (cancelled) return
        const title = await fetchTitle(video.videoId)
        if (cancelled) return

        queryClient.setQueryData<PlaylistVideo[]>(
          ['playlist', playlistId],
          (prev) =>
            prev?.map((v) =>
              v.videoId === video.videoId ? { ...v, title } : v,
            ),
        )
      }
    }

    resolve()
    return () => {
      cancelled = true
    }
  }, [query.data, playlistId, queryClient])

  return query
}
