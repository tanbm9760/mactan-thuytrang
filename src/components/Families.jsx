import { useLanguage } from '../lib/i18n'
import { config } from '../config'
import { useReveal } from '../hooks/useReveal'
import { RevealGroup, SplitWords } from './Reveal'

export default function Families() {
  const { t } = useLanguage()
  const introRef = useReveal()
  const { groom, bride } = config.families

  const sides =
    config.nameOrder === 'bride-first'
      ? [
          { family: bride, person: config.bride.name, role: t('families.daughter') },
          { family: groom, person: config.groom.name, role: t('families.son') },
        ]
      : [
          { family: groom, person: config.groom.name, role: t('families.son') },
          { family: bride, person: config.bride.name, role: t('families.daughter') },
        ]

  return (
    <section className="bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <SplitWords
          as="h2"
          text={t('families.title')}
          step={60}
          className="mb-4 block font-serif text-3xl text-primary md:text-4xl"
        />
        <p ref={introRef} className="reveal mx-auto mb-14 max-w-xl leading-relaxed text-muted-foreground">
          {t('families.intro')}
        </p>

        {/* Ba ô phẳng: nhà một bên, đường ngăn, nhà bên kia. Giữ cấu trúc phẳng
            để nhóm hiện dần gắn được trực tiếp lên từng ô. */}
        <RevealGroup
          step={160}
          className="grid gap-12 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8"
        >
          <FamilySide side={sides[0]} />
          <div aria-hidden className="mx-auto h-px w-24 bg-border md:h-32 md:w-px" />
          <FamilySide side={sides[1]} />
        </RevealGroup>
      </div>
    </section>
  )
}

function FamilySide({ side, className = '', ...rest }) {
  return (
    <div className={`space-y-2 ${className}`} {...rest}>
      <p className="text-xs uppercase tracking-[0.25em] text-primary">{side.family.title}</p>
      <p className="text-muted-foreground">{side.family.father}</p>
      <p className="text-muted-foreground">{side.family.mother}</p>
      <p className="pt-3 text-xs uppercase tracking-widest text-muted-foreground/70">{side.role}</p>
      <p className="font-serif text-2xl text-foreground md:text-3xl">{side.person}</p>
    </div>
  )
}
