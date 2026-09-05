import { useEffect, useState } from 'react'
import { useLanguage } from '../lib/i18n'
import { config } from '../config'
import Monogram from './Monogram'

/**
 * Thanh điều hướng gần như tàng hình.
 *
 * Trước đây nav phải phủ một lớp đen mờ lên ảnh mở đầu để chữ trắng đọc được.
 * Giờ thì không cần: đỉnh ảnh đã tan vào màu giấy, nên nav dùng đúng mực sẫm
 * như phần còn lại của trang, và bức ảnh không bị tối đi một chút nào.
 *
 * Trên điện thoại, menu mở ra thành một tờ giấy phủ kín màn hình với chữ
 * serif cỡ lớn - một trang mục lục, không phải cái dropdown của một cái app.
 */
/* Chiều cao thanh nav: đệm trên dưới 16px + dấu triện 36px */
const NAV_HEIGHT = 68

export default function Navbar() {
  const { t, language, setLanguage, languages } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [onDeep, setOnDeep] = useState(false)

  /* Đoạn kết của trang là một khối olive sẫm chạy tới hết chân trang. Một
     thanh giấy sáng trôi ngang qua giữa khối đó thì lộ hẳn ra là giao diện
     phần mềm, nên tới đó nav đổi sang chính màu nền ấy và chìm hẳn vào -
     vẫn bấm được, chỉ là không còn nhìn thấy.

     Câu hỏi phải trả lời đúng là "ngay SAU thanh nav đang là nền gì", chứ
     không phải "khối sẫm đã vào tầm nhìn chưa" - nếu hỏi câu thứ hai thì nav
     đen sạm lại từ lúc khối sẫm mới ló ở đáy màn hình, trong khi chỗ nó đang
     nằm vẫn là giấy sáng. Nên đây là một phép đo toạ độ, không phải một
     IntersectionObserver. Chỉ có hai khối để đo nên đo mỗi lần cuộn vẫn rẻ. */
  useEffect(() => {
    const blocks = [...document.querySelectorAll('[data-deep]')]

    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      setOnDeep(
        blocks.some((block) => {
          const rect = block.getBoundingClientRect()
          return rect.top <= NAV_HEIGHT && rect.bottom > 0
        }),
      )
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Khoá cuộn nền khi menu mobile đang mở
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
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
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 gutter py-4 transition-all duration-700 ${
          onDeep
            ? 'border-b border-transparent bg-deep'
            : scrolled
              ? 'border-b border-border/70 bg-background/88 backdrop-blur-md'
              : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-[88rem] items-center justify-between">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              setMenuOpen(false)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="-my-2 block py-2 transition-opacity duration-500 hover:opacity-60"
            aria-label={t('nav.home')}
          >
            <Monogram size={36} tone={onDeep ? 'light' : 'gold'} />
          </a>

          {/* ── Máy tính ──────────────────────────────────────────────────
              Ngưỡng là 1024px chứ không phải 768px: năm mục chữ hoa giãn
              0.42em cộng với nút đổi ngôn ngữ không đủ chỗ trên máy tính bảng
              dựng đứng, và khi chật thì từng mục tự xuống dòng làm thanh nav
              dày lên gấp đôi. Dưới ngưỡng đó dùng tờ mục lục. */}
          <div className="hidden items-center gap-9 lg:flex">
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => goTo(link.href)}
                className={`t-eyebrow rule-link cursor-pointer whitespace-nowrap transition-colors duration-500 ${
                  onDeep
                    ? 'text-deep-foreground/60 hover:text-deep-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </button>
            ))}
            <span
              aria-hidden
              className={`h-3 w-px ${onDeep ? 'bg-deep-foreground/20' : 'bg-border'}`}
            />
            <LanguageSwitch
              language={language}
              setLanguage={setLanguage}
              langs={languages}
              onDeep={onDeep}
            />
          </div>

          {/* ── Điện thoại ───────────────────────────────────────────────── */}
          <button
            className={`t-eyebrow -mr-2 flex min-h-11 cursor-pointer items-center px-2 lg:hidden ${
              onDeep ? 'text-deep-foreground/70' : 'text-muted-foreground'
            }`}
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="nav-sheet"
          >
            {t('nav.menu')}
          </button>
        </div>
      </nav>

      {/* ── Tờ mục lục phủ kín màn hình ────────────────────────────────── */}
      {menuOpen && (
        <div
          id="nav-sheet"
          className="fade-up fixed inset-0 z-60 flex flex-col bg-background lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between gutter py-4">
            <Monogram size={36} tone="gold" />
            <button
              onClick={() => setMenuOpen(false)}
              className="t-eyebrow -mr-2 flex min-h-11 cursor-pointer items-center px-2 text-muted-foreground"
            >
              {t('nav.close')}
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gutter pb-24">
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => goTo(link.href)}
                className="t-head w-full cursor-pointer border-b border-border/70 py-5 text-left text-[1.75rem] text-foreground"
              >
                {link.label}
              </button>
            ))}

            <div className="mt-10">
              <LanguageSwitch language={language} setLanguage={setLanguage} langs={languages} />
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

function LanguageSwitch({ language, setLanguage, langs, onDeep = false }) {
  const active = onDeep ? 'text-deep-foreground' : 'text-foreground'
  const idle = onDeep
    ? 'text-deep-foreground/40 hover:text-deep-foreground/75'
    : 'text-muted-foreground/60 hover:text-muted-foreground'

  return (
    <div className="flex items-center gap-3">
      {langs.map((lang, i) => (
        <span key={lang.code} className="flex items-center gap-3">
          {i > 0 && (
            <span aria-hidden className={onDeep ? 'text-deep-foreground/25' : 'text-border'}>
              /
            </span>
          )}
          <button
            onClick={() => setLanguage(lang.code)}
            aria-label={lang.name}
            aria-current={language === lang.code}
            className={`t-eyebrow min-h-11 cursor-pointer transition-colors duration-500 md:min-h-0 ${
              language === lang.code ? active : idle
            }`}
          >
            {lang.label}
          </button>
        </span>
      ))}
    </div>
  )
}
