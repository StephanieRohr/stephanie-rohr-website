import ReactPlayer from 'react-player'
import type { VideoItem, YouTubeVideoItem } from '../../types/video.types'

type VideoPlayerProps =
  | {
      type: 'wix'
      video: VideoItem
      autoplay?: boolean
      loop?: boolean
      muted?: boolean
    }
  | {
      type: 'youtube'
      video: YouTubeVideoItem
    }
  | {
      type: 'youtube-hero'
      url: string
      boxShadow?: string
    }

const wixVideoUrl = (
  videoId: string,
  quality: '480p' | '720p' | '1080p' = '720p',
) => `https://video.wixstatic.com/video/${videoId}/${quality}/mp4/file.mp4`

const getPlayerConfig = (props: VideoPlayerProps) => {
  switch (props.type) {
    case 'wix':
      return {
        videoUrl: wixVideoUrl(props.video.videoId, '720p'),
        aspectRatio:
          props.video.orientation === 'portrait' ? '9 / 16' : '16 / 9',
        autoplay: props.autoplay ?? true,
        loop: props.loop ?? true,
        muted: props.muted ?? true,
        boxShadow: undefined,
      }
    case 'youtube':
      return {
        videoUrl: props.video.videoUrl,
        aspectRatio:
          props.video.orientation === 'portrait' ? '9 / 16' : '16 / 9',
        autoplay: false,
        loop: false,
        muted: false,
        boxShadow: undefined,
      }
    case 'youtube-hero':
      return {
        videoUrl: props.url,
        aspectRatio: '16 / 9',
        autoplay: false,
        loop: false,
        muted: false,
        boxShadow: props.boxShadow,
      }
    default:
      throw new Error('Unsupported video type')
  }
}

export default function VideoPlayer(props: VideoPlayerProps) {
  const config = getPlayerConfig(props)

  return (
    <ReactPlayer
      src={config.videoUrl}
      controls
      playing={config.autoplay}
      playsInline={props.type === 'wix'}
      loop={config.loop}
      muted={config.muted}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        width: '100%',
        height: 'auto',
        aspectRatio: config.aspectRatio,
        ...(config.boxShadow && { boxShadow: config.boxShadow }),
      }}
    />
  )
}
