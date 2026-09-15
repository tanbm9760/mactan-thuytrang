import { useLanguage } from '../lib/i18n'
import { config, coupleNames } from '../config'
import { useReveal } from '../hooks/useReveal'
import Monogram from './Monogram'

/**
 * Đoạn kết, nối liền một mạch với phần xác nhận tham dự - cùng một nền olive
 * sẫm, không có đường cắt nào ở giữa. Cả trang sáng lên rồi tắt dần đúng một
 * lần, ở cuối.
 *
 * Chỉ còn ba thứ: dấu triện, số điện thoại của hai người, và một dòng tên rất
 * nhỏ. Lời cảm ơn và dòng tên cỡ lớn đã bỏ trong bản gọn - tên hai người đã in
 * ba lần phía trên, còn số điện thoại là thông tin duy nhất ở đây khách cần.
 */
export default function Footer() {
  const { t } = useLanguage()
  const ref = useReveal({ threshold: 0.3 })

  const contacts = [
    { role: t('footer.groom'), name: config.groom.shortName, phone: config.contact.groomPhone },
    { role: t('footer.bride'), name: config.bride.shortName, phone: config.contact.bridePhone },
  ].filter((c) => c.phone)

  return (
    <footer data-deep className="gutter bg-deep pt-2 pb-12 text-center text-deep-foreground md:pb-16">
      <div ref={ref} className="reveal mx-auto max-w-xl">
        <Monogram size={56} tone="light" ring className="mx-auto" />

        {contacts.length > 0 && (
          <div className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-12">
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

        <p className="t-eyebrow mt-10 text-deep-foreground/40">
          {new Date().getFullYear()} · {coupleNames}
        </p>
      </div>
    </footer>
  )
}
