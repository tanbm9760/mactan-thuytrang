import { useEffect } from 'react'

/**
 * Hoa trôi theo trang khi cuộn.
 *
 * Mỗi lớp hoa chỉ nhận MỘT con số - `--fl-scroll`, tính bằng pixel - rồi từng
 * bông tự nhân con số ấy với độ sâu riêng của mình (`--fl-depth`, suy ra từ cỡ
 * bông: bông to là bông gần, đi nhanh hơn). Nhờ vậy cả lớp chỉ tốn một phép
 * ghi mỗi khung hình mà mắt vẫn thấy nhiều tầng chiều sâu.
 *
 * Biên độ cố ý để nhỏ (nhiều nhất ±22px): đây là hoa khô rơi trên mặt giấy,
 * không phải lớp nền thị sai của một trang giới thiệu sản phẩm. Cuộn hết một
 * phần thì hoa mới xê dịch bằng đúng nửa thân một bông.
 *
 * Và biên độ tính theo CHIỀU CAO của phần chứ không phải một con số chung.
 * Phần đếm ngược chỉ cao hơn 300px, mọi khoảng trống ở đó đều hẹp; cho hoa ở
 * đó trôi ±22px như ở một phần cao 2000px thì kiểu gì cũng có lúc hoa trôi
 * vào chữ. 5% chiều cao là quãng vừa đủ thấy mà không bao giờ đủ để lấn.
 *
 * ⚠️ ĐỌC hết rồi mới GHI, và dùng CHUNG một vòng requestAnimationFrame cho
 * mọi lớp. Nếu mỗi lớp tự đo rồi tự ghi thì lần ghi này làm hỏng bố cục lần
 * đo sau, và tám lớp hoa thành tám lượt dựng lại bố cục cả trang trong mỗi
 * khung hình - đủ để cuộn trên điện thoại thấy khựng.
 */
const MAX_AMPLITUDE = 44
const HEIGHT_RATIO = 0.05

const layers = new Set()
let frame = 0

function tick() {
  frame = 0
  const viewport = window.innerHeight || 1

  const reads = []
  for (const el of layers) reads.push([el, el.getBoundingClientRect()])

  for (const [el, rect] of reads) {
    /* 0 khi lớp hoa vừa ló lên từ đáy màn hình, 1 khi nó vừa khuất khỏi đỉnh.
       Kẹp lại hai đầu để phần nằm ngoài tầm nhìn không cộng dồn thành một
       quãng dịch vô lý lúc nó quay lại. */
    const progress = (viewport - rect.top) / (viewport + rect.height)
    const clamped = Math.max(0, Math.min(1, progress))
    const amplitude = Math.min(MAX_AMPLITUDE, rect.height * HEIGHT_RATIO)
    el.style.setProperty('--fl-scroll', `${((clamped - 0.5) * amplitude).toFixed(1)}px`)
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(tick)
}

export function useFloralScroll(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    layers.add(el)
    if (layers.size === 1) {
      window.addEventListener('scroll', schedule, { passive: true })
      window.addEventListener('resize', schedule, { passive: true })
    }
    schedule()

    return () => {
      layers.delete(el)
      el.style.removeProperty('--fl-scroll')
      if (layers.size === 0) {
        window.removeEventListener('scroll', schedule)
        window.removeEventListener('resize', schedule)
        if (frame) cancelAnimationFrame(frame)
        frame = 0
      }
    }
  }, [ref])
}
