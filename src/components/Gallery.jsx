import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../lib/i18n'
import { config } from '../config'
import { galleryAlbums } from '../lib/assets'
import { useReveal } from '../hooks/useReveal'
import { usePressHold } from '../hooks/usePressHold'
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
      <div className="overflow-hidden py-4" ref={emblaRef}>
        <div className="-ml-2 flex md:-ml-4">
          {/* Giờ chỉ còn ảnh đứng nên mọi thẻ cùng một khổ. Vẫn để chiều cao
              cố định và chiều rộng tự do: nếu sau này thêm ảnh ngang thì nó
              vẫn hiện đủ khung chứ không bị cắt. */}
          {photos.map((photo, i) => (
            <PhotoCard
              key={photo.src}
              photo={photo}
              eager={i < 3}
              onOpen={() => onSelect(i)}
            />
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

/**
 * Một tấm ảnh trong album. Chạm để xem lớn, giữ để nhấc ảnh lên xem kỹ.
 */
function PhotoCard({ photo, eager, onOpen }) {
  const { t } = useLanguage()
  const { held, handlers, consumeHold } = usePressHold()

  return (
    /* Rộng theo cột chứ không theo nội dung: 1 ảnh trên điện thoại, 2 trên máy
       tính bảng, đúng 3 trên máy tính - không còn tấm thứ tư ló ra một nửa. */
    <div className="min-w-0 shrink-0 grow-0 basis-full pl-2 sm:basis-1/2 md:pl-4 lg:basis-1/3">
      <button
        {...handlers}
        onClick={() => {
          // vừa giữ xong thì thôi, không mở ảnh lớn
          if (!consumeHold()) onOpen()
        }}
        aria-label={t('gallery.viewLarger')}
        className={`photo-card group block w-full cursor-pointer select-none ${held ? 'is-held' : ''}`}
      >
        {/* Khung tỉ lệ 2:3 khớp đúng tỉ lệ ảnh gốc, nên object-cover không cắt
            mất phần nào.

            Bo góc đặt ở CẢ khung ngoài lẫn thẻ ảnh: khung ngoài cắt nội dung,
            thẻ ảnh tự bo. Thừa một chút nhưng an toàn - có trình duyệt bỏ qua
            vùng cắt bo góc khi lớp bên trong được ghép ảnh riêng, khi đó thẻ
            ảnh vẫn tròn góc nhờ bo góc của chính nó. */}
        <span className="relative block aspect-2/3 w-full overflow-hidden rounded-[14px] ring-1 ring-black/[0.06] ring-inset md:rounded-[18px]">
          <img
            src={photo.src}
            alt={photo.alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full rounded-[14px] object-cover md:rounded-[18px]"
          />
          {/* Lớp phủ khi rê chuột. KHÔNG dùng mix-blend-mode ở đây: nó đẩy
              phần tử lên một tầng ghép ảnh riêng, và khi đó trình duyệt bỏ
              qua vùng cắt bo góc của thẻ cha - góc ảnh sẽ vuông trở lại. */}
          <span className="absolute inset-0 bg-foreground/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </span>
      </button>
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
