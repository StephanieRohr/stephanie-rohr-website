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
  // The aspect-ratio lives on a plain <div> wrapper (not on react-player's
  // <iframe>): a replaced element computes `aspect-ratio` + `height: auto`
  // differently, which made the loaded player a different height than the
  // loading placeholder and caused layout shift. The iframe just fills the box.
  <div
    style={{
      width: '100%',
      aspectRatio,
      borderRadius: '8px',
      overflow: 'hidden',
      ...(boxShadow && { boxShadow }),
    }}
  >
    <ReactPlayer
      src={url}
      controls
      style={{ display: 'block', width: '100%', height: '100%', border: 0 }}
    />
  </div>
)
