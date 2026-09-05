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

  return (
    <section
      id="top"
      ref={wrapRef}
      className="relative flex h-svh min-h-[600px] items-center justify-center overflow-hidden"
    >
      <img
        ref={imgRef}
        src={heroImage}
        alt=""
        aria-hidden
        fetchPriority="high"
        className="parallax-img hero-zoom absolute inset-x-0 top-[-7%] h-[114%] w-full object-cover object-[50%_62%]"
      />
      <div aria-hidden className="hero-scrim absolute inset-0" />

      <div className="relative z-10 w-full px-5 text-center text-white">
        <RevealGroup step={130}>
          <p className="hero-sub mb-6 text-[10px] uppercase tracking-[0.42em] text-white/85 md:mb-8 md:text-xs">
            {t('hero.subtitle')}
          </p>

          <h1 className="hero-title font-serif leading-[0.98]">
            <span className="block text-[3.15rem] break-words sm:text-7xl md:text-8xl lg:text-9xl">
              {orderedNames[0]}
            </span>
            <span className="my-2 block text-2xl text-white/80 md:my-3 md:text-4xl">&</span>
            <span className="block text-[3.15rem] break-words sm:text-7xl md:text-8xl lg:text-9xl">
              {orderedNames[1]}
            </span>
          </h1>

          <div className="mx-auto mt-9 flex max-w-lg items-center justify-center gap-5 md:mt-11">
            <span className="h-px flex-1 bg-white/45" />
            <p className="hero-sub font-serif text-base italic whitespace-nowrap md:text-xl">
              {dateStr}
            </p>
            <span className="h-px flex-1 bg-white/45" />
          </div>

          <p className="hero-sub mt-5 text-[10px] uppercase tracking-[0.32em] text-white/85 md:text-xs">
            {config.venue.city}
          </p>
        </RevealGroup>

        {config.sections.rsvp && (
          <RevealGroup start={430}>
            <button
              onClick={() => document.querySelector('#rsvp')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-10 min-h-12 cursor-pointer bg-white px-9 text-[11px] tracking-[0.22em] text-foreground uppercase transition-colors hover:bg-white/90 md:mt-12 md:text-xs"
            >
              {t('hero.cta')}
            </button>
          </RevealGroup>
        )}
      </div>

      <button
        onClick={() => document.querySelector('#countdown, #story')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label={t('hero.scroll')}
        className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 cursor-pointer text-white/60 transition-colors hover:text-white"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </button>
    </section>
  )
}
