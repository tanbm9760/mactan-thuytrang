import { useLanguage } from '../lib/i18n'
import { bandImages } from '../lib/assets'
import { useReveal } from '../hooks/useReveal'

/**
 * Dải ảnh tràn viền xen giữa các phần. Nhiệm vụ của nó là phá cái nhịp
 * "section trắng – section cát – section trắng" cứ lặp đi lặp lại, và cho mắt
 * người đọc một quãng nghỉ giữa hai khối chữ.
 *
 * `index` chọn ảnh trong src/assets/band/ theo thứ tự tên file.
 */
export default function PhotoBand({ index = 0 }) {
  const { t } = useLanguage()
  const ref = useReveal({ threshold: 0.05 })

  const image = bandImages[index]
  const quote = t('bands')?.[index]
  if (!image) return null

  return (
    <section className="relative h-[46svh] max-h-[620px] min-h-[280px] w-full overflow-hidden md:h-[65vh] md:min-h-[380px]">
      <img
        src={image}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Phủ tối từ dưới lên: chữ luôn nằm trên vùng đậm nhất của ảnh */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-tr from-black/75 via-black/30 to-black/5"
      />
      {/* Canh trái, không canh giữa: ở cả hai ảnh dải, cặp đôi đều nằm giữa
          khung nên chữ canh giữa sẽ đè lên người. Canh trái vừa tránh được
          chủ thể vừa phá thế đối xứng đang lặp ở các phần khác. */}
      {quote && (
        <div ref={ref} className="reveal absolute inset-x-0 bottom-0 px-6 pb-10 md:px-12 md:pb-14">
          <p className="max-w-md font-serif text-xl leading-snug text-white drop-shadow-md md:max-w-lg md:text-3xl">
            {quote}
          </p>
        </div>
      )}
    </section>
  )
}
