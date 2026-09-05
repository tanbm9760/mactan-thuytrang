import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../lib/i18n'
import { galleryAlbums } from '../lib/assets'
import { useReveal } from '../hooks/useReveal'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { SplitWords } from './Reveal'
import Lightbox from './Lightbox'

const TURN_MS = 900

/**
 * Album ảnh cưới, lật từng trang như một cuốn sách thật.
 *
 * Máy tính mở hai trang có gáy ở giữa, điện thoại một trang. Khi lật, một tờ
 * giấy xoay 180° quanh gáy: mặt trước là trang đang xem, mặt sau là trang sắp
 * tới. Bên dưới tờ giấy đã sẵn nội dung mới, nên lúc tờ giấy đáp xuống là mọi
 * thứ khớp liền, không chớp.
 *
 * Ảnh đặt lọt trong khung giấy chứ không cắt đầy trang - vừa giống ảnh dán
 * trong album, vừa không cắt mất ảnh ngang như khi ép mọi tấm vào một tỉ lệ.
 */
export default function Gallery() {
  const { t } = useLanguage()
  const ref = useReveal({ threshold: 0.08 })
  const isSpread = useMediaQuery('(min-width: 768px)')
  const perPage = isSpread ? 2 : 1

  const photos = useMemo(() => galleryAlbums.flatMap((a) => a.photos), [])
  /* Trang giấy chỉ cầm object ảnh, còn lightbox cần chỉ số trong mảng phẳng */
  const indexOfPhoto = useMemo(() => new Map(photos.map((ph, i) => [ph.src, i])), [photos])

  const spreads = useMemo(() => {
    const out = []
    for (let i = 0; i < photos.length; i += perPage) out.push(photos.slice(i, i + perPage))
    return out
  }, [photos, perPage])

  const [index, setIndex] = useState(0)
  const [turning, setTurning] = useState(null) // null | 'next' | 'prev'
  const [lightbox, setLightbox] = useState(null)
  const timer = useRef(0)
  const leafRef = useRef(null)

  // Đổi khổ màn hình giữa chừng thì số trang đổi theo, phải kéo chỉ số về trong khoảng
  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, spreads.length - 1)))
  }, [spreads.length])

  useEffect(() => () => clearTimeout(timer.current), [])

  /* Đặt tờ giấy ở góc xuất phát, ép trình duyệt ghi nhận, rồi mới đổi sang góc
     đích. Không ép thì cả hai trạng thái rơi vào cùng một khung hình và tờ
     giấy nhảy thẳng tới đích, không thấy chuyển động nào. */
  useEffect(() => {
    const el = leafRef.current
    if (!el || !turning) return
    const from = turning === 'next' ? 0 : -180
    const to = turning === 'next' ? -180 : 0
    el.style.transition = 'none'
    el.style.transform = `rotateY(${from}deg)`
    void el.offsetWidth
    el.style.transition = `transform ${TURN_MS}ms cubic-bezier(0.5, 0, 0.2, 1)`
    el.style.transform = `rotateY(${to}deg)`
  }, [turning])

  const go = useCallback(
    (dir) => {
      if (turning) return
      const next = index + (dir === 'next' ? 1 : -1)
      if (next < 0 || next >= spreads.length) return

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        setIndex(next)
        return
      }

      setTurning(dir)
      timer.current = setTimeout(() => {
        setIndex(next)
        setTurning(null)
      }, TURN_MS)
    },
    [index, spreads.length, turning],
  )

  // vuốt ngang trên điện thoại
  const touchX = useRef(null)
  const onTouchStart = (e) => (touchX.current = e.changedTouches[0].clientX)
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) > 45) go(dx < 0 ? 'next' : 'prev')
  }

  if (spreads.length === 0) return null

  const current = spreads[index] ?? []
  const target = spreads[index + (turning === 'next' ? 1 : -1)] ?? []

  /* Trong lúc lật, lớp nền phải hiện sẵn nội dung ĐÍCH ở phía tờ giấy vừa rời
     đi, còn phía kia giữ nguyên - nhờ vậy tờ giấy đáp xuống là khớp ngay. */
  let baseLeft = current[0]
  let baseRight = current[1]
  let leafFront
  let leafBack

  if (turning === 'next') {
    if (isSpread) {
      // tờ giấy rời khỏi bên phải, để lộ trang phải mới nằm sẵn bên dưới
      baseRight = target[1]
      leafFront = current[1]
      leafBack = target[0]
    } else {
      baseLeft = target[0]
      leafFront = current[0]
      leafBack = target[0]
    }
  } else if (turning === 'prev') {
    if (isSpread) {
      baseLeft = target[0]
      leafFront = target[1]
      leafBack = current[0]
    } else {
      // lật lùi: tờ giấy quét từ trái sang và đáp lên trên trang đang xem
      baseLeft = current[0]
      leafFront = target[0]
      leafBack = current[0]
    }
  }

  const canPrev = index > 0
  const canNext = index < spreads.length - 1

  return (
    <section id="gallery" className="relative overflow-hidden bg-background px-4 py-24 md:px-6 md:py-32">
      <div ref={ref} className="reveal relative mx-auto max-w-5xl">
        <div className="mb-12 text-center md:mb-14">
          <SplitWords
            as="h2"
            text={t('gallery.title')}
            step={60}
            className="mb-3 block font-serif text-4xl text-primary md:text-5xl"
          />
          <p className="font-serif text-lg italic text-muted-foreground">{t('gallery.subtitle')}</p>
        </div>

        {/* ── Cuốn album ────────────────────────────────────────────────── */}
        <div className="relative mx-auto max-w-3xl md:max-w-5xl">
          <div
            className="relative [perspective:2200px]"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="relative flex border border-border bg-sand shadow-[0_18px_50px_-24px_rgb(0_0_0/0.4)]">
              {/* trang trái - chỉ có khi mở hai trang */}
              {isSpread && (
                <div className="album-gutter-left w-1/2">
                  <AlbumPage photo={baseLeft} onOpen={setLightbox} indexOf={indexOfPhoto} side="left" />
                </div>
              )}

              {/* trang phải, hoặc trang duy nhất trên điện thoại */}
              <div className={`${isSpread ? 'album-gutter-right w-1/2' : 'w-full'}`}>
                <AlbumPage photo={baseRight ?? baseLeft} onOpen={setLightbox} indexOf={indexOfPhoto} side="right" />
              </div>

              {/* gáy sách */}
              {isSpread && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border"
                />
              )}

              {/* ── Tờ giấy đang lật ─────────────────────────────────────── */}
              {turning && (
                <div
                  ref={leafRef}
                  className={`album-leaf absolute inset-y-0 z-20 ${
                    isSpread ? 'left-1/2 w-1/2' : 'left-0 w-full'
                  }`}
                >
                  <div className="album-face bg-sand">
                    <AlbumPage photo={leafFront} side="right" static />
                  </div>
                  <div className="album-face album-face-back bg-sand">
                    <AlbumPage photo={leafBack} side="left" static />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Điều khiển ──────────────────────────────────────────────── */}
          <div className="mt-7 flex items-center justify-center gap-6">
            <TurnButton dir="prev" disabled={!canPrev || !!turning} onClick={() => go('prev')} label={t('gallery.prev')} />
            <p className="min-w-24 text-center text-xs tracking-[0.2em] text-muted-foreground tabular-nums">
              {index + 1} / {spreads.length}
            </p>
            <TurnButton dir="next" disabled={!canNext || !!turning} onClick={() => go('next')} label={t('gallery.next')} />
          </div>
        </div>
      </div>

      <Lightbox
        photos={photos}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onChange={setLightbox}
      />
    </section>
  )
}

