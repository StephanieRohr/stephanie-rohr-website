export interface YouTubeVideoItem {
  title: string
  videoUrl: string
  orientation: 'landscape' | 'portrait'
}

export interface YouTubeVideoSection {
  heading: string
  description: string
  credits: string
  videos: YouTubeVideoItem[]
}
