import { Phone } from 'lucide-react'
import { useLanguage } from '../lib/i18n'
import { config, coupleNames } from '../config'

export default function Footer() {
  const { t } = useLanguage()

  const contacts = [
    { role: t('footer.groom'), name: config.groom.shortName, phone: config.contact.groomPhone },
    { role: t('footer.bride'), name: config.bride.shortName, phone: config.contact.bridePhone },
  ].filter((c) => c.phone)

  return (
    <footer className="bg-background px-6 py-14 text-center">
      <p className="mb-2 font-serif text-2xl text-primary">{coupleNames}</p>
      <p className="mb-8 font-serif italic text-muted-foreground">{t('footer.thanks')}</p>

      {contacts.length > 0 && (
        <div className="mx-auto mb-8 flex max-w-xs flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-4">
          {contacts.map((contact) => (
            <a
              key={contact.phone}
              href={`tel:${contact.phone.replace(/\s/g, '')}`}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-border px-6 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary sm:w-auto"
            >
              <Phone className="h-4 w-4" />
              <span>
                {contact.role} {contact.name} · {contact.phone}
              </span>
            </a>
          ))}
        </div>
      )}

      <p className="text-xs tracking-widest text-muted-foreground/60">
        © {new Date().getFullYear()} · {coupleNames}
      </p>
    </footer>
  )
}
