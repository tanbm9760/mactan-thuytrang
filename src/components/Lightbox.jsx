import { useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useLanguage } from '../lib/i18n'

/** Xem ảnh phóng to, điều khiển được bằng phím ← → và Esc */
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
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label={t('gallery.close')}
        className="absolute top-4 right-4 cursor-pointer rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/80"
      >
        <X className="h-6 w-6" />
      </button>

      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              go(-1)
            }}
            aria-label={t('gallery.prev')}
            className="absolute left-2 cursor-pointer rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/80 md:left-6"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              go(1)
            }}
            aria-label={t('gallery.next')}
            className="absolute right-2 cursor-pointer rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/80 md:right-6"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <img
        src={photo.src}
        alt={photo.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-2xl"
      />

      {photos.length > 1 && (
        <p className="absolute bottom-6 text-sm tracking-widest text-white/70 tabular-nums">
          {index + 1} / {photos.length}
        </p>
      )}
    </div>
  )
}
