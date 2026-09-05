import { useLanguage } from '../lib/i18n'
import { bandImages } from '../lib/assets'
import { useParallax } from '../hooks/useParallax'
import { useReveal } from '../hooks/useReveal'

/**
 * Lần lật trang giữa hai chương. Đây là chỗ duy nhất trong cả thiệp mà chữ
 * dừng hẳn và chỉ còn một bức ảnh.
 *
 * Hai lỗi của bản trước được sửa ở đây:
 *
 *  1. Ảnh là ảnh DỌC (1333×2000) nhưng bị nhốt trong một dải ngang cao 46svh
 *     và cắt ở chính giữa - nghĩa là khung hình chỉ còn mặt hồ, còn cô dâu
 *     chú rể ngồi ở nửa dưới thì mất hẳn.
 *  2. Có một lớp phủ đen 75% để chữ trắng đọc được, làm chết cả sắc hoàng hôn.
 *
 * Cách dựng mới khác hẳn giữa hai khổ máy, vì một tấm ảnh dọc không thể tràn
 * viền trên màn hình ngang mà vẫn còn nguyên bố cục:
 *
 *   Khung đứng  — ảnh tràn kín màn hình, chữ đặt vào khoảng trời trống ở đỉnh.
 *   Khung ngang — ảnh thành một tấm bản in cao hết màn hình tràn ra mép phải,
 *                 nửa trái là giấy trống với câu chữ. Đúng một trang tạp chí.
 *
 * Ranh giới là TỈ LỆ khung hình chứ không phải chiều rộng (biến thể `wide`):
 * máy tính bảng dựng đứng rộng 768px vẫn phải dùng cách dựng thứ nhất.
 */
export default function PhotoBand({ index = 0 }) {
  const { t } = useLanguage()
  const { wrapRef, imgRef } = useParallax(4)
  const ref = useReveal({ threshold: 0.25 })

  const image = bandImages[index]
  const quote = t('bands')?.[index]
  if (!image) return null

  return (
    <section className="relative h-[88svh] max-h-[880px] min-h-[520px] overflow-hidden bg-sand wide:h-screen wide:max-h-none wide:min-h-[40rem]">
      <figure
        ref={wrapRef}
        className="absolute inset-0 overflow-hidden wide:left-auto wide:w-[46vw]"
      >
        <img
          ref={imgRef}
          src={image}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="parallax-img absolute inset-x-0 top-[-5%] h-[110%] w-full object-cover object-[50%_72%] wide:object-[50%_60%]"
        />
      </figure>

      {/* Chỉ trên điện thoại: một lớp giấy rất nhạt ở đỉnh để nét chữ tách khỏi
          nền trời cam. Vẫn là lớp làm SÁNG, không phải lớp phủ tối. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[40%] bg-linear-to-b from-background/80 via-background/30 to-transparent wide:hidden"
      />

      {quote && (
        <div
          ref={ref}
          className="reveal absolute inset-x-0 top-0 gutter pt-[clamp(4.75rem,13vh,7.5rem)] wide:inset-y-0 wide:right-auto wide:flex wide:w-[54vw] wide:flex-col wide:justify-center wide:pt-0 wide:pr-[clamp(2rem,6vw,7rem)]"
        >
          <span aria-hidden className="hidden h-px w-16 bg-gold wide:mb-10 wide:block" />
          <p className="t-quote mx-auto max-w-2xl text-balance text-center text-[clamp(1.4rem,4.4vw,2.5rem)] text-foreground wide:mx-0 wide:max-w-none wide:text-left wide:text-[clamp(2rem,3.4vw,3.4rem)]">
            {quote}
          </p>
        </div>
      )}
    </section>
  )
}
