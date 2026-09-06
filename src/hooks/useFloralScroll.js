import { useEffect } from 'react'
import { viewportHeight } from '../lib/viewport'

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
 * Ba điều giữ cho nó không làm nặng lúc cuộn - cả ba đều cần, thiếu một là
 * trên điện thoại thấy khựng ngay:
 *
 *   1. Dùng CHUNG một vòng requestAnimationFrame cho mọi lớp.
 *   2. ĐỌC hết vị trí rồi mới GHI. Mỗi lớp tự đo rồi tự ghi thì lần ghi này
 *      làm hỏng bố cục của lần đo sau, và tám lớp hoa thành tám lượt dựng lại
 *      bố cục cả trang trong mỗi khung hình.
 *   3. Chỉ tính những lớp ĐANG Ở GẦN TẦM NHÌN. Cả trang có tám lớp hoa nhưng
 *      lúc nào cũng chỉ một hai lớp nhìn thấy được; bảy lớp còn lại không cần
 *      đo, mà đo thì vẫn tốn đúng một lượt dựng lại bố cục như nhau.
 *
 * Và chiều cao khung nhìn lấy từ lib/viewport: đọc thẳng `innerHeight` thì mỗi
 * lần thanh địa chỉ của Messenger trượt đi là cả đàn hoa nhảy một cái.
 */
const MAX_AMPLITUDE = 44
const HEIGHT_RATIO = 0.05

/* Máy nhỏ thì biên độ còn 65%. Cùng một quãng trôi, trên khung hẹp mắt bắt
   được rõ hơn nhiều so với trên máy tính - hoa hoá ra "chạy" chứ không còn
   "trôi". Cùng lý do mà ảnh mở đầu cũng giảm biên độ trên máy nhỏ. */
const NARROW = 700
const narrowScale = () => (window.innerWidth < NARROW ? 0.65 : 1)

const layers = new Set()
const nearby = new Set()
let frame = 0
let watcher = null

function tick() {
  frame = 0
  const viewport = viewportHeight()
  const scale = narrowScale()

  const reads = []
  for (const el of nearby) reads.push([el, el.getBoundingClientRect()])

  for (const [el, rect] of reads) {
    /* 0 khi lớp hoa vừa ló lên từ đáy màn hình, 1 khi nó vừa khuất khỏi đỉnh.
       Kẹp lại hai đầu để phần nằm ngoài tầm nhìn không cộng dồn thành một
       quãng dịch vô lý lúc nó quay lại. */
    const progress = (viewport - rect.top) / (viewport + rect.height)
    const clamped = Math.max(0, Math.min(1, progress))
    const amplitude = Math.min(MAX_AMPLITUDE, rect.height * HEIGHT_RATIO) * scale
    el.style.setProperty('--fl-scroll', `${((clamped - 0.5) * amplitude).toFixed(1)}px`)
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(tick)
}

/* Một observer chung, đánh dấu lớp nào đang ở gần tầm nhìn. Nới thêm 25% ra
   hai đầu để lớp hoa được tính xong trước khi nó thật sự ló vào màn hình. */
function watchdog() {
  if (watcher) return watcher
  watcher = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) nearby.add(entry.target)
        else nearby.delete(entry.target)
      }
      schedule()
    },
    { rootMargin: '25% 0px' },
  )
  return watcher
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
    watchdog().observe(el)
    schedule()

    return () => {
      layers.delete(el)
      nearby.delete(el)
      watcher?.unobserve(el)
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
