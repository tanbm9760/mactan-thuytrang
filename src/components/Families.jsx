import { useLanguage } from '../lib/i18n'
import { config } from '../config'
import { useReveal } from '../hooks/useReveal'
import { RevealGroup } from './Reveal'
import LotusIcon from './LotusIcon'
import SectionMark from './SectionMark'
import Florals from './Florals'
import { local } from '../lib/local'

/**
 * Lời mời của hai gia đình, dựng theo đúng thứ tự trên tấm thiệp in: tên cha
 * mẹ hai bên → câu báo tin → tên đầy đủ cô dâu chú rể → lời cảm tạ.
 *
 * Đây là phần trang trọng nhất của thiệp, nên nó cũng là phần đối xứng nhất
 * và tĩnh nhất. Không thẻ, không hộp bo góc, không hoa - chỉ có khoảng trắng
 * rất rộng, vài nét kẻ tóc, và chữ được xếp cân đúng trục giữa.
 */
export default function Families() {
  const { t, language } = useLanguage()
  const announceRef = useReveal()
  const honourRef = useReveal()
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
    <section className="relative overflow-hidden sec-lg gutter bg-sand">
      <Florals preset="families" />
      <div className="mx-auto max-w-3xl text-center">
        <SectionMark numeral="II" align="center" />

        <h2 className="t-head mt-9 text-[clamp(1.6rem,4.4vw,2.5rem)] text-foreground">
          {t('families.title')}
        </h2>

        {/* ── Cha mẹ hai bên ─────────────────────────────────────────────── */}
        <RevealGroup
          step={170}
          className="mt-16 grid gap-12 md:mt-20 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-10"
        >
          <FamilySide family={sides[0].family} language={language} />
          <div aria-hidden className="mx-auto h-px w-16 bg-border md:h-24 md:w-px" />
          <FamilySide family={sides[1].family} language={language} />
        </RevealGroup>

        {/* ── Câu báo tin ────────────────────────────────────────────────── */}
        <p
          ref={announceRef}
          className="reveal t-caption mx-auto mt-20 max-w-sm text-pretty text-muted-foreground md:mt-24"
        >
          {t('families.announce')}
        </p>

        {/* ── Tên đầy đủ cô dâu chú rể ───────────────────────────────────── */}
        <RevealGroup as="div" step={160} className="mt-9">
          <p className="t-display letterpress text-[clamp(1.85rem,7vw,3.25rem)] text-foreground">
            {sides[0].person}
          </p>
          <p className="my-4 font-serif text-base text-primary italic md:my-5">&amp;</p>
          <p className="t-display letterpress text-[clamp(1.85rem,7vw,3.25rem)] text-foreground">
            {sides[1].person}
          </p>
        </RevealGroup>

        <div ref={honourRef} className="reveal mt-20 md:mt-24">
          <span aria-hidden className="mx-auto mb-8 block h-px w-10 bg-gold/70" />
          <p className="t-quote mx-auto max-w-lg text-pretty text-[clamp(1.05rem,2.6vw,1.35rem)] text-muted-foreground">
            {t('families.honour')}
          </p>
        </div>
      </div>
    </section>
  )
}

function FamilySide({ family, language, className = '', ...rest }) {
  return (
    <div className={`space-y-2 ${className}`} {...rest}>
      <p className="t-eyebrow mb-5 text-primary">{local(family, 'title', language)}</p>

      <p className="flex items-center justify-center gap-1.5 font-serif text-[1.0625rem] font-light text-foreground">
        <span>{family.father}</span>
        {family.fatherLotus && <LotusIcon className="shrink-0 text-gold" />}
      </p>

      <p className="flex items-center justify-center gap-1.5 font-serif text-[1.0625rem] font-light text-foreground">
        <span>{family.mother}</span>
        {family.motherLotus && <LotusIcon className="shrink-0 text-gold" />}
      </p>

      {family.address && (
        <p className="t-caption pt-2 text-muted-foreground/80">{family.address}</p>
      )}
    </div>
  )
}
