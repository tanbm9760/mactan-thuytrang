import { useLanguage } from '../lib/i18n'
import { config } from '../config'
import { useReveal } from '../hooks/useReveal'
import { RevealGroup } from './Reveal'
import LotusIcon from './LotusIcon'
import Florals from './Florals'
import { local } from '../lib/local'

/**
 * Lời báo hỷ của hai gia đình, dựng theo đúng thứ tự trên tấm thiệp in: tên cha
 * mẹ hai bên → câu báo tin → tên đầy đủ cô dâu chú rể.
 *
 * Bản gọn: không số chương, không tiêu đề "Trân trọng kính mời" (bìa thiệp đã
 * nói câu ấy), không câu cảm tạ ở cuối. Hai bên nội ngoại đặt CẠNH NHAU ở mọi
 * khổ máy như trên thiệp in - xếp chồng trên điện thoại thì riêng phần tên cha
 * mẹ đã dài gần một màn hình.
 */
export default function Families() {
  const { t, language } = useLanguage()
  const announceRef = useReveal()
  const { groom, bride } = config.families

  const sides =
    config.nameOrder === 'bride-first'
      ? [
          { family: bride, person: config.bride.fullName ?? config.bride.name },
          { family: groom, person: config.groom.fullName ?? config.groom.name },
        ]
      : [
          { family: groom, person: config.groom.fullName ?? config.groom.name },
          { family: bride, person: config.bride.fullName ?? config.bride.name },
        ]

  return (
    <section className="relative overflow-hidden sec gutter bg-sand">
      <Florals preset="families" />
      <div className="mx-auto max-w-3xl text-center">
        {/* ── Cha mẹ hai bên ─────────────────────────────────────────────── */}
        <RevealGroup
          step={170}
          className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-10"
        >
          <FamilySide family={sides[0].family} language={language} />
          <div aria-hidden className="h-20 w-px bg-border md:h-24" />
          <FamilySide family={sides[1].family} language={language} />
        </RevealGroup>

        {/* ── Câu báo tin ────────────────────────────────────────────────── */}
        <p
          ref={announceRef}
          className="reveal t-caption mx-auto mt-12 max-w-sm text-pretty text-muted-foreground md:mt-16"
        >
          {t('families.announce')}
        </p>

        {/* ── Tên đầy đủ cô dâu chú rể ───────────────────────────────────── */}
        <RevealGroup as="div" step={160} className="mt-6">
          <p className="t-display letterpress text-[clamp(1.7rem,6.5vw,3rem)] text-foreground">
            {sides[0].person}
          </p>
          <p className="my-2 font-serif text-base text-primary italic md:my-3">&amp;</p>
          <p className="t-display letterpress text-[clamp(1.7rem,6.5vw,3rem)] text-foreground">
            {sides[1].person}
          </p>
        </RevealGroup>
      </div>
    </section>
  )
}

/* Trên điện thoại mỗi bên chỉ còn nửa bề ngang, nên cỡ chữ tên cha mẹ co theo
   khổ máy: `(100vw - 65px) / 23` là cỡ lớn nhất mà dòng dài nhất ("Bà Hoàng
   Thị Hồng Ánh") còn nằm trên một dòng - đo được chữ rộng 11 lần cỡ chữ, cột
   rộng (khổ máy - 65px) / 2. Từ 360px trở lên không dòng nào phải xuống hàng. */
function FamilySide({ family, language, className = '', ...rest }) {
  return (
    <div className={`space-y-1.5 md:space-y-2 ${className}`} {...rest}>
      <p className="t-eyebrow mb-3 text-primary md:mb-5">{local(family, 'title', language)}</p>

      <p className="flex items-center justify-center gap-1.5 font-serif text-[clamp(0.75rem,calc((100vw_-_65px)/23),0.9375rem)] font-light text-balance text-foreground md:text-[1.0625rem]">
        <span>{local(family, 'father', language)}</span>
        {family.fatherLotus && <LotusIcon className="shrink-0 text-gold" />}
      </p>

      <p className="flex items-center justify-center gap-1.5 font-serif text-[clamp(0.75rem,calc((100vw_-_65px)/23),0.9375rem)] font-light text-balance text-foreground md:text-[1.0625rem]">
        <span>{local(family, 'mother', language)}</span>
        {family.motherLotus && <LotusIcon className="shrink-0 text-gold" />}
      </p>

      {family.address && (
        <p className="t-caption pt-1 text-muted-foreground/80 md:pt-2">{family.address}</p>
      )}
    </div>
  )
}
