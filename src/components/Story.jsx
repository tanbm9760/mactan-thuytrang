import { useLanguage } from '../lib/i18n'
import { coupleNames } from '../config'
import { storyImage } from '../lib/assets'
import { useReveal } from '../hooks/useReveal'
import { RevealGroup } from './Reveal'
import SectionMark from './SectionMark'
import Florals from './Florals'

/**
 * Trang đôi của một quyển tạp chí, không phải một section "ảnh | chữ".
 *
 * Ba thứ làm nên điều đó:
 *  1. Ảnh chạy tràn ra khỏi mép trái màn hình, không nằm gọn trong container.
 *  2. Cột chữ hẹp (34 ký tự) và bắt đầu THẤP hơn đỉnh ảnh - hai khối lệch
 *     nhau theo chiều dọc thay vì cùng bắt đầu ở một đường ngang.
 *  3. Tiêu đề chồng nhẹ lên chữ số chương cỡ lớn phía sau nó.
 *
 * Dưới 1024px thì xếp dọc: ảnh tràn hết bề ngang rồi mới tới chữ - đúng cách
 * một trang tạp chí xử lý khổ hẹp. Chia đôi cột sớm hơn (từ 768px) thì tấm ảnh
 * co lại còn hơn 300px và chìm nghỉm bên cạnh một cột chữ dài gấp ba nó.
 */
export default function Story() {
  const { t } = useLanguage()
  const imageRef = useReveal({ threshold: 0.08 })
  const closingRef = useReveal({ threshold: 0.3 })
  const paragraphs = t('story.paragraphs') ?? []

  return (
    <section id="story" className="relative sec-lg overflow-hidden bg-background">
      <Florals preset="story" />
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-0">
        {/* ── Ảnh, tràn ra mép trái ──────────────────────────────────────── */}
        <div className="lg:col-span-6 lg:pt-[6vw]">
          <figure
            ref={imageRef}
            className="reveal-mask aspect-4/5 w-full overflow-hidden lg:aspect-3/4"
          >
            <img
              src={storyImage}
              alt={coupleNames}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-[52%_26%]"
            />
          </figure>
        </div>

        {/* ── Cột chữ ────────────────────────────────────────────────────── */}
        <div className="gutter lg:col-span-5 lg:col-start-8 lg:pr-[clamp(1.5rem,5vw,7rem)] lg:pl-0">
          <SectionMark numeral="I" />

          <h2 className="t-head mt-10 text-[clamp(2.1rem,6.5vw,3.5rem)] text-foreground">
            {t('story.title')}
          </h2>

          <p className="t-quote mt-5 text-[clamp(1.05rem,2.4vw,1.35rem)] text-primary">
            {t('story.subtitle')}
          </p>

          <RevealGroup step={90} className="t-body measure-wide mt-10 space-y-5 text-muted-foreground">
            {paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </RevealGroup>

          <div ref={closingRef} className="reveal mt-12 md:mt-16">
            <span aria-hidden className="mb-7 block h-px w-16 bg-gold/70" />
            <p className="t-quote text-[clamp(1.3rem,3.2vw,1.85rem)] text-foreground">
              {t('story.closing')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
