import { useState } from 'react'

import { MasonryPhotoAlbum } from 'react-photo-album'
import 'react-photo-album/rows.css'

import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

// import optional lightbox plugins
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

interface GalleryImage {
  src: string
  width: number
  height: number
}

interface Props {
  images: GalleryImage[]
}

export default function ImageGalleryLightbox({ images }: Props) {
  const [index, setIndex] = useState(-1)

  return (
    <>
      <MasonryPhotoAlbum
        photos={images}
        columns={3}
        onClick={({ index }) => setIndex(index)}
      />

      <Lightbox
        slides={images}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        // enable optional lightbox plugins
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
    </>
  )
}
