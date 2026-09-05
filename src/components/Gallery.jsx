import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../lib/i18n'
import { config } from '../config'
import { galleryAlbums } from '../lib/assets'
import { useReveal } from '../hooks/useReveal'
import Lightbox from './Lightbox'

export default function Gallery() {
  const { t } = useLanguage()
  const ref = useReveal()
  const [lightbox, setLightbox] = useState({ photos: [], index: null })

  if (galleryAlbums.every((album) => album.photos.length === 0)) {
    return null
  }

  return (
    <section id="gallery" className="overflow-hidden bg-background px-6 py-24 md:py-32">
      <div ref={ref} className="reveal mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <h2 className="mb-3 font-serif text-4xl text-primary md:text-5xl">{t('gallery.title')}</h2>
          <p className="font-serif text-lg italic text-muted-foreground">{t('gallery.subtitle')}</p>
        </div>

        {galleryAlbums.map((album, albumIndex) => (
          <div key={album.key}>
            {/* Hai bộ ảnh ngăn nhau bằng một dấu mảnh chứ không bằng tiêu đề:
                đặt tên cho từng bộ ("trong studio", "ngoại cảnh") nghe như chú
                thích kỹ thuật. Tên vẫn được giữ trong aria-label cho trình đọc
                màn hình, chỉ là không hiện ra. */}
            {albumIndex > 0 && <AlbumDivider />}
            <Carousel
              photos={album.photos}
              label={albumLabel(album.key)}
              onSelect={(index) => setLightbox({ photos: album.photos, index })}
            />
          </div>
        ))}
      </div>

      <Lightbox
        photos={lightbox.photos}
        index={lightbox.index}
        onClose={() => setLightbox((s) => ({ ...s, index: null }))}
        onChange={(index) => setLightbox((s) => ({ ...s, index }))}
      />
    </section>
  )
}

/** Dấu ngăn giữa hai bộ ảnh: một đường kẻ tóc với hạt kim cương nhỏ ở giữa. */
function AlbumDivider() {
  return (
    <div aria-hidden className="flex items-center justify-center gap-4 py-16 md:py-20">
      <span className="h-px w-12 bg-border md:w-20" />
      <span className="h-1.5 w-1.5 rotate-45 bg-gold/70" />
      <span className="h-px w-12 bg-border md:w-20" />
    </div>
  )
}

/** Nhãn album chỉ dùng cho aria-label, không hiển thị. */
function albumLabel(albumKey) {
  const album = config.albums?.[albumKey]
  return album?.vi ?? albumKey
}

function Carousel({ photos, label, onSelect }) {
  const { t } = useLanguage()
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: photos.length > 3 }, [
    Autoplay({ delay: 4500, stopOnInteraction: true, stopOnMouseEnter: true }),
  ])
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const onUpdate = useCallback((api) => {
    setCanPrev(api.canScrollPrev())
    setCanNext(api.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onUpdate(emblaApi)
    emblaApi.on('select', onUpdate).on('reInit', onUpdate)
    return () => {
      emblaApi.off('select', onUpdate).off('reInit', onUpdate)
    }
  }, [emblaApi, onUpdate])

  return (
    <div className="relative md:px-12" role="group" aria-label={label}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-2 flex md:-ml-4">
          {/* Thẻ ảnh cao cố định, rộng tự do: ảnh ngang thành thẻ rộng, ảnh dọc
              thành thẻ hẹp. Không tấm nào bị cắt, và mép trên mép dưới vẫn
              thẳng hàng nên dải ảnh đọc như một cuộn phim. */}
          {photos.map((photo, i) => (
            <div key={photo.src} className="flex-none pl-2 md:pl-4">
              <button
                onClick={() => onSelect(i)}
                aria-label={t('gallery.viewLarger')}
                className="group relative block h-[86vw] max-h-[430px] cursor-pointer overflow-hidden sm:h-[52vw] lg:h-[430px]"
              >
                <div className="absolute inset-0 z-10 bg-primary/15 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100" />
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading={i < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-full w-auto max-w-none object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <CarouselButton
        side="left"
        disabled={!canPrev}
        label={t('gallery.prev')}
        onClick={() => emblaApi?.scrollPrev()}
      />
      <CarouselButton
        side="right"
        disabled={!canNext}
        label={t('gallery.next')}
        onClick={() => emblaApi?.scrollNext()}
      />
    </div>
  )
}

function CarouselButton({ side, disabled, label, onClick }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`absolute top-1/2 hidden -translate-y-1/2 cursor-pointer rounded-full border border-border bg-background p-2 text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-default disabled:opacity-30 md:block ${
        side === 'left' ? 'left-0' : 'right-0'
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  )
}
