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
     Hai dòng chồng nhau chiếm gấp đôi chiều cao mà dải trời thì không đủ. */
  const nameSize =
    'text-[clamp(1.9rem,min(11.5vw,7.4svh),4.25rem)] ' +
    'squat:text-[clamp(1.5rem,min(9.6vw,10svh),3.25rem)] ' +
    'md:text-[clamp(3.5rem,5.6vw,5.75rem)]'

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
      {/* Nền cho chữ ngà ở chân ảnh.

          Dãy đồi vốn đã gần như đen, nhưng ngay trên nó là vệt nắng vàng rực -
          mà chỗ đó nông sâu bao nhiêu thì tuỳ chiều cao màn hình. Nên lớp này
          phải đủ dày để chữ bám được ở cả máy cao lẫn máy thấp. Nó chỉ chạm
          vào 44% dưới cùng và tắt hẳn trước khi tới hai bàn tay: ráng chiều ở
          giữa khung hình không bị đụng tới. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[44%] bg-[linear-gradient(to_top,rgb(20_18_12/0.74)_0%,rgb(20_18_12/0.58)_24%,rgb(20_18_12/0.30)_52%,rgb(20_18_12/0.10)_76%,transparent_100%)]"
      />

      <div className="relative z-10 flex h-full flex-col justify-between gutter pt-[clamp(4.5rem,9.5svh,7rem)] pb-[clamp(0.9rem,2.6svh,3rem)]">
        {/* ── Trên trời: mực sẫm ────────────────────────────────────────── */}
        <RevealGroup step={150} className="text-center">
          <p className="t-eyebrow text-foreground/65">{t('hero.subtitle')}</p>

          <h1 className="t-display mt-[clamp(0.6rem,1.9svh,1.75rem)] text-foreground">
            <span className="flex flex-col items-center squat:flex-row squat:items-baseline squat:justify-center squat:gap-4 md:flex-row md:items-baseline md:justify-center md:gap-7">
              <span className={`whitespace-nowrap ${nameSize}`}>{orderedNames[0]}</span>
              <span className="my-[0.22em] font-serif text-[min(3.4vw,0.9rem)] text-primary italic squat:my-0 md:my-0 md:text-[1.5rem]">
                &amp;
              </span>
              <span className={`whitespace-nowrap ${nameSize}`}>{orderedNames[1]}</span>
            </span>
          </h1>

        </RevealGroup>

        {/* ── Dưới đồi: chữ ngà ─────────────────────────────────────────── */}
        {/* Trên trời chỉ còn đúng hai thứ: dòng chữ nhỏ và tên. Ngày cưới và
            nơi chốn xuống nằm ngay trên nút xác nhận - vừa gom hết thông tin
            "khi nào, ở đâu, bấm vào đâu" vào một chỗ, vừa nhường lại cho tên
            cả dải trời. */}
        <RevealGroup start={560} step={130} className="text-center text-[#f2ecdd]">
          <p className="t-eyebrow-lg on-photo">
            {pad(date.getDate())} · {pad(date.getMonth() + 1)} · {date.getFullYear()}
          </p>

          <p className="t-eyebrow on-photo mt-[clamp(0.4rem,1.1svh,0.75rem)] text-[#f2ecdd]/80">
            {config.venue.city}
          </p>

          {config.sections.rsvp && (
            <div className="mt-[clamp(1rem,2.6svh,1.75rem)]">
              <button
                onClick={() => document.querySelector('#rsvp')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex min-h-11 cursor-pointer items-center border border-[#f2ecdd]/45 px-8 text-[#f2ecdd] transition-colors duration-500 hover:border-[#f2ecdd] hover:bg-[#f2ecdd] hover:text-foreground"
              >
                <span className="t-eyebrow">{t('hero.cta')}</span>
              </button>
            </div>
          )}

          {/* Nét kẻ dọc thay cho mũi tên nảy lên nảy xuống. Nét chỉ rộng 1px
              nhưng vùng bấm rộng 44px - đúng cỡ đầu ngón tay.

              Ẩn đi trên máy thấp: ở đó cả khối chữ dưới bị đẩy lên khỏi dãy
              đồi tối và trôi vào vệt nắng, chữ ngà không còn bám được. Bỏ nét
              này lấy lại 48px, đủ để ngày cưới và nơi chốn tụt xuống nằm trên
              nền tối. Trên máy thấp thì phần tiếp theo vốn cũng đã ở rất gần
              rồi, không cần ai nhắc cuộn tiếp. */}
          <button
            onClick={() =>
              document.querySelector('#countdown, #story')?.scrollIntoView({ behavior: 'smooth' })
            }
            aria-label={t('hero.scroll')}
            className="mx-auto mt-2 flex h-11 w-11 cursor-pointer items-end justify-center squat:hidden md:mt-5"
          >
            <span aria-hidden className="block h-8 w-px bg-linear-to-b from-transparent to-[#f2ecdd]/70" />
          </button>
        </RevealGroup>
      </div>
    </section>
  )
}
