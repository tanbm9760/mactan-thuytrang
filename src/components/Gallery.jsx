import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
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
 *  - Một khung cố định: đúng một tấm trên điện thoại, đúng ba tấm trên máy
 *    tính. Mỗi cú vuốt là một trang, dừng đúng chỗ.
 *  - Mọi tấm cùng một khổ, bo góc mềm, viền chỉ là một vòng sáng cực mảnh -
 *    ảnh nào cũng được đối xử như nhau, không tấm nào to hơn tấm nào.
 *  - Không tự động chạy.
 *  - Điều khiển là một dòng chữ số nhỏ nằm trong lề, không phải hai nút tròn
 *    nổi đè lên ảnh.
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

/* Khung ảnh: đúng MỘT tấm trên điện thoại, đúng BA tấm trên máy tính.
   Ảnh gốc đều là 2:3 nên khung 2:3 không cắt mất phần nào của ai.

   Trước đây mỗi tấm rộng 72%/42%/28% nên luôn có một tấm ló ra dở dang ở mép
   phải. Nhìn thì có nhịp, nhưng lướt bằng ngón tay lại khó chịu: vuốt một cái
   không biết nó sẽ dừng ở đâu, và tấm đang xem chẳng bao giờ nằm trọn trong
   khung. Chia chẵn thì mỗi cú vuốt là một trang, dừng đúng chỗ. */
const PLATE_WIDTH = 'basis-full pl-3 md:basis-1/3 md:pl-4'

function Filmstrip({ photos, label, onSelect }) {
  const { t } = useLanguage()
  /* Không còn tự động chạy. Ảnh tự trôi trong lúc khách đang ngắm là thứ gây
     khó chịu nhất ở đây - đang nhìn một tấm thì nó đổi mất. Giờ ảnh chỉ đổi
     khi khách vuốt hoặc bấm.

     `containScroll: 'trimSnaps'` bỏ các điểm dừng thừa ở hai đầu, nhờ vậy tấm
     đầu và tấm cuối luôn nằm sát mép khung chứ không dừng lệch nửa vời. */
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: photos.length > 3,
    containScroll: 'trimSnaps',
  })
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
      {/* Khung ảnh nằm gọn trong lề như phần còn lại của trang. Ảnh không
          tràn ra mép nữa: tràn viền thì đẹp lúc đứng yên, nhưng lúc vuốt lại
          làm mất cảm giác "một khung, một tấm".

          ⚠️ Lề phải nằm ở thẻ NGOÀI thẻ overflow-hidden. `overflow: hidden`
          cắt ở mép ngoài của phần đệm chứ không phải mép trong, nên nếu đặt
          lề ngay trên thẻ này thì tấm kế tiếp vẫn ló ra trong vùng đệm - hỏng
          đúng cái cảm giác "một khung, một tấm" vừa dựng.

          Khoảng cách giữa các tấm cũng không dùng `gap`: ba tấm rộng 1/3 cộng
          thêm hai khoảng hở thì thành hơn 100%, tấm thứ ba bị cắt. Cách đúng
          là mỗi tấm tự mang phần đệm trái của nó rồi kéo cả dải lệch sang trái
          đúng bằng ngần ấy - lúc đó 1/3 vẫn là 1/3. */}
      <div className="gutter">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="-ml-3 flex items-stretch md:-ml-4">
            {photos.map((photo, i) => (
              <Plate key={photo.src} photo={photo} eager={i < 3} onOpen={() => onSelect(i)} />
            ))}
          </div>
        </div>
      </div>

      {/* Điều khiển: một dòng chữ số nhỏ, đặt trong lề chứ không nổi trên ảnh */}
      <div className="mt-6 flex items-center gap-6 gutter md:mt-7">
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
function Plate({ photo, eager, onOpen }) {
  const { t } = useLanguage()
  const { held, handlers, consumeHold } = usePressHold()

  return (
    <div className={`min-w-0 shrink-0 grow-0 ${PLATE_WIDTH}`}>
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
            phần nào.

            Bo góc đặt ở CẢ khung ngoài lẫn thẻ ảnh. Thừa một chút nhưng an
            toàn: có trình duyệt bỏ qua vùng cắt bo góc của thẻ cha khi lớp
            bên trong được ghép ảnh riêng, khi đó thẻ ảnh vẫn tròn góc nhờ bo
            góc của chính nó. */}
        <span className="relative block aspect-2/3 w-full overflow-hidden rounded-[18px] bg-muted ring-1 ring-foreground/[0.06] ring-inset md:rounded-[22px]">
          <img
            src={photo.src}
            alt={photo.alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full rounded-[18px] object-cover md:rounded-[22px]"
          />
        </span>
      </button>
    </div>
  )
}
