import { useCallback, useEffect } from 'react'
import { useLanguage } from '../lib/i18n'

/**
 * Xem ảnh phóng to, điều khiển được bằng phím ← → và Esc.
 *
 * Nền là màu olive sẫm của thiệp chứ không phải đen tuyền, ảnh không bo góc
 * và không đổ bóng, các nút là chữ chứ không phải icon tròn - để lúc phóng to
 * vẫn còn cảm giác đang xem một tấm ảnh in, không phải mở một trình xem ảnh.
 */
export default function Lightbox({ photos, index, onClose, onChange }) {
  const { t } = useLanguage()
  const open = index !== null && index >= 0

  const go = useCallback(
    (step) => {
      if (!open || photos.length === 0) return
      onChange((index + step + photos.length) % photos.length)
    },
    [index, onChange, open, photos.length],
  )

  useEffect(() => {
    if (!open) return

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'ArrowRight') go(1)
    }

    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose, go])

  if (!open) return null
  const photo = photos[index]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('gallery.viewLarger')}
      className="fixed inset-0 z-100 flex flex-col bg-deep/97 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div className="flex shrink-0 items-center justify-between gutter py-4">
        <p className="font-serif text-sm font-light text-deep-foreground/60 tabular-nums">
          {String(index + 1).padStart(2, '0')}
          <span className="mx-1.5 text-deep-foreground/25">/</span>
          {String(photos.length).padStart(2, '0')}
        </p>
        <button
          onClick={onClose}
          aria-label={t('gallery.close')}
          className="t-eyebrow -mr-2 flex min-h-11 cursor-pointer items-center px-2 text-deep-foreground/60 transition-colors duration-500 hover:text-deep-foreground"
        >
          {t('gallery.close')}
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-2">
        <img
          src={photo.src}
          alt={photo.alt}
          onClick={(e) => e.stopPropagation()}
          className="fade-up max-h-full w-auto object-contain"
        />
      </div>

      {photos.length > 1 && (
        <div className="flex shrink-0 items-center justify-center gap-12 py-5">
          <NavButton label={t('gallery.prev')} glyph="←" onClick={() => go(-1)} />
          <span aria-hidden className="h-px w-16 bg-deep-foreground/20" />
          <NavButton label={t('gallery.next')} glyph="→" onClick={() => go(1)} />
        </div>
      )}
    </div>
  )
}

function NavButton({ label, glyph, onClick }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      aria-label={label}
      className="flex h-11 w-11 cursor-pointer items-center justify-center text-lg text-deep-foreground/60 transition-colors duration-500 hover:text-deep-foreground"
    >
      <span aria-hidden>{glyph}</span>
    </button>
  )
}
