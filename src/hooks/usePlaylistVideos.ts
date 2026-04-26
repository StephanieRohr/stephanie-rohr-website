import { useQuery } from '@tanstack/react-query'

import { fetchPlaylistVideos } from '../lib/youtube-api'

export const usePlaylistVideos = (playlistId: string) =>
  useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: ({ signal }) => fetchPlaylistVideos(playlistId, signal),
    retry: 3,
  })
