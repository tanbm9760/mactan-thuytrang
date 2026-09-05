import { useLanguage } from '../lib/i18n'
import { config } from '../config'
import { RevealGroup } from './Reveal'

/**
 * Chương trình trong ngày, in như một tấm programme card kẹp trong bộ thiệp.
 *
 * Không trục dọc, không chấm tròn, không thẻ. Chỉ có ba thứ: cột giờ canh
 * phải, một khoảng trống cố định, và cột việc canh trái - ngăn nhau bằng kẻ
 * tóc. Nhịp dọc làm hết phần việc mà trước đây phải nhờ tới các chấm timeline.
 */
export default function Schedule() {
  const { t, language } = useLanguage()
  const items = config.schedule ?? []
  if (items.length === 0) return null

  return (
    <div className="mx-auto mt-24 max-w-2xl md:mt-32">
      <p className="t-eyebrow text-center text-muted-foreground">{t('schedule.title')}</p>

      <RevealGroup as="ol" step={140} className="mt-10 border-t border-border">
        {items.map((item) => (
          <li
            key={item.time}
            className="grid grid-cols-[4.5rem_1fr] items-baseline gap-x-6 border-b border-border py-6 md:grid-cols-[6rem_1fr] md:gap-x-10 md:py-7"
          >
            <span className="t-num text-right text-[1.25rem] text-primary md:text-[1.5rem]">
              {item.time}
            </span>
            <span>
              <span className="block font-serif text-[1.0625rem] font-light text-foreground md:text-lg">
                {item[language] ?? item.vi}
              </span>
              {item[`${language}Note`] && (
                <span className="t-caption mt-1 block text-muted-foreground/85 italic">
                  {item[`${language}Note`]}
                </span>
              )}
            </span>
          </li>
        ))}
      </RevealGroup>
    </div>
  )
}
