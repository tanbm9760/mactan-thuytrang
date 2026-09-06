import { useLanguage } from '../lib/i18n'
import { config, orderedNames } from '../config'
import { heroImage } from '../lib/assets'
import { useParallax } from '../hooks/useParallax'
import { RevealGroup } from './Reveal'
import Florals from './Florals'

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
 *
 * ══ Vì sao mọi cỡ chữ ở đây tính theo svh chứ không theo px ══
 *
 * Đo trên chính file ảnh: bóng bàn tay bắt đầu ở đúng 30% chiều cao ảnh, và
 * vì ảnh luôn được cắt theo chiều cao (khung đứng bao giờ cũng hẹp hơn ảnh),
 * 30% ấy rơi vào một TỈ LỆ cố định của khung hero - khoảng 28% - dù màn hình
 * cao bao nhiêu. Nghĩa là dải trời sạch tính bằng pixel co lại theo màn hình:
 * 236px trên máy cao 844, nhưng chỉ 197px trên máy 703 (iPhone có thanh địa
 * chỉ Safari chiếm chỗ).
 *
 * Khối chữ trước đây đặt bằng px nên nó KHÔNG co theo, và trên máy thấp thì
 * tràn xuống đè lên tay. Giờ mọi cỡ chữ và mọi khoảng cách ở đây đều bị chặn
 * trên bởi svh, nên khối chữ luôn nằm gọn trong dải trời.
 */
