import { ChevronDown } from 'lucide-react'
import { useLanguage } from '../lib/i18n'
import { config, orderedNames } from '../config'
import { heroImage } from '../lib/assets'
import { useParallax } from '../hooks/useParallax'
import { RevealGroup } from './Reveal'

export default function Hero() {
  const { t } = useLanguage()
  const { wrapRef, imgRef } = useParallax(6)
  const dateStr = t('details.dateFormat')(config.weddingDate)
  const weekday = t('details.weekdays')[config.weddingDate.getDay()]

  return (
    <section
      id="top"
      ref={wrapRef}
      className="relative flex h-svh min-h-[560px] flex-col justify-end overflow-hidden"
    >
      <img
        ref={imgRef}
        src={heroImage}
        alt=""
        aria-hidden
        fetchPriority="high"
        className="parallax-img hero-zoom absolute inset-x-0 top-[-7%] h-[114%] w-full object-cover object-bottom"
      />

      {/* Phủ tối dồn xuống đáy: chữ nằm ở dải núi sẫm phía dưới, còn hai bàn
          tay ở giữa khung — điểm nhấn của ảnh — thì giữ nguyên độ sáng. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-black/85 from-15% via-black/35 via-45% to-black/5"
      />

      <div className="relative z-10 px-6 pb-16 text-center text-white md:pb-20">
        <RevealGroup as="h1" step={140} className="font-serif drop-shadow-md">
          <span className="block text-4xl leading-tight break-words sm:text-5xl md:text-6xl">
            {orderedNames[0]}
          </span>
          <span className="my-1 block font-serif text-xl text-white/70 md:my-2 md:text-3xl">&</span>
          <span className="block text-4xl leading-tight break-words sm:text-5xl md:text-6xl">
            {orderedNames[1]}
          </span>
        </RevealGroup>

        <RevealGroup step={110} start={420}>
          <div className="mx-auto mt-7 flex max-w-md items-center justify-center gap-4">
            <span className="h-px flex-1 bg-white/35" />
            <p className="text-xs tracking-[0.2em] whitespace-nowrap text-white/85 md:text-sm">
              {weekday}, {dateStr}
            </p>
            <span className="h-px flex-1 bg-white/35" />
          </div>
          <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/60 md:text-xs">
            {config.venue.city}
          </p>
        </RevealGroup>
      </div>

      <button
        onClick={() => document.querySelector('#countdown, #story')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label={t('hero.scroll')}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 cursor-pointer text-white/60 transition-colors hover:text-white"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </button>
    </section>
  )
}
