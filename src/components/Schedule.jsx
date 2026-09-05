import { useLanguage } from '../lib/i18n'
import { config } from '../config'
import { RevealGroup } from './Reveal'

/**
 * Chương trình trong ngày, dựng thành một trục dọc mảnh thay vì các thẻ rời.
 * Trục kẻ tóc chạy xuyên qua các chấm giờ giữ cho khối này đọc như một mạch.
 */
export default function Schedule() {
  const { t, language } = useLanguage()
  const items = config.schedule ?? []
  if (items.length === 0) return null

  return (
    <div className="mt-20">
      <h3 className="mb-10 text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        {t('schedule.title')}
      </h3>

      {/* w-fit + mx-auto: khối co đúng bằng nội dung rồi mới canh giữa.
          Nếu để max-w cố định, cột giờ hẹp sẽ làm cả khối lệch sang trái.
          Trục dọc nằm ngoài RevealGroup để nó không bị cuốn vào hiệu ứng. */}
      <div className="relative mx-auto w-fit">
        <span
          aria-hidden
          className="absolute top-2 bottom-2 left-26 w-px -translate-x-1/2 bg-border"
        />

        <RevealGroup as="ol" step={140} className="relative">
          {items.map((item) => (
            <li key={item.time} className="relative flex items-baseline pb-9 last:pb-0">
              {/* Ba cột cố định: giờ | trục | việc - nhờ vậy chấm tròn luôn nằm
                  giữa khoảng trống, không bao giờ dính vào chữ. */}
              <span className="w-20 shrink-0 text-right font-serif text-lg tabular-nums">
                {item.time}
              </span>
              <span aria-hidden className="w-12 shrink-0" />
              <span className="text-left">
                <span className="block text-muted-foreground">{item[language] ?? item.vi}</span>
                {item[`${language}Note`] && (
                  <span className="mt-0.5 block font-serif text-sm italic text-muted-foreground/70">
                    {item[`${language}Note`]}
                  </span>
                )}
              </span>
              <span
                aria-hidden
                className="absolute left-26 top-[0.6rem] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gold"
              />
            </li>
          ))}
        </RevealGroup>
      </div>
    </div>
  )
}
