import { CalendarPlus, MapPin } from 'lucide-react'
import { useLanguage } from '../lib/i18n'
import { config, coupleNames } from '../config'
import { googleCalendarUrl } from '../lib/calendar'
import { mapEmbedUrl, mapUrl } from '../lib/venue'
import { useReveal } from '../hooks/useReveal'
import Schedule from './Schedule'
import { RevealGroup } from './Reveal'

const pad = (n) => String(n).padStart(2, '0')

export default function Details() {
  const { t } = useLanguage()
  const ref = useReveal()
  const refMap = useReveal({ threshold: 0.05 })
  const date = config.weddingDate

  const facts = [
    { label: t('details.time'), lines: [t('details.timeFormat')(date)] },
    { label: t('details.where'), lines: [config.venue.name, config.venue.subName] },
    { label: t('details.lunar'), lines: [config.lunarDate] },
  ].filter((f) => f.lines.filter(Boolean).length > 0)

  return (
    <section id="details" className="bg-sand px-6 py-24 md:py-32">
      <div ref={ref} className="reveal mx-auto max-w-4xl">
        {/* ── Ngày cưới đặt cỡ lớn, dùng như một khối đồ hoạ ───────────────── */}
        <div className="text-center">
          <p className="mb-4 text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
            {t('details.weekdays')[date.getDay()]}
          </p>

          <RevealGroup
            step={120}
            className="display-date flex items-center justify-center gap-4 text-[5.5rem] text-primary sm:text-[8rem] md:gap-8 md:text-[11rem]"
          >
            <span>{pad(date.getDate())}</span>
            <span aria-hidden className="text-gold/50">·</span>
            <span>{pad(date.getMonth() + 1)}</span>
          </RevealGroup>

          <p className="mt-4 text-sm uppercase tracking-[0.55em] text-muted-foreground">
            {date.getFullYear()}
          </p>
        </div>

        {/* ── Ba thông tin, ngăn bằng kẻ tóc thay vì thẻ có đổ bóng ────────── */}
        <RevealGroup as="dl" step={130} className="mt-16 grid gap-px overflow-hidden border-y border-border md:grid-cols-3 md:gap-0">
          {facts.map((fact, i) => (
            <div
              key={fact.label}
              className={`px-6 py-8 text-center ${
                i > 0 ? 'border-t border-border md:border-t-0 md:border-l' : ''
              }`}
            >
              <dt className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                {fact.label}
              </dt>
              {fact.lines.filter(Boolean).map((line) => (
                <dd key={line} className="font-serif text-lg text-foreground">
                  {line}
                </dd>
              ))}
            </div>
          ))}
        </RevealGroup>

        {config.sections.schedule && <Schedule />}
      </div>

      {/* ── Bản đồ ───────────────────────────────────────────────────────── */}
      <div ref={refMap} className="reveal mx-auto mt-20 max-w-4xl border border-border bg-background">
        <iframe
          title={config.venue.name}
          src={mapEmbedUrl}
          className="h-[300px] w-full border-0 md:h-[380px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <div className="border-t border-border p-8 text-center">
          <p className="font-serif text-xl">{config.venue.name}</p>
          {config.venue.subName && (
            <p className="mt-1 text-sm text-muted-foreground">{config.venue.subName}</p>
          )}
          <p className="mt-1 mb-7 text-sm text-muted-foreground">{config.venue.address}</p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 border border-primary px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:w-auto"
            >
              <MapPin className="h-4 w-4" />
              {t('details.directions')}
            </a>
            <a
              href={googleCalendarUrl(coupleNames)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 border border-border px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary hover:text-primary sm:w-auto"
            >
              <CalendarPlus className="h-4 w-4" />
              {t('details.addToCalendar')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
