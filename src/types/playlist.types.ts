export interface PlaylistVideo {
  videoId: string
  title: string
  thumbnail: string
}

export interface YTPlayer {
  getPlaylist(): string[] | null
  destroy(): void
}

export interface YTPlayerEvent {
  target: YTPlayer
}

export interface YTPlayerCtor {
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

export interface YTGlobal {
  Player: YTPlayerCtor
}

export interface YouTubeWindow {
  YT?: YTGlobal
  onYouTubeIframeAPIReady?: () => void
}
