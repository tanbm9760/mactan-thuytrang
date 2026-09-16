import { useLanguage } from '../lib/i18n'
import { config, coupleNames } from '../config'
import { googleCalendarUrl } from '../lib/calendar'
import { mapUrl } from '../lib/venue'
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
 * cả phần này. Dưới nó chỉ còn hai thứ: chương trình trong ngày và địa điểm.
 *
 * Bản gọn đã bỏ bảng "giờ đón khách / địa điểm / địa chỉ" từng nằm giữa ngày
 * cưới và chương trình: giờ đón khách đã có trong chương trình, địa điểm và
 * địa chỉ đã có ở khối địa điểm ngay bên dưới - cùng một thông tin in hai lần.
 */
export default function Details() {
  const { t, language } = useLanguage()
  const dateRef = useReveal({ threshold: 0.35 })
  const date = config.weddingDate

  return (
    <section id="details" className="relative overflow-hidden sec bg-background">
      <Florals preset="details" />
      <div className="gutter">
        <div className="mx-auto max-w-4xl">
          <SectionMark numeral="II" align="center" />

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

          {config.sections.schedule && <Schedule />}
        </div>
      </div>

      <Location />
    </section>
  )
}

/**
 * Địa điểm. Tên nơi tổ chức là thứ lớn nhất, dưới là sảnh, địa chỉ và hai
 * nút. Không nhúng bản đồ: khách cần đường đi thì bấm "Chỉ đường" là mở thẳng
 * Google Maps trên máy - dải bản đồ nhúng chỉ dài thêm trang mà trên điện
 * thoại lại còn giành mất cú vuốt cuộn trang.
 */
function Location() {
  const { t, language } = useLanguage()
  const ref = useReveal({ threshold: 0.2 })

  return (
    <div className="mt-16 md:mt-24">
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
    </div>
  )
}
