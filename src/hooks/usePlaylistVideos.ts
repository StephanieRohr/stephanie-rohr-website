import { useQuery } from '@tanstack/react-query'

import { fetchPlaylistVideos } from '../lib/youtube-api'

export const usePlaylistVideos = (playlistId: string) =>
  useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: ({ signal }) => fetchPlaylistVideos(playlistId, signal),
    staleTime: 1000 * 60 * 60,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
  })
