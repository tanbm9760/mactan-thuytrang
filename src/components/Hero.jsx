import { useLanguage } from '../lib/i18n'
import { config, orderedNames } from '../config'
import { heroImage } from '../lib/assets'
import { useParallax } from '../hooks/useParallax'
import { local } from '../lib/local'
import { RevealGroup } from './Reveal'
import Florals from './Florals'

/**
 * Màn hình mở đầu, dựng theo đúng trang mẫu:
 *
 *   một khối duy nhất, canh giữa cả chiều ngang lẫn chiều dọc
 *   chữ nhỏ → tên (hai dòng) → ngày kẹp giữa hai nét kẻ → nơi chốn → nút đặc
 *
 * Chữ Playfair Display cho tên và ngày, Montserrat cho các dòng chữ hoa.
 *
 * Ba chỗ khác trang mẫu, đều vì bức ảnh của mình có chủ thể cần giữ:
 *
 *   - Dải trời nối thêm 21% ở đỉnh, đẩy hai bàn tay xuống sâu để tên nằm
 *     trọn trên nền trời sạch.
 *   - Nút xác nhận để nền trong suốt, chỉ còn một nét viền. Nút nền trắng
 *     đặc của trang mẫu là một khối kín che mất phần ảnh nó nằm lên.
 *   - Chữ dùng mực sẫm chứ không dùng chữ trắng. Đo được: nền dưới nét chữ
 *     ở đây sáng 160-168, chữ trắng đặt lên chỉ đạt 2,5:1 - dưới xa ngưỡng
 *     đọc được, mà muốn cứu thì phải phủ tối rất dày và mất cả ráng chiều.
 *     Trang mẫu dùng được chữ trắng vì ảnh của họ là một khung tối. Đổi sang
 *     mực sẫm thì đạt 11:1 và KHÔNG cần phủ gì lên ảnh cả.
 *   - Khối chữ không canh giữa khung mà đặt theo phần trăm, chỉnh riêng cho
 *     khổ đứng và khổ ngang - hai khổ cắt bức ảnh ra hai bố cục khác nhau.
 */
export default function Hero() {
  const { t, language } = useLanguage()
  const { wrapRef, imgRef } = useParallax(1.5)
  const dateStr = t('details.dateFormat')(config.weddingDate)

  return (
    <section
      id="top"
      ref={wrapRef}
      className="relative h-svh min-h-[520px] overflow-hidden bg-background"
    >
      {/* ══ Dải trời nối thêm ở đỉnh khung ══

          Không cắt ảnh, không phóng ảnh - chỉ đẩy cả bức ảnh xuống 24% rồi
          nối tiếp bầu trời vào chỗ vừa trống ra. Nhờ vậy hai bàn tay tụt
          xuống mà vẫn giữ NGUYÊN kích thước; phóng ảnh thì tay xuống được
          nhưng lại to nhỏ theo, còn cách này thì không.

          Phần nối là CHÍNH BỨC ẢNH ẤY, lật ngược lên.

          Trước đây nó là một dải chuyển sắc vẽ tay, màu lấy xấp xỉ mép trên
          bức ảnh. Nhưng mép trên không cùng một màu ở mọi khổ máy (khung
          ngang cắt gần hết bề ngang thì ra #F9E3C1, khung đứng chỉ thấy dải
          giữa thì ra #FDE9C8), nên dù có thêm đoạn tan dần thì vẫn là xấp xỉ.

          Lật ngược thì không còn xấp xỉ nữa: bản lật dùng ĐÚNG khung ảnh và
          đúng cách cắt của ảnh thật, chỉ khác là úp ngược, nên hàng pixel
          nằm sát mối nối của hai bên là CÙNG MỘT hàng pixel - trùng khít ở
          mọi khổ máy, không thể lộ đường nối. Phần lật lên chỉ lấy tới 20%
          đầu bức ảnh, mà 28% đầu thì toàn trời, nên không có bàn tay nào
          hiện ngược cả.

          Hai lớp nằm chung một khung để cùng ăn một phép trôi - tách ra thì
          lúc cuộn chúng trượt lệch nhau và mối nối hở ra. */}
      <div ref={imgRef} className="parallax-img hero-zoom absolute inset-0">
        <img
          src={heroImage}
          alt=""
          aria-hidden
          className="absolute inset-x-0 bottom-[76%] h-[120%] w-full -scale-y-100 object-cover object-[50%_50%]"
        />
        <img
          src={heroImage}
          alt=""
          aria-hidden
          fetchPriority="high"
          className="absolute inset-x-0 top-[24%] h-[120%] w-full object-cover object-[50%_50%]"
        />
      </div>

      {/* Hoa rải ở dải trời và hai bên lề khối chữ. Đặt SAU thẻ ảnh trong
          DOM để nằm trên ảnh, nhưng khối chữ có z-10 nên vẫn nằm trên hoa. */}
      <Florals preset="hero" />

      <div className="absolute inset-x-0 top-[15%] z-10 gutter text-center text-foreground md:top-[11%]">
        <RevealGroup step={140}>
          <p className="t-hero-eyebrow text-[clamp(0.7rem,3.1vw,1rem)] text-foreground/70">
            {t('hero.subtitle')}
          </p>

          <h1 className="t-hero-name mt-[clamp(0.6rem,1.8svh,1.5rem)] text-[clamp(2.5rem,14.5vw,3.75rem)] md:text-[clamp(3.5rem,7.4vw,6.75rem)]">
            <span className="block">{orderedNames[0]} &amp;</span>
            <span className="block">{orderedNames[1]}</span>
          </h1>

          <div className="mt-[clamp(0.7rem,2.2svh,1.6rem)] flex items-center justify-center gap-5 md:gap-7">
            <span aria-hidden className="h-px w-10 bg-foreground/30 md:w-20" />
            <p className="t-hero-date text-[clamp(1.1rem,4.3vw,1.5rem)] whitespace-nowrap">
              {dateStr}
            </p>
            <span aria-hidden className="h-px w-10 bg-foreground/30 md:w-20" />
          </div>

          <p className="t-hero-city mt-[clamp(0.7rem,1.9svh,1.4rem)] text-[clamp(0.8rem,3.4vw,1.125rem)] text-foreground/60">
            {local(config.venue, 'city', language)}
          </p>

          {config.sections.rsvp && (
            <div className="mt-[clamp(1.1rem,3svh,2.25rem)]">
              <button
                onClick={() => document.querySelector('#rsvp')?.scrollIntoView({ behavior: 'smooth' })}
                className="t-hero-btn inline-flex h-[clamp(2.9rem,6svh,4rem)] cursor-pointer items-center border border-foreground/45 px-9 text-[clamp(0.72rem,2.9vw,0.875rem)] text-foreground transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background md:px-12"
              >
                {t('hero.cta')}
              </button>
            </div>
          )}
        </RevealGroup>
      </div>
    </section>
  )
}
