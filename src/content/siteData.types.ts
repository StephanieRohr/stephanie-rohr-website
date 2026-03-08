export interface VideoItem {
  title: string
  videoId: string
  orientation: 'landscape' | 'portrait'
}

export interface Section {
  heading: string
  subheading?: string
  description: string
  credits: string
}

export interface VideoSection extends Section {
  videos: VideoItem[]
}

export interface YouTubeVideoItem {
  title: string
  videoUrl: string
  orientation: 'landscape' | 'portrait'
}

export interface YouTubeVideoSection extends Section {
  videos: YouTubeVideoItem[]
}
