import { useLanguage } from '../lib/i18n'
import { config, coupleNames } from '../config'
import { useReveal } from '../hooks/useReveal'
import Monogram from './Monogram'

/**
 * Đoạn kết, nối liền một mạch với phần xác nhận tham dự - cùng một nền olive
 * sẫm, không có đường cắt nào ở giữa. Cả trang sáng lên rồi tắt dần đúng một
 * lần, ở cuối.
 *
 * Chỉ còn bốn thứ: dấu triện, lời cảm ơn, tên hai người, và số điện thoại đặt
 * rất nhỏ. Không hàng nút, không cột liên kết.
 */
export default function Footer() {
  const { t } = useLanguage()
  const ref = useReveal({ threshold: 0.3 })

  const contacts = [
    { role: t('footer.groom'), name: config.groom.shortName, phone: config.contact.groomPhone },
    { role: t('footer.bride'), name: config.bride.shortName, phone: config.contact.bridePhone },
  ].filter((c) => c.phone)

  return (
    <footer data-deep className="gutter bg-deep pt-4 pb-16 text-center text-deep-foreground md:pb-20">
      <div ref={ref} className="reveal mx-auto max-w-xl">
        <Monogram size={72} tone="light" ring className="mx-auto" />

        <p className="t-quote mx-auto mt-10 max-w-sm text-pretty text-[clamp(1.05rem,3vw,1.3rem)] text-deep-foreground/80">
          {t('footer.thanks')}
        </p>

        <p className="t-display mt-10 text-[clamp(1.35rem,4.5vw,1.85rem)] text-deep-foreground">
          {coupleNames}
        </p>

        {contacts.length > 0 && (
          <div className="mt-14 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-12">
            {contacts.map((contact) => (
              <a
                key={contact.phone}
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                className="group flex min-h-11 items-center"
              >
                <span className="t-eyebrow text-deep-foreground/60 transition-colors duration-500 group-hover:text-deep-foreground/80">
                  {contact.role} {contact.name}
                </span>
                <span aria-hidden className="mx-3 h-px w-5 bg-deep-foreground/20" />
                <span className="font-serif text-sm font-light text-deep-foreground/75 tabular-nums transition-colors duration-500 group-hover:text-deep-foreground">
                  {contact.phone}
                </span>
              </a>
            ))}
          </div>
        )}

        <p className="t-eyebrow mt-16 text-deep-foreground/40">
          {new Date().getFullYear()} · {coupleNames}
        </p>
      </div>
    </footer>
  )
}
