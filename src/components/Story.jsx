import { useLanguage } from '../lib/i18n'
import { chapterAssets } from '../lib/assets'
import { useReveal } from '../hooks/useReveal'
import Chapter from './Chapter'
import { SplitWords } from './Reveal'

/**
 * Ba chương truyện nối liền nhau, khép lại bằng một câu bắc cầu sang phần mời.
 * Ảnh của từng chương lấy từ src/assets/chapters/01, /02, /03 — thứ tự chương
 * trong translations phải khớp với thứ tự thư mục.
 */
export default function Story() {
  const { t } = useLanguage()
  const chapters = t('story.chapters') ?? []
  const keys = Object.keys(chapterAssets).sort()
  const eyebrowRef = useReveal()

  return (
    <div id="story">
      <div className="bg-background px-6 pt-24 pb-14 text-center md:pt-32 md:pb-20">
        <p
          ref={eyebrowRef}
          className="reveal text-[11px] uppercase tracking-[0.4em] text-muted-foreground"
        >
          {t('story.eyebrow')}
        </p>
      </div>

      {chapters.map((chapter, i) => {
        const assets = chapterAssets[keys[i]] ?? { lead: null, photos: [] }
        return (
          <Chapter
            key={chapter.numeral}
            numeral={chapter.numeral}
            title={chapter.title}
            text={chapter.text}
            lead={assets.lead}
            photos={assets.photos}
            flip={i % 2 === 1}
          />
        )
      })}

      {/* Câu bắc cầu: kết chuyện tình và mở sang lời mời */}
      <div className="bg-background px-6 pb-24 md:pb-32">
        <SplitWords
          as="p"
          text={t('story.closing')}
          step={45}
          className="mx-auto block max-w-2xl text-center font-serif text-2xl leading-snug text-primary md:text-4xl"
        />
      </div>
    </div>
  )
}
