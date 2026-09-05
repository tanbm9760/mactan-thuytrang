import { useLanguage } from '../lib/i18n'
import { config } from '../config'
import { useReveal } from '../hooks/useReveal'
import { RevealGroup, SplitWords } from './Reveal'
import LotusIcon from './LotusIcon'
import Florals from './Florals'

/**
 * Khối lời mời của hai gia đình, dựng theo đúng thứ tự trên tấm thiệp in:
 * tên cha mẹ hai bên → câu báo tin → tên đầy đủ cô dâu chú rể → lời cảm tạ.
 */
export default function Families() {
  const { t } = useLanguage()
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
    <section className="relative overflow-hidden bg-background px-6 py-24 md:py-32">
      <Florals preset="families" />

      <div className="relative mx-auto max-w-4xl text-center">
        <SplitWords
          as="h2"
          text={t('families.title')}
          step={60}
          className="mb-14 block font-serif text-3xl text-primary md:text-4xl"
        />

        {/* ── Cha mẹ hai bên ─────────────────────────────────────────────── */}
        <RevealGroup
          step={160}
          className="grid gap-10 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8"
        >
          <FamilySide family={sides[0].family} />
          <div aria-hidden className="mx-auto h-px w-20 bg-border md:h-28 md:w-px" />
          <FamilySide family={sides[1].family} />
        </RevealGroup>

        {/* ── Câu báo tin ────────────────────────────────────────────────── */}
        <p
          ref={announceRef}
          className="reveal mx-auto mt-16 max-w-md text-[13px] tracking-wide text-muted-foreground uppercase"
        >
          {t('families.announce')}
        </p>

        {/* ── Tên đầy đủ cô dâu chú rể ───────────────────────────────────── */}
        <RevealGroup as="div" step={150} className="mt-8">
          <p className="font-serif text-3xl text-foreground md:text-5xl">{sides[0].person}</p>
          <p className="my-2 font-serif text-xl text-gold md:my-3 md:text-2xl">&</p>
          <p className="font-serif text-3xl text-foreground md:text-5xl">{sides[1].person}</p>
        </RevealGroup>

        <p ref={honourRef} className="reveal mx-auto mt-14 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          {t('families.honour')}
        </p>
      </div>
    </section>
  )
}

function FamilySide({ family, className = '', ...rest }) {
  return (
    <div className={`space-y-1.5 ${className}`} {...rest}>
      <p className="mb-3 text-xs tracking-[0.25em] text-primary uppercase">{family.title}</p>

      <p className="flex items-center justify-center gap-1.5 text-muted-foreground">
        <span>{family.father}</span>
        {family.fatherLotus && <LotusIcon className="shrink-0 text-gold" />}
      </p>

      <p className="flex items-center justify-center gap-1.5 text-muted-foreground">
        <span>{family.mother}</span>
        {family.motherLotus && <LotusIcon className="shrink-0 text-gold" />}
      </p>

      {family.address && (
        <p className="pt-1 font-serif text-sm italic text-muted-foreground/75">{family.address}</p>
      )}
    </div>
  )
}
