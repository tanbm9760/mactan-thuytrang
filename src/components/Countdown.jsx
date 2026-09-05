import { useEffect, useState } from 'react'
import { useLanguage } from '../lib/i18n'
import { config } from '../config'
import { useReveal } from '../hooks/useReveal'
import { RevealGroup } from './Reveal'

function timeLeft(target) {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function Countdown() {
  const { t } = useLanguage()
  const ref = useReveal()
  const [left, setLeft] = useState(() => timeLeft(config.weddingDate))

  useEffect(() => {
    const id = setInterval(() => setLeft(timeLeft(config.weddingDate)), 1000)
    return () => clearInterval(id)
  }, [])

  const units = left
    ? [
        { value: left.days, label: t('countdown.days') },
        { value: left.hours, label: t('countdown.hours') },
        { value: left.minutes, label: t('countdown.minutes') },
        { value: left.seconds, label: t('countdown.seconds') },
      ]
    : []

  return (
    <section id="countdown" className="bg-background px-6 py-16 md:py-20">
      <div ref={ref} className="reveal mx-auto max-w-3xl text-center">
        {left ? (
          <>
            <p className="mb-8 font-serif text-sm uppercase tracking-[0.25em] text-muted-foreground">
              {t('countdown.title')}
            </p>
            <RevealGroup step={90} className="grid grid-cols-4 border-y border-border">
              {units.map((unit, i) => (
                <div
                  key={unit.label}
                  className={`px-1 py-7 md:py-9 ${i > 0 ? 'border-l border-border' : ''}`}
                >
                  <div className="font-serif text-3xl font-light text-primary tabular-nums md:text-5xl">
                    {String(unit.value).padStart(2, '0')}
                  </div>
                  <div className="mt-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:text-xs">
                    {unit.label}
                  </div>
                </div>
              ))}
            </RevealGroup>
          </>
        ) : (
          <p className="font-serif text-2xl italic text-primary md:text-3xl">{t('countdown.done')}</p>
        )}
      </div>
    </section>
  )
}