export default function Hero() {
  const { t } = useLanguage()
  const { wrapRef, imgRef } = useParallax(6)
  const date = config.weddingDate

  /* Tên trải một dòng khi khung nhìn thấp hoặc rộng; xếp chồng khi khung cao.
     Hai dòng chồng nhau chiếm gấp đôi chiều cao mà dải trời thì không đủ.

     Trên máy thấp, khối tên còn được đẩy xuống sâu hơn (`squat:pt-…`): dải
     trời ở đó hẹp, nếu cứ dùng chung một khoảng đệm với máy cao thì tên dính
     ngay dưới thanh nav và đọc ra như một dòng chú thích chứ không phải tiêu
     đề. Đẩy xuống cho nó nằm giữa khoảng trời, giữa thanh nav và hai bàn tay. */
  const nameSize =
    'text-[clamp(1.75rem,min(10.5vw,7svh),3.9rem)] ' +
    'squat:text-[clamp(1.35rem,min(8.4vw,8.6svh),2.9rem)] ' +
    'md:text-[clamp(3rem,4.9vw,5rem)]'

  return (
    <section
      id="top"
      ref={wrapRef}
      className="relative h-svh min-h-[520px] overflow-hidden bg-background"
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
      {/* Luống hoa ở chân khung - xem chú thích preset `hero` trong Florals */}
      <Florals preset="hero" />

      <div className="relative z-10 gutter pt-[clamp(4.5rem,9.5svh,7rem)] squat:pt-[clamp(5rem,13svh,8rem)]">
        {/* ── Trên trời: mực sẫm ────────────────────────────────────────── */}
        <RevealGroup step={150} className="text-center">
          <p className="t-eyebrow text-foreground/65">{t('hero.subtitle')}</p>

          {/* Hai khổ máy cắt bức ảnh ra hai bố cục khác hẳn nhau, nên tên
              cũng phải xếp khác nhau:

              Khung cao cắt dọc, hai bàn tay tụt xuống quá nửa khung - trên
              đầu còn nguyên một mảng trời cao, đủ chỗ cho tên xếp chồng.

              Khung thấp hoặc khung ngang giữ nguyên bề ngang ảnh, hai bàn tay
              vắt ngang chính giữa và dải trời sạch chỉ còn mỏng ở trên. Tên
              xếp chồng sẽ đè thẳng lên tay, nên ở đây tên trải thành MỘT dòng -
              vốn cũng là cách một trang bìa khổ ngang xử lý dòng tít của nó. */}
          <h1 className="t-display mt-[clamp(0.7rem,2.4svh,1.75rem)] text-foreground">
            <span className="flex flex-col items-center squat:flex-row squat:items-baseline squat:justify-center squat:gap-3 md:flex-row md:items-baseline md:justify-center md:gap-7">
              <span className={`whitespace-nowrap ${nameSize}`}>{orderedNames[0]}</span>
              <span className="my-[0.22em] font-serif text-[clamp(0.9rem,min(5.2vw,3.5svh),1.95rem)] text-primary italic squat:my-0 squat:text-[clamp(0.7rem,min(4.2vw,4.3svh),1.45rem)] md:my-0 md:text-[clamp(1.5rem,2.45vw,2.5rem)]">
                &amp;
              </span>
              <span className={`whitespace-nowrap ${nameSize}`}>{orderedNames[1]}</span>
            </span>
          </h1>
        </RevealGroup>
      </div>

      {/* ── Ngay dưới hai bàn tay ──────────────────────────────────────────
          Trước đây khối này bị đẩy xuống sát đáy khung, cách khối tên gần nửa
          màn hình - thành ra hai cụm chữ rời nhau với một mảng trống rất lớn
          ở giữa. Nay nó lên nằm ngay dưới hai bàn tay, khoảng trống ấy biến
          mất và cả khung hình đọc thành MỘT khối.

          Đổi luôn sang mực sẫm: chỗ này là vệt nắng sáng nhất của bức ảnh,
          chữ mực đặt lên đó tương phản rất mạnh. Nhờ vậy bỏ được hẳn lớp phủ
          tối ở chân ảnh - giờ trên bức ảnh không còn một lớp phủ nào, ráng
          chiều nguyên vẹn từ đầu đến cuối.

          Vị trí đặt theo PHẦN TRĂM chiều cao khung: ảnh luôn cắt theo chiều
          cao nên hai bàn tay bao giờ cũng kết thúc ở cùng một tỉ lệ, dù màn
          hình cao bao nhiêu. */}
      <div className="absolute inset-x-0 top-[62%] z-10 gutter text-center">
        <RevealGroup start={520} step={130} className="text-foreground">
          <p className="t-eyebrow-lg text-foreground/80">
            {pad(date.getDate())} · {pad(date.getMonth() + 1)} · {date.getFullYear()}
          </p>

          <p className="t-eyebrow mt-[clamp(0.3rem,0.8svh,0.55rem)] text-foreground/55">
            {config.venue.city}
          </p>

          {config.sections.rsvp && (
            <div className="mt-[clamp(0.9rem,2svh,1.5rem)]">
              <button
                onClick={() => document.querySelector('#rsvp')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex min-h-11 cursor-pointer items-center border border-foreground/40 px-8 text-foreground transition-colors duration-500 hover:border-foreground hover:bg-foreground hover:text-background"
              >
                <span className="t-eyebrow">{t('hero.cta')}</span>
              </button>
            </div>
          )}
        </RevealGroup>
      </div>

      {/* Nét kẻ dọc thay cho mũi tên nảy lên nảy xuống. Nét chỉ rộng 1px
          nhưng vùng bấm rộng 44px - đúng cỡ đầu ngón tay. Ẩn trên máy thấp,
          ở đó phần tiếp theo vốn đã ở rất gần rồi. */}
      <button
        onClick={() =>
          document.querySelector('#countdown, #story')?.scrollIntoView({ behavior: 'smooth' })
        }
        aria-label={t('hero.scroll')}
        className="absolute bottom-[clamp(0.75rem,2svh,1.5rem)] left-1/2 z-10 flex h-11 w-11 -translate-x-1/2 cursor-pointer items-end justify-center squat:hidden"
      >
        <span aria-hidden className="block h-8 w-px bg-linear-to-b from-transparent to-[#f2ecdd]/70" />
      </button>

    </section>
  )
}
