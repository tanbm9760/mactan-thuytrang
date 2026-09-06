/**
 * Chiều cao khung nhìn, ĐỨNG YÊN.
 *
 * Trình duyệt trong Messenger / Zalo / Safari di động co thanh địa chỉ lại khi
 * cuộn xuống và nhả ra khi cuộn lên. Mỗi lần như vậy `window.innerHeight` nhảy
 * 60-120px NGAY GIỮA LÚC ĐANG CUỘN. Hiệu ứng nào chia cho chiều cao ấy - ảnh
 * trôi chậm ở màn hình mở đầu, hoa trôi theo trang - đều nhảy theo đúng một
 * nhịp, và người xem thấy cả trang giật một cái đúng lúc thanh địa chỉ trượt
 * đi. Đó là cảm giác "giật giật" khi kéo lên kéo xuống, không phải do máy yếu.
 *
 * Nên: đo một lần, và CHỈ đo lại khi thật sự có chuyện -
 *   - bề ngang đổi: xoay máy, hoặc đổi cỡ cửa sổ trên máy tính;
 *   - cửa sổ đổi cỡ trong lúc KHÔNG cuộn: kéo mép cửa sổ trên máy tính.
 *
 * Thanh địa chỉ trượt vào trượt ra thì luôn xảy ra giữa lúc cuộn và không đổi
 * bề ngang, nên rơi trọn vào trường hợp bị bỏ qua. Con số dùng để tính hiệu
 * ứng lệch đi vài chục pixel so với thực tế - không ai nhận ra - đổi lại là
 * không còn cú giật nào.
 */
let height = 0
let width = 0
let lastScroll = 0

function measure() {
  height = window.innerHeight || 1
  width = window.innerWidth
}

function onResize() {
  if (window.innerWidth !== width) return measure()
  if (Date.now() - lastScroll > 500) measure()
}

if (typeof window !== 'undefined') {
  measure()
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('orientationchange', () => setTimeout(measure, 300), { passive: true })
  window.addEventListener(
    'scroll',
    () => {
      lastScroll = Date.now()
    },
    { passive: true },
  )
}

export function viewportHeight() {
  return height || window.innerHeight || 1
}
