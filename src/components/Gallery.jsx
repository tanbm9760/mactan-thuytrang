import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useLanguage } from '../lib/i18n'
import { config } from '../config'
import { galleryAlbums } from '../lib/assets'
import { useReveal } from '../hooks/useReveal'
import { usePressHold } from '../hooks/usePressHold'
import Lightbox from './Lightbox'
import SectionMark from './SectionMark'

/**
 * Album ảnh, trình bày như một cuốn lookbook chứ không như một component
 * carousel.
 *
 * Ba thay đổi làm nên khác biệt đó:
 *  - Ảnh KHÔNG còn cùng một khổ. Cứ ba tấm lại có một tấm to hơn hẳn, nên
 *    dải ảnh có nhịp lớn-nhỏ thay vì đều tăm tắp.
 *  - Mép dưới các tấm ảnh thẳng hàng, mép trên so le - đó là thứ khiến một
 *    dải ảnh trông như được bày ra trên bàn chứ không như một hàng thẻ.
 *  - Dải ảnh chạy tràn ra khỏi hai mép màn hình, và điều khiển là một dòng
 *    chữ số nhỏ ở góc chứ không phải hai nút tròn nổi trên ảnh.
 */
export default function Gallery() {
  const { t } = useLanguage()
  const headRef = useReveal()
  const [lightbox, setLightbox] = useState({ photos: [], index: null })

  if (galleryAlbums.every((album) => album.photos.length === 0)) {
    return null
  }

  return (
    <section id="gallery" className="sec overflow-hidden bg-sand">
      <div ref={headRef} className="reveal gutter">
        <div className="mx-auto max-w-4xl text-center">
          <SectionMark numeral="IV" align="center" />
          <h2 className="t-head mt-9 text-[clamp(2rem,6vw,3.5rem)] text-foreground">
            {t('gallery.title')}
          </h2>
          <p className="t-quote mt-4 text-[clamp(1.05rem,2.6vw,1.35rem)] text-primary">
            {t('gallery.subtitle')}
          </p>
        </div>
      </div>

      {galleryAlbums.map((album, albumIndex) => (
        <div key={album.key} className={albumIndex === 0 ? 'mt-16 md:mt-24' : 'mt-20 md:mt-28'}>
          {/* Hai bộ ảnh ngăn nhau bằng một nét kẻ mảnh chứ không bằng tiêu đề:
              đặt tên cho từng bộ ("trong studio", "ngoại cảnh") nghe như chú
              thích kỹ thuật. Tên vẫn nằm trong aria-label cho trình đọc màn
              hình, chỉ là không hiện ra. */}
          {albumIndex > 0 && <AlbumDivider />}
          <Filmstrip
            photos={album.photos}
            label={albumLabel(album.key)}
            onSelect={(index) => setLightbox({ photos: album.photos, index })}
          />
        </div>
      ))}

      <Lightbox
        photos={lightbox.photos}
        index={lightbox.index}
        onClose={() => setLightbox((s) => ({ ...s, index: null }))}
        onChange={(index) => setLightbox((s) => ({ ...s, index }))}
      />
    </section>
  )
}

/** Dấu ngăn giữa hai bộ ảnh: một nét kẻ tóc với hạt kim cương nhỏ ở giữa. */
function AlbumDivider() {
  return (
    <div aria-hidden className="mb-20 flex items-center justify-center gap-5 md:mb-28">
      <span className="h-px w-16 bg-border md:w-28" />
      <span className="h-1 w-1 rotate-45 bg-gold" />
      <span className="h-px w-16 bg-border md:w-28" />
    </div>
  )
}

/** Nhãn album chỉ dùng cho aria-label, không hiển thị. */
function albumLabel(albumKey) {
  const album = config.albums?.[albumKey]
  return album?.vi ?? albumKey
}

/* Nhịp lớn-nhỏ của dải ảnh. Cứ tấm thứ 3 lại là một tấm lớn. Tất cả ảnh gốc
   đều là 2:3, nên chỉ đổi CHIỀU RỘNG - không cắt lại khung hình, không ai bị
   cắt mất đầu hay mất chân. */
