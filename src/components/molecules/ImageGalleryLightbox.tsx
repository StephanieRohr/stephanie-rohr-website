import { useState } from 'react'

import { MasonryPhotoAlbum } from 'react-photo-album'
import SSR from 'react-photo-album/ssr'
import 'react-photo-album/masonry.css'

import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

interface GalleryImage {
  src: string
  width: number
  height: number
  alt: string
}

interface Props {
  images: GalleryImage[]
}

export const ImageGalleryLightbox = ({ images }: Props) => {
  const [index, setIndex] = useState(-1)

  return (
    <>
      <SSR breakpoints={[300, 600, 900, 1200]}>
        <MasonryPhotoAlbum
          photos={images}
          columns={3}
          onClick={({ index }) => setIndex(index)}
        />
      </SSR>

      <Lightbox
        slides={images}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
    </>
  )
}
