import { useEffect, useState } from 'react'
import { useLanguage } from '../lib/i18n'
import { config, orderedNames } from '../config'
import { guestName } from '../lib/guest'
import Monogram from './Monogram'

const SEEN_KEY = 'wedding-cover-seen'

/**
 * Bìa thiệp. Vào trang thấy một tấm bìa olive sẫm với monogram; chạm vào thì
 * bìa tách đôi trượt sang hai bên để lộ ảnh hero.
 *
 * Ngoài việc tạo nghi thức, nó còn che đúng khoảng thời gian ảnh hero đang tải
 * — khách không bao giờ thấy màn hình trống.
 *
 * Chỉ hiện một lần mỗi phiên: cuộn lại trang giữa chừng không phải mở lại bìa.
 */
export default function Cover() {
  const { t } = useLanguage()
  const [state, setState] = useState('hidden') // hidden | shown | opening | done

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1'
    } catch {
      /* trình duyệt chặn storage — cứ hiện bìa */
    }
    setState(seen ? 'done' : 'shown')
  }, [])

  useEffect(() => {
    if (state !== 'shown' && state !== 'opening') return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [state])

  const open = () => {
    if (state !== 'shown') return
    setState('opening')
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* bỏ qua */
    }
    setTimeout(() => setState('done'), 1100)
  }

  if (state === 'hidden' || state === 'done') return null

  const opening = state === 'opening'
  const dateStr = t('details.dateFormat')(config.weddingDate)

  /* Mỗi nửa bìa chứa cùng một nội dung rộng bằng cả màn hình, chỉ khác là bị
     cắt bởi khung của nửa đó — ghép lại thành một mặt bìa liền mạch. */
  const face = (align) => (
    <div
      className={`absolute inset-y-0 ${align} flex w-screen flex-col items-center justify-center px-8 text-center`}
    >
      <Monogram size={104} tone="light" className="mb-10" />

      {guestName && (
        <>
          <p className="mb-2 text-[11px] uppercase tracking-[0.35em] text-[#f7f3ea]/55">
            {t('cover.inviting')}
          </p>
          <p className="mb-8 font-serif text-2xl text-[#f7f3ea] md:text-3xl">{guestName}</p>
        </>
      )}

      <div className="mb-8 h-px w-16 bg-[#b08d57]" />

      <p className="font-serif text-3xl leading-tight text-[#f7f3ea] md:text-5xl">
        {orderedNames[0]}
      </p>
      <p className="my-2 font-serif text-xl text-[#b08d57] md:text-2xl">&</p>
      <p className="font-serif text-3xl leading-tight text-[#f7f3ea] md:text-5xl">
        {orderedNames[1]}
      </p>

      <p className="mt-8 text-[11px] uppercase tracking-[0.3em] text-[#f7f3ea]/60">{dateStr}</p>
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-200 flex"
      role={opening ? undefined : 'button'}
      tabIndex={opening ? -1 : 0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          open()
        }
      }}
      aria-label={t('cover.open')}
    >
      <div
        className={`relative h-full w-1/2 overflow-hidden bg-deep transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          opening ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {face('left-0')}
      </div>
      <div
        className={`relative h-full w-1/2 overflow-hidden bg-deep transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          opening ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        {face('right-0')}
      </div>

      {/* Đường nối giữa hai nửa + lời mời chạm */}
      <div
        aria-hidden
        /* Mờ dần ở giữa để đường nối không cắt ngang qua tên và monogram,
           nhưng vẫn thấy ở trên dưới nên khách đoán được bìa sẽ tách đôi. */
        className={`pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-linear-to-b from-[#b08d57]/35 via-transparent to-[#b08d57]/35 transition-opacity duration-500 ${
          opening ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <p
        className={`pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 animate-pulse text-[11px] uppercase tracking-[0.3em] text-[#f7f3ea]/60 transition-opacity duration-500 ${
          opening ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {t('cover.open')}
      </p>
    </div>
  )
}