const WIDE = 'basis-[74%] sm:basis-[46%] lg:basis-[30%]'
const NARROW = 'basis-[56%] sm:basis-[34%] lg:basis-[22%]'

function Filmstrip({ photos, label, onSelect }) {
  const { t } = useLanguage()
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: photos.length > 3 }, [
    Autoplay({ delay: 5200, stopOnInteraction: true, stopOnMouseEnter: true }),
  ])
  const [state, setState] = useState({ index: 0, canPrev: false, canNext: false })

  const onUpdate = useCallback((api) => {
    setState({
      index: api.selectedScrollSnap(),
      canPrev: api.canScrollPrev(),
      canNext: api.canScrollNext(),
    })
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
    <div role="group" aria-label={label}>
      {/* Dải ảnh chạy sát hai mép màn hình. Cả trang còn lại đều thụt vào
          trong lề, nên đúng một chỗ tràn viền là đủ để phần album bật hẳn ra.
          (Không đặt padding cho dải: embla canh mép trái tấm ảnh vào mép trái
          khung nhìn, nên padding sẽ bị nuốt mất ngay ở tấm thứ hai.) */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex items-end gap-3 md:gap-5">
          {photos.map((photo, i) => (
            <Plate
              key={photo.src}
              photo={photo}
              width={i % 3 === 0 ? WIDE : NARROW}
              eager={i < 3}
              onOpen={() => onSelect(i)}
            />
          ))}
        </div>
      </div>

      {/* Điều khiển: một dòng chữ số nhỏ, đặt trong lề chứ không nổi trên ảnh */}
      <div className="mt-7 flex items-center gap-6 gutter md:mt-9">
        <p className="font-serif text-[0.9rem] font-light text-muted-foreground tabular-nums">
          {String(state.index + 1).padStart(2, '0')}
          <span className="mx-1.5 text-border">/</span>
          {String(photos.length).padStart(2, '0')}
        </p>
        <span aria-hidden className="h-px flex-1 bg-border" />
        <div className="flex items-center gap-5">
          <StripButton
            label={t('gallery.prev')}
            glyph="←"
            disabled={!state.canPrev}
            onClick={() => emblaApi?.scrollPrev()}
          />
          <StripButton
            label={t('gallery.next')}
            glyph="→"
            disabled={!state.canNext}
            onClick={() => emblaApi?.scrollNext()}
          />
        </div>
      </div>
    </div>
  )
}

function StripButton({ label, glyph, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 cursor-pointer items-center justify-center text-lg text-muted-foreground transition-colors duration-500 hover:text-foreground disabled:cursor-default disabled:opacity-25"
    >
      <span aria-hidden>{glyph}</span>
    </button>
  )
}

/** Một tấm ảnh trong album. Chạm để xem lớn, giữ để nhấc ảnh lên xem kỹ. */
function Plate({ photo, width, eager, onOpen }) {
  const { t } = useLanguage()
  const { held, handlers, consumeHold } = usePressHold()

  return (
    <div className={`min-w-0 shrink-0 grow-0 ${width}`}>
      <button
        {...handlers}
        onClick={() => {
          // vừa giữ xong thì thôi, không mở ảnh lớn
          if (!consumeHold()) onOpen()
        }}
        aria-label={t('gallery.viewLarger')}
        className={`photo-card block w-full cursor-pointer select-none ${held ? 'is-held' : ''}`}
      >
        {/* Khung 2:3 khớp đúng tỉ lệ ảnh gốc nên object-cover không cắt mất
            phần nào. Góc vuông: bo góc là ngôn ngữ của thẻ giao diện, còn
            đây là một tấm ảnh in. */}
        <span className="relative block aspect-2/3 w-full overflow-hidden bg-muted">
          <img
            src={photo.src}
            alt={photo.alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </span>
      </button>
    </div>
  )
}