/** Một trang giấy: khung kem, ảnh đặt lọt bên trong với lề như ảnh dán album */
function AlbumPage({ photo, onOpen, indexOf, side, static: isStatic = false }) {
  const { t } = useLanguage()
  if (!photo) return <div className="aspect-3/4 w-full bg-sand" />

  const inner = (
    <img
      src={photo.src}
      alt={photo.alt}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-contain"
    />
  )

  return (
    <div className={`aspect-3/4 w-full ${side === 'left' ? 'pr-2 pl-3 md:pr-3 md:pl-5' : 'pr-3 pl-2 md:pr-5 md:pl-3'} py-4 md:py-6`}>
      <div className="h-full w-full bg-background p-1.5 shadow-[0_2px_10px_-6px_rgb(0_0_0/0.35)] md:p-2.5">
        {isStatic || !onOpen ? (
          inner
        ) : (
          <button
            type="button"
            onClick={() => onOpen(indexOf.get(photo.src) ?? 0)}
            aria-label={t('gallery.viewLarger')}
            className="block h-full w-full cursor-pointer"
          >
            {inner}
          </button>
        )}
      </div>
    </div>
  )
}

function TurnButton({ dir, disabled, onClick, label }) {
  const Icon = dir === 'prev' ? ChevronLeft : ChevronRight
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-default disabled:opacity-30"
    >
      <Icon className="h-5 w-5" />
    </button>
  )
}
