import ReactPlayer from 'react-player'

interface VideoPlayerProps {
  url: string
  aspectRatio?: string
  boxShadow?: string
}

export const VideoPlayer = ({
  url,
  aspectRatio = '16 / 9',
  boxShadow,
}: VideoPlayerProps) => (
  <ReactPlayer
    src={url}
    controls
    style={{
      borderRadius: '8px',
      overflow: 'hidden',
      width: '100%',
      height: 'auto',
      aspectRatio,
      ...(boxShadow && { boxShadow }),
    }}
  />
)
