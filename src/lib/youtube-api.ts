import type {
  PlaylistVideo,
  YouTubeWindow,
  YTGlobal,
  YTPlayer,
} from '../types/playlist.types'

export const extractPlaylistId = (url: string): string | null =>
  url.match(/[?&]list=([\w_-]+)/)?.[1] ?? null

export const getVideoUrl = (videoId: string) =>
  `https://www.youtube.com/watch?v=${videoId}`

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
  } catch (error) {
    console.warn(`Failed to fetch title for video ${videoId}:`, error)
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
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const ids = player.getPlaylist() ?? []

    if (ids.length > 0) {
      return ids
    }

    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  return []
}

const toPlaylistVideo = async (videoId: string): Promise<PlaylistVideo> => ({
  videoId,
  title: await fetchTitle(videoId),
  thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
})

export const fetchPlaylistVideos = (
  playlistId: string,
  signal?: AbortSignal,
): Promise<PlaylistVideo[]> =>
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

    // Clean up if React Query cancels the query (unmount, invalidation, etc.)
    signal?.addEventListener('abort', () => {
      finish(() => reject(signal.reason))
    })

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

              if (ids.length === 0) {
                finish(() =>
                  reject(
                    new Error(`Playlist ${playlistId} returned no video IDs`),
                  ),
                )
                return
              }

              const videos = await Promise.all(ids.map(toPlaylistVideo))
              finish(() => resolve(videos))
            },
          },
        })

        setTimeout(() => {
          destroyPlayer(tempPlayer)
          finish(() =>
            reject(
              new Error(`Playlist ${playlistId} timed out after 30 seconds`),
            ),
          )
        }, 30_000)
      } catch (error) {
        finish(() => reject(error))
      }
    }

    start()
  })
