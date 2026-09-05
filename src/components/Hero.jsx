import { useLanguage } from '../lib/i18n'
import { config, orderedNames } from '../config'
import { heroImage } from '../lib/assets'
import { useParallax } from '../hooks/useParallax'
import { RevealGroup } from './Reveal'

const pad = (n) => String(n).padStart(2, '0')

/**
 * Trang bìa của một số tạp chí, không phải màn hình đầu của một website.
 *
 * Bức ảnh có ba tầng sáng rất rõ: trời ngà sáng ở trên, hai bàn tay thành
 * bóng ở giữa, dãy đồi gần như đen ở dưới. Chữ được đặt vào đúng hai vùng
 * trống ấy - mực sẫm nằm trên trời, chữ ngà nằm trên đồi - nên KHÔNG cần
 * phủ tối lên ảnh, và cũng không cần quầng bóng dày quanh chữ. Bức ảnh giữ
 * nguyên vẹn từ đầu đến cuối.
 *
 * Vùng trời đo được là rgb(253,234,196), gần đúng bằng màu giấy của trang.
 * Nhờ vậy mép trên tấm ảnh tan hẳn vào trang: thanh nav trôi trên giấy chứ
 * không nằm trên một tấm ảnh dán vào.
 */
export default function Hero() {
  const { t } = useLanguage()
  const { wrapRef, imgRef } = useParallax(6)
  const date = config.weddingDate

  return (
    <section
      id="top"
      ref={wrapRef}
      className="relative h-svh min-h-[600px] overflow-hidden bg-background"
    >
      <img
        ref={imgRef}
        src={heroImage}
        alt=""
        aria-hidden
        fetchPriority="high"
        className="parallax-img hero-zoom absolute inset-x-0 top-[-6%] h-[112%] w-full object-cover object-[50%_52%]"
      />

      {/* Mép trên tan vào giấy. Đây là lớp làm SÁNG, không phải lớp phủ tối. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[26%] bg-linear-to-b from-background via-background/45 to-transparent"
      />
      {/* Chân ảnh vốn đã gần như đen; lớp này chỉ để chắc chắn chữ ngà bám
          được kể cả khi trình duyệt cắt khung khác đi đôi chút. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[36%] bg-linear-to-t from-[#14120c]/60 via-[#14120c]/16 to-transparent"
      />

      <div className="relative z-10 flex h-full flex-col justify-between gutter pt-[clamp(5.25rem,11vh,7rem)] pb-[clamp(1.75rem,4vh,3rem)]">
        {/* ── Trên trời: mực sẫm ────────────────────────────────────────── */}
        <RevealGroup step={150} className="text-center">
          <p className="t-eyebrow text-foreground/65">{t('hero.subtitle')}</p>

          {/* Hai khổ máy cắt bức ảnh ra hai bố cục khác hẳn nhau, nên tên
              cũng phải xếp khác nhau:

              Điện thoại cắt dọc, hai bàn tay tụt xuống quá nửa khung - trên
              đầu còn nguyên một mảng trời cao, đủ chỗ cho tên xếp chồng.

              Máy tính giữ nguyên khung ngang, hai bàn tay vắt ngang chính
              giữa và dải trời sạch chỉ còn mỏng ở trên. Tên xếp chồng sẽ đè
              thẳng lên tay, nên ở đây tên trải thành MỘT dòng - vốn cũng là
              cách một trang bìa khổ ngang xử lý dòng tít của nó. */}
          <h1 className="t-display mt-6 text-foreground md:mt-7">
            <span className="flex flex-col items-center md:flex-row md:items-baseline md:justify-center md:gap-7">
              <span className="whitespace-nowrap text-[clamp(2.75rem,12vw,4.25rem)] md:text-[clamp(3.5rem,5.6vw,5.75rem)]">
                {orderedNames[0]}
              </span>
              <span className="my-[0.35em] font-serif text-[0.9rem] text-primary italic md:my-0 md:text-[1.5rem]">
                &amp;
              </span>
              <span className="whitespace-nowrap text-[clamp(2.75rem,12vw,4.25rem)] md:text-[clamp(3.5rem,5.6vw,5.75rem)]">
                {orderedNames[1]}
              </span>
            </span>
          </h1>

          {/* Ngày và nơi cũng ở lại trên trời, cùng màu mực với tên.
              Chúng từng nằm dưới chân ảnh, nhưng chỗ đó là vệt nắng vàng
              rực chứ không phải dãy đồi tối - chữ ngà đặt lên đó thì mờ, mà
              muốn đọc được thì phải phủ tối mất cả ráng chiều. Đưa lên đây
              là xong, không phải phủ gì cả. Cả hai dòng đều ngắn và canh
              giữa nên nằm gọn trong dải trời sạch ở trục giữa khung hình. */}
          <p className="t-eyebrow-lg mt-8 text-foreground/75 md:mt-10">
            {pad(date.getDate())} · {pad(date.getMonth() + 1)} · {date.getFullYear()}
          </p>
          <p className="t-eyebrow mt-3 text-foreground/50">{config.venue.city}</p>
        </RevealGroup>

        {/* ── Dưới đồi: chữ ngà ─────────────────────────────────────────── */}
        <RevealGroup start={560} step={130} className="text-center text-[#f2ecdd]">
          {config.sections.rsvp && (
            <div>
              <button
                onClick={() => document.querySelector('#rsvp')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex min-h-11 cursor-pointer items-center border border-[#f2ecdd]/45 px-8 text-[#f2ecdd] transition-colors duration-500 hover:border-[#f2ecdd] hover:bg-[#f2ecdd] hover:text-foreground"
              >
                <span className="t-eyebrow">{t('hero.cta')}</span>
              </button>
            </div>
          )}

          {/* Nét kẻ dọc thay cho mũi tên nảy lên nảy xuống. Nét chỉ rộng 1px
              nhưng vùng bấm rộng 44px - đúng cỡ đầu ngón tay. */}
          <button
            onClick={() =>
              document.querySelector('#countdown, #story')?.scrollIntoView({ behavior: 'smooth' })
            }
            aria-label={t('hero.scroll')}
            className="mx-auto mt-4 flex h-11 w-11 cursor-pointer items-end justify-center md:mt-6"
          >
            <span aria-hidden className="block h-8 w-px bg-linear-to-b from-transparent to-[#f2ecdd]/70" />
          </button>
        </RevealGroup>
      </div>
    </section>
  )
}
