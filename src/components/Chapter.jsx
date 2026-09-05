import { useReveal } from '../hooks/useReveal'
import { useParallax } from '../hooks/useParallax'
import { SplitWords } from './Reveal'

/**
 * Một chương của câu chuyện. Cấu trúc lặp lại y hệt nhau ở cả ba chương, nên
 * người đọc nhận ra nhịp và biết mình đang đi đâu:
 *
 *   ảnh tràn viền (có số chương + tên chương)  →  đoạn văn  →  chùm ba ảnh
 *
 * `flip` đảo bên đặt đoạn văn giữa các chương để trang không bị một bên nặng.
 */
export default function Chapter({ numeral, title, text, lead, photos = [], flip = false }) {
  const { wrapRef, imgRef } = useParallax(10)
  const numeralRef = useReveal({ threshold: 0.4 })
  const textRef = useReveal({ threshold: 0.25 })

  return (
    <section className="relative">
      {/* ── Ảnh mở chương, tràn viền, trôi chậm hơn trang ─────────────────── */}
      {lead && (
        <div
          ref={wrapRef}
          className="relative h-[52svh] max-h-[760px] min-h-[300px] w-full overflow-hidden md:h-[72svh] md:min-h-[420px]"
        >
          <img
            ref={imgRef}
            src={lead}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            /* cao hơn khung 24% để khi trôi ±10% vẫn không hở mép */
            className="parallax-img absolute inset-x-0 top-[-12%] h-[124%] w-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/10"
          />

          <div className="absolute inset-x-0 bottom-0 px-6 pb-10 md:px-14 md:pb-14">
            <div className="mx-auto max-w-5xl">
              <p ref={numeralRef} className="reveal flex items-center gap-4">
                <span aria-hidden className="h-px w-10 bg-white/50" />
                <span className="font-serif text-base tracking-[0.12em] text-white/80">
                  {numeral}
                </span>
              </p>
              <SplitWords
                as="h2"
                text={title}
                start={180}
                step={70}
                className="mt-3 block max-w-2xl font-serif text-3xl leading-tight text-white drop-shadow-md sm:text-4xl md:text-6xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Đoạn văn ──────────────────────────────────────────────────────── */}
      <div className="bg-background px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2 md:gap-16">
          {/* Số chương cỡ lớn, rất mờ — lấp nửa trang đối diện đoạn văn để
              khoảng trống trở thành có chủ ý thay vì trông như thiếu nội dung */}
          <p
            aria-hidden
            className={`chapter-numeral hidden text-[9rem] md:block ${
              flip ? 'order-2 text-left' : 'order-2 text-right'
            }`}
          >
            {numeral}
          </p>

          <div
            ref={textRef}
            className={`reveal text-[1.0625rem] leading-[1.85] text-muted-foreground md:text-lg ${
              flip ? 'md:order-3' : 'md:order-1'
            }`}
          >
            {text.split('\n\n').map((paragraph, i) => (
              <p key={i} className={i > 0 ? 'mt-5' : ''}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* ── Chùm ảnh ──────────────────────────────────────────────────────── */}
      {photos.length > 0 && <ChapterPhotos photos={photos} flip={flip} />}
    </section>
  )
}

/**
 * Ba ảnh xếp lệch tầng. Trên máy tính là ba cột với cột giữa tụt xuống; trên
 * điện thoại là một cột nhưng ảnh thụt vào so le trái–phải, nên vẫn có nhịp
 * chứ không thành một chồng ảnh đều tăm tắp.
 */
function ChapterPhotos({ photos, flip }) {
  return (
    <div className="bg-background px-6 pb-20 md:pb-28">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3 md:items-start md:gap-8">
        {photos.slice(0, 3).map((photo, i) => (
          <ChapterPhoto key={photo.src} photo={photo} index={i} flip={flip} />
        ))}
      </div>
    </div>
  )
}

function ChapterPhoto({ photo, index, flip }) {
  const ref = useReveal({ threshold: 0.12, delay: index * 150 })

  // so le trên điện thoại: ảnh giữa thụt về một bên
  const mobileInset =
    index === 1 ? (flip ? 'w-[86%]' : 'w-[86%] ml-auto') : index === 2 ? 'w-[94%] mx-auto' : ''

  return (
    <div
      ref={ref}
      className={`reveal-mask overflow-hidden ${mobileInset} md:w-full ${
        index === 1 ? 'md:mt-16' : ''
      }`}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        className="aspect-4/5 w-full object-cover"
      />
    </div>
  )
}
