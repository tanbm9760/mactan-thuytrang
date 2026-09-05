import { useEffect, useState } from 'react'
import { useLanguage } from '../lib/i18n'
import { config } from '../config'
import { useReveal } from '../hooks/useReveal'
import { RevealGroup } from './Reveal'
import Florals from './Florals'

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

/**
 * Quãng nghỉ đầu tiên sau ảnh mở đầu. Cố tình thấp và rất thoáng.
 *
 * Bốn con số không nằm trong bốn ô có viền nữa - chúng đứng trên một nét kẻ
 * tóc duy nhất và tụt dần xuống theo một đường chéo rất nhẹ, nên khối này
 * đọc như một dòng chữ trên giấy chứ không như một widget đếm ngược.
 */
export default function Countdown() {
  const { t } = useLanguage()
  const ruleRef = useReveal({ threshold: 0.5 })
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
    <section id="countdown" className="relative overflow-hidden sec-sm gutter bg-background">
      <Florals preset="countdown" />
      <div className="mx-auto max-w-4xl">
        {left ? (
          <>
            <p className="t-eyebrow text-muted-foreground">{t('countdown.title')}</p>
            <span
              ref={ruleRef}
              aria-hidden
              className="reveal-rule mt-5 block h-px w-full origin-left bg-border"
            />

            <RevealGroup step={110} className="mt-8 grid grid-cols-4 gap-3 md:mt-10 md:gap-8">
              {units.map((unit, i) => (
                /* Cột ngoài để nguyên cho hiệu ứng hiện dần (nó chiếm quyền
                   dùng `transform`), cột trong mới tụt xuống - bằng margin,
                   nên hai thứ không giẫm chân nhau. */
                <div key={unit.label}>
                  <div style={{ marginTop: `calc(${i} * clamp(0.35rem, 1.6vw, 0.9rem))` }}>
                    <div className="t-num text-[clamp(1.9rem,8.5vw,5.5rem)] text-foreground">
                      {String(unit.value).padStart(2, '0')}
                    </div>
                    <div className="t-eyebrow mt-3 text-muted-foreground md:mt-4">{unit.label}</div>
                  </div>
                </div>
              ))}
            </RevealGroup>
          </>
        ) : (
          <p className="t-quote text-center text-[clamp(1.5rem,4vw,2.25rem)] text-primary">
            {t('countdown.done')}
          </p>
        )}
      </div>
    </section>
  )
}
