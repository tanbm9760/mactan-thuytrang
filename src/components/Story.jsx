import { useLanguage } from '../lib/i18n'
import { coupleNames } from '../config'
import { storyImage } from '../lib/assets'
import { useReveal } from '../hooks/useReveal'
import { RevealGroup, SplitWords } from './Reveal'

/**
 * Chuyện tình gói gọn trong một khối: một tấm ảnh khung vòm bên trái, lời kể
 * bên phải. Trên điện thoại thì ảnh nằm trên, chữ nằm dưới.
 */
export default function Story() {
  const { t } = useLanguage()
  const imageRef = useReveal({ threshold: 0.1 })
  const paragraphs = t('story.paragraphs') ?? []

  return (
    <section id="story" className="bg-background px-6 py-24 md:py-32">
      <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-12 md:flex-row md:gap-20">
        <div className="relative w-full flex-1">
          <div
            ref={imageRef}
            className="reveal-mask aspect-4/5 overflow-hidden rounded-t-full md:absolute md:inset-0 md:aspect-auto"
          >
            <img
              src={storyImage}
              alt={coupleNames}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-[50%_30%]"
            />
          </div>
          {/* vệt màu trang trí phía sau ảnh */}
          <div
            aria-hidden
            className="absolute -right-6 -bottom-6 -z-10 h-32 w-32 rounded-full bg-sand opacity-70 blur-2xl"
          />
        </div>

        <div className="flex-1 space-y-6 text-center md:text-left">
          <SplitWords
            as="h2"
            text={t('story.title')}
            step={60}
            className="block font-serif text-4xl text-primary md:text-5xl"
          />
          <p className="font-serif text-lg italic text-muted-foreground">{t('story.subtitle')}</p>
          <div className="mx-auto h-px w-24 bg-gold/50 md:mx-0" />

          {/* Đoạn văn dài luôn canh trái cho dễ đọc, kể cả trên điện thoại */}
          <RevealGroup step={110} className="space-y-4 text-left leading-[1.85] text-muted-foreground">
            {paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            <p className="pt-2 font-serif text-xl leading-snug text-primary italic md:text-2xl">
              {t('story.closing')}
            </p>
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
