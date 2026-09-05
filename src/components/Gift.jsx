import { useEffect, useState } from 'react'
import { useLanguage } from '../lib/i18n'
import { config } from '../config'
import { qrBride, qrGroom } from '../lib/assets'
import { useReveal } from '../hooks/useReveal'
import Florals from './Florals'

/**
 * Hộp mừng cưới, cố ý là phần nhỏ tiếng nhất của cả tấm thiệp.
 *
 * Không nút bấm có viền, không icon mã QR, không khối nào trông giống một
 * component ngân hàng. Chỉ một câu chữ nhỏ và hai đường gạch chân - đúng cỡ
 * một lời nhắn thêm ở cuối thiệp. Mã QR chỉ xuất hiện khi khách chủ động mở.
 */
export default function Gift() {
  const { t } = useLanguage()
  const ref = useReveal()
  const [openSide, setOpenSide] = useState(null)

  const sides = [
    { key: 'groom', label: t('gift.groomBtn'), qr: qrGroom, info: config.gift.groom },
    { key: 'bride', label: t('gift.brideBtn'), qr: qrBride, info: config.gift.bride },
  ]

  const active = sides.find((side) => side.key === openSide)

  return (
    <section id="gift" className="relative overflow-hidden sec-sm gutter bg-background">
      <Florals preset="gift" />
      <div ref={ref} className="reveal mx-auto max-w-xl text-center">
        <span aria-hidden className="mx-auto block h-px w-10 bg-gold/70" />

        <h2 className="t-quote mt-9 text-[clamp(1.25rem,3.4vw,1.6rem)] text-foreground">
          {t('gift.title')}
        </h2>

        <p className="t-caption mx-auto mt-5 max-w-md text-pretty text-muted-foreground">
          {t('gift.desc')}
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
          {sides.map((side) => (
            <button
              key={side.key}
              onClick={() => setOpenSide(side.key)}
              className="t-eyebrow rule-link rule-on cursor-pointer text-primary transition-colors duration-500 hover:text-foreground"
            >
              {side.label}
            </button>
          ))}
        </div>
      </div>

      {active && <GiftCard side={active} onClose={() => setOpenSide(null)} />}
    </section>
  )
}

/** Tấm thiệp chuyển khoản, mở ra giữa màn hình. */
function GiftCard({ side, onClose }) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(id)
  }, [copied])

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(side.info.account)
      setCopied(true)
    } catch {
      // Trình duyệt cũ / không có quyền clipboard: chọn sẵn text cho khách tự copy
      window.prompt(t('gift.copy'), side.info.account)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={side.label}
      className="fixed inset-0 z-100 flex items-center justify-center bg-deep/85 p-5 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fade-up relative w-full max-w-xs bg-background px-8 py-10 text-center shadow-[0_40px_90px_-40px_rgb(0_0_0/0.7)]"
      >
        <div aria-hidden className="pointer-events-none absolute inset-3 border border-border" />

        <div className="relative">
          <p className="t-eyebrow text-primary">{side.info.bank}</p>

          {side.qr ? (
            <img
              src={side.qr}
              alt={side.label}
              className="mx-auto mt-7 w-full max-w-[220px] bg-white p-2.5"
            />
          ) : (
            <div className="t-caption mx-auto mt-7 flex aspect-square w-full max-w-[220px] items-center justify-center border border-dashed border-border p-6 text-muted-foreground">
              {t('gift.noQr')}
            </div>
          )}

          <p className="t-eyebrow mt-6 text-muted-foreground">{t('gift.scanHint')}</p>

          <p className="t-num mt-7 text-[1.5rem] text-foreground">{side.info.account}</p>
          <p className="t-eyebrow mt-3 text-muted-foreground">{side.info.holder}</p>

          <div className="mt-8 flex flex-col items-center gap-5">
            <button
              onClick={copyAccount}
              className="t-eyebrow rule-link rule-on cursor-pointer text-primary transition-colors duration-500 hover:text-foreground"
            >
              {copied ? t('gift.copied') : t('gift.copy')}
            </button>
            <button
              onClick={onClose}
              className="t-eyebrow cursor-pointer text-muted-foreground/70 transition-colors duration-500 hover:text-foreground"
            >
              {t('gallery.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
