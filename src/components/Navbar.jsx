import { useEffect, useState } from 'react'
import { Globe, Menu, X } from 'lucide-react'
import { useLanguage } from '../lib/i18n'
import { config } from '../config'
import Monogram from './Monogram'

export default function Navbar() {
  const { t, language, setLanguage, languages } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Khoá cuộn nền khi menu mobile đang mở
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const links = [
    config.sections.story && { label: t('nav.story'), href: '#story' },
    { label: t('nav.details'), href: '#details' },
    config.sections.gallery && { label: t('nav.gallery'), href: '#gallery' },
    config.sections.gift && { label: t('nav.gift'), href: '#gift' },
    config.sections.rsvp && { label: t('nav.rsvp'), href: '#rsvp' },
  ].filter(Boolean)

  const goTo = (href) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 px-6 py-4 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'bg-background/90 shadow-sm backdrop-blur-md'
          : // Ảnh hero có thể rất sáng — phủ một lớp tối mờ để chữ trắng luôn đọc được
            'bg-linear-to-b from-black/45 via-black/20 to-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            setMenuOpen(false)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="block transition-opacity hover:opacity-80"
          aria-label="Về đầu trang"
        >
          <Monogram size={44} tone="gold" />
        </a>

        {/* --- Menu desktop --- */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => goTo(link.href)}
              className="cursor-pointer text-sm text-foreground uppercase tracking-widest transition-colors hover:text-primary"
            >
              {link.label}
            </button>
          ))}
          <LanguageSwitch language={language} setLanguage={setLanguage} langs={languages} />
        </div>

        {/* --- Nút menu mobile --- */}
        <button
          className="-mr-2.5 cursor-pointer p-2.5 text-foreground md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* --- Menu mobile --- */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-full flex flex-col items-center gap-2 border-t border-border bg-background/95 p-4 shadow-md backdrop-blur-md md:hidden">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => goTo(link.href)}
              className="w-full cursor-pointer py-2 font-serif text-lg text-foreground hover:text-primary"
            >
              {link.label}
            </button>
          ))}
          <div className="my-2 h-px w-full bg-border" />
          <LanguageSwitch language={language} setLanguage={setLanguage} langs={languages} />
        </div>
      )}
    </nav>
  )
}

function LanguageSwitch({ language, setLanguage, langs }) {
  return (
    <div className="flex items-center gap-3">
      <Globe className="h-4 w-4 text-foreground" />
      {langs.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          aria-label={lang.name}
          aria-current={language === lang.code}
          className={`cursor-pointer text-sm uppercase tracking-widest transition-colors ${
            language === lang.code
              ? 'font-semibold text-primary underline underline-offset-4'
              : 'text-muted-foreground hover:text-primary'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
