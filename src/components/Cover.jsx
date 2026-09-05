import { useEffect, useState } from 'react'
import { useLanguage } from '../lib/i18n'
import { config, orderedNames } from '../config'
import { guestName } from '../lib/guest'
import Monogram from './Monogram'

const SEEN_KEY = 'wedding-cover-seen'
const OPEN_MS = 1650

const pad = (n) => String(n).padStart(2, '0')

/**
 * Bìa thiệp - dựng như một tấm thiệp in thật chứ không phải màn hình chờ.
 *
 * Khung kẻ đôi mảnh, monogram dập chìm, chữ giãn rộng, một lớp vân giấy riêng
 * (lớp vân của cả trang nằm dưới bìa nên không nhìn thấy). Chạm vào thì bìa
 * tách đôi và trượt ra rất chậm - mở một tấm thiệp, không phải mở một cánh cửa.
 *
 * Ngoài việc tạo nghi thức, nó còn che đúng khoảng thời gian ảnh mở đầu đang
 * tải - khách không bao giờ thấy màn hình trống.
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
    setTimeout(() => setState('done'), OPEN_MS)
  }

  if (state === 'hidden' || state === 'done') return null

  const opening = state === 'opening'
  const date = config.weddingDate

  /* Mỗi nửa bìa chứa cùng một mặt thiệp rộng bằng cả màn hình, chỉ khác là bị
     cắt bởi khung của nửa đó — ghép lại thành một mặt bìa liền mạch. */
  const face = (align) => (
    <div className={`absolute inset-y-0 ${align} w-screen`}>
      {/* Khung kẻ đôi, thụt vào như đường bế của một tấm thiệp in */}
      <div
        aria-hidden
        className="absolute inset-[18px] border border-[#f0e9da]/16 sm:inset-7 md:inset-10"
      />
      <div
        aria-hidden
        className="absolute inset-[23px] border border-[#f0e9da]/8 sm:inset-9 md:inset-[3.25rem]"
      />

      <div
        className={`cover-face absolute inset-0 flex flex-col items-center justify-center px-10 text-center ${
          opening ? 'scale-[1.015] opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <p className="t-eyebrow text-[#f0e9da]/58">{t('cover.ceremony')}</p>

        <Monogram size={92} tone="light" ring className="my-9" />

        <p className="t-display letterpress-dark text-[clamp(2rem,8.5vw,3.25rem)] text-[#f0e9da]">
          {orderedNames[0]}
        </p>
        <p className="my-3 font-serif text-sm text-[#a98a53] italic">&amp;</p>
        <p className="t-display letterpress-dark text-[clamp(2rem,8.5vw,3.25rem)] text-[#f0e9da]">
          {orderedNames[1]}
        </p>

        <div aria-hidden className="my-9 h-px w-14 bg-[#a98a53]/60" />

        <p className="t-eyebrow-lg text-[#f0e9da]/60">
          {pad(date.getDate())} · {pad(date.getMonth() + 1)} · {date.getFullYear()}
        </p>

        {guestName && (
          <div className="mt-12">
            <p className="t-eyebrow text-[#f0e9da]/52">{t('cover.inviting')}</p>
            <p className="mt-3 font-serif text-xl font-light text-[#f0e9da]/90">{guestName}</p>
          </div>
        )}
      </div>
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
        className={`cover-panel relative h-full w-1/2 overflow-hidden bg-deep ${
          opening ? '-translate-x-full opacity-90' : 'translate-x-0'
        }`}
      >
        {face('left-0')}
      </div>
      <div
        className={`cover-panel relative h-full w-1/2 overflow-hidden bg-deep ${
          opening ? 'translate-x-full opacity-90' : 'translate-x-0'
        }`}
      >
        {face('right-0')}
      </div>

      {/* Vân giấy riêng cho bìa: lớp vân của cả trang nằm DƯỚI bìa nên không
          nhìn thấy ở đây, mà một mặt olive phẳng lì thì lộ ngay là màn hình. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23c)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Đường nối giữa hai nửa: mờ hẳn ở giữa để không cắt ngang qua tên và
          monogram, nhưng vẫn thấy ở trên dưới nên khách đoán được bìa sẽ tách. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-linear-to-b from-[#a98a53]/30 via-transparent to-[#a98a53]/30 transition-opacity duration-700 ${
          opening ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <p
        className={`t-eyebrow pointer-events-none absolute bottom-14 left-1/2 -translate-x-1/2 text-[#f0e9da] transition-opacity duration-500 ${
          opening ? 'opacity-0' : 'breathe'
        }`}
      >
        {t('cover.open')}
      </p>
    </div>
  )
}
