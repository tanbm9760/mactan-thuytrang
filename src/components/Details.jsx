import { useLanguage } from '../lib/i18n'
import { config, coupleNames } from '../config'
import { googleCalendarUrl } from '../lib/calendar'
import { mapEmbedUrl, mapUrl } from '../lib/venue'
import { useReveal } from '../hooks/useReveal'
import Schedule from './Schedule'
import { RevealGroup } from './Reveal'
import SectionMark from './SectionMark'
import { local } from '../lib/local'
import Florals from './Florals'

const pad = (n) => String(n).padStart(2, '0')

/**
 * Trang thông tin của tấm thiệp in.
 *
 * Ngày cưới không còn là "một dòng thông tin" mà là khối đồ hoạ lớn nhất của
 * cả phần này; giờ giấc, địa điểm và ngày âm tụt hẳn xuống hàng chữ phụ, xếp
 * thành các dòng kẻ tóc như một tờ chương trình - không phải ba cái thẻ.
 */
export default function Details() {
  const { t, language } = useLanguage()
  const dateRef = useReveal({ threshold: 0.35 })
  const date = config.weddingDate

  const rows = [
    { label: t('details.time'), lines: [t('details.timeFormat')(date)] },
    { label: t('details.where'), lines: [
        local(config.venue, 'name', language),
        local(config.venue, 'subName', language),
        local(config.venue, 'hall', language),
      ] },
    { label: t('details.address'), lines: [config.venue.address] },
  ]
    .map((row) => ({ ...row, lines: row.lines.filter(Boolean) }))
    .filter((row) => row.lines.length > 0)

  return (
    <section id="details" className="relative overflow-hidden sec bg-background">
      <Florals preset="details" />
      <div className="gutter">
        <div className="mx-auto max-w-4xl">
          <SectionMark numeral="III" align="center" />

          {/* ── Ngày cưới, dựng như một khối đồ hoạ ────────────────────── */}
          <div ref={dateRef} className="reveal mt-14 text-center md:mt-20">
            <p className="t-eyebrow text-muted-foreground">
              {t('details.weekdays')[date.getDay()]}
            </p>

            <p className="t-num letterpress mt-7 flex items-center justify-center text-[clamp(4.25rem,22vw,10.5rem)] text-foreground">
              <span>{pad(date.getDate())}</span>
              {/* Dấu ngăn được VẼ chứ không dùng ký tự "·".
                  Với ký tự, chỗ đứng của nó do font quyết định và nó rơi xuống
                  gần đường chân chữ. Còn một chấm tròn thì canh được chính
                  xác: `items-center` canh giữa hộp lề của nó theo hộp dòng,
                  mà tâm hộp dòng thấp hơn tâm thị giác của chữ số đúng 0.1em -
                  nên thêm 0.2em lề dưới là nó nhích lên đúng chỗ. Mọi kích
                  thước đều tính theo em nên tỉ lệ giữ nguyên ở mọi khổ máy. */}
              <span
                aria-hidden
                className="mx-[0.17em] mb-[0.2em] h-[0.05em] w-[0.05em] shrink-0 rounded-full bg-gold"
              />
              <span>{pad(date.getMonth() + 1)}</span>
            </p>

            <p
              className="mt-7 text-[0.8125rem] text-muted-foreground uppercase md:mt-8"
              /* text-indent bù đúng khoảng giãn thừa sau chữ cuối, nếu không
                 khối số sẽ lệch trái khi canh giữa. */
              style={{ letterSpacing: '0.62em', textIndent: '0.62em' }}
            >
              {date.getFullYear()}
            </p>

            {config.lunarDate && (
              <p className="t-caption mt-6 text-muted-foreground/85 italic">
                {local(config, 'lunarDate', language)}
              </p>
            )}
          </div>

          {/* ── Chữ phụ, xếp thành dòng kẻ tóc ─────────────────────────── */}
          <RevealGroup
            as="dl"
            step={130}
            className="mx-auto mt-20 max-w-2xl border-t border-border md:mt-24"
          >
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid gap-y-2 border-b border-border py-6 md:grid-cols-[10rem_1fr] md:items-baseline md:gap-x-10 md:py-7"
              >
                <dt className="t-eyebrow text-muted-foreground">{row.label}</dt>
                <dd className="md:text-right">
                  {row.lines.map((line, i) => (
                    <span
                      key={line}
                      className={
                        i === 0
                          ? 'block font-serif text-[1.0625rem] font-light text-foreground md:text-lg'
                          : 't-caption mt-1 block text-muted-foreground'
                      }
                    >
                      {line}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </RevealGroup>

          {config.sections.schedule && <Schedule />}
        </div>
      </div>

      <Location />
    </section>
  )
}

/**
 * Địa điểm. Tên nơi tổ chức là thứ lớn nhất; bản đồ Google bị đẩy xuống thành
 * một dải mỏng tràn viền và được kéo bớt màu cho gần với sắc giấy của trang -
 * nó ở đó để dùng, không phải để nhìn.
 */
function Location() {
  const { t, language } = useLanguage()
  const ref = useReveal({ threshold: 0.2 })

  return (
    <div className="mt-24 md:mt-32">
      <div ref={ref} className="reveal gutter">
        <div className="mx-auto max-w-4xl text-center">
          <p className="t-eyebrow text-muted-foreground">{t('details.where')}</p>

          <h3 className="t-head mt-6 text-[clamp(1.85rem,6vw,3.25rem)] text-foreground">
            {local(config.venue, 'name', language)}
          </h3>

          {config.venue.subName && (
            <p className="t-quote mt-3 text-[1.0625rem] text-primary md:text-xl">
              {local(config.venue, 'subName', language)}
            </p>
          )}

          <p className="t-caption mt-6 text-muted-foreground">
            {config.venue.hall && (
              <>
                {local(config.venue, 'hall', language)}
                <span aria-hidden className="mx-2 text-gold">·</span>
              </>
            )}
            {config.venue.address}
          </p>

          <div className="mt-11 flex flex-col items-center justify-center gap-7 sm:flex-row sm:gap-12">
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="t-eyebrow rule-link rule-on text-foreground transition-colors duration-500 hover:text-primary"
            >
              {t('details.directions')}
            </a>
            <a
              href={googleCalendarUrl(coupleNames)}
              target="_blank"
              rel="noreferrer"
              className="t-eyebrow rule-link rule-on text-foreground transition-colors duration-500 hover:text-primary"
            >
              {t('details.addToCalendar')}
            </a>
          </div>
        </div>
      </div>

      {/* Dải bản đồ: tràn viền, thấp, đã rút bớt màu. */}
      <div className="mt-14 border-y border-border md:mt-20">
        <iframe
          title={config.venue.name}
          src={mapEmbedUrl}
          className="block h-[210px] w-full border-0 saturate-[45%] sepia-[14%] contrast-[104%] md:h-[280px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  )
}
