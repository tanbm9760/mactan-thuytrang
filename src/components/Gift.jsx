import { useEffect, useState } from 'react'
import { Check, Copy, QrCode, X } from 'lucide-react'
import { useLanguage } from '../lib/i18n'
import { config } from '../config'
import { qrBride, qrGroom } from '../lib/assets'
import { useReveal } from '../hooks/useReveal'
import Florals from './Florals'

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
    <section id="gift" className="relative overflow-hidden bg-sand px-6 py-24 md:py-28">
      <Florals preset="gift" />
      <div ref={ref} className="reveal relative mx-auto max-w-3xl text-center">
        <h2 className="mb-8 font-serif text-4xl text-primary md:text-5xl">{t('gift.title')}</h2>
        <p className="mb-12 leading-relaxed text-muted-foreground">{t('gift.desc')}</p>

        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          {sides.map((side) => (
            <button
              key={side.key}
              onClick={() => setOpenSide(side.key)}
              className="flex w-full cursor-pointer items-center justify-center gap-3 border border-primary/40 bg-background px-8 py-4 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground sm:w-auto"
            >
              <QrCode className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-widest">{side.label}</span>
            </button>
          ))}
        </div>
      </div>

      {active && <GiftModal side={active} onClose={() => setOpenSide(null)} />}
    </section>
  )
}

function GiftModal({ side, onClose }) {
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
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm border border-border bg-background p-6 text-center shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label={t('gallery.close')}
          className="absolute top-3 right-3 cursor-pointer rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="mb-1 font-serif text-xl">{side.info.label}</h3>
        <p className="mb-5 text-xs uppercase tracking-widest text-muted-foreground">
          {t('gift.scanHint')}
        </p>

        {side.qr ? (
          <img
            src={side.qr}
            alt={side.label}
            className="mx-auto mb-5 w-full max-w-[280px] rounded-xl bg-white p-3 shadow-sm"
          />
        ) : (
          <div className="mx-auto mb-5 flex aspect-square w-full max-w-[280px] items-center justify-center rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
            {t('gift.noQr')}
          </div>
        )}

        <div className="space-y-1 text-sm">
          <p className="font-medium">{side.info.bank}</p>
          <p className="font-serif text-xl tracking-wider tabular-nums">{side.info.account}</p>
          <p className="uppercase tracking-widest text-muted-foreground">{side.info.holder}</p>
        </div>

        <button
          onClick={copyAccount}
          className="mt-5 inline-flex cursor-pointer items-center gap-2 border border-primary/40 px-5 py-2.5 text-xs uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? t('gift.copied') : t('gift.copy')}
        </button>
      </div>
    </div>
  )
}
