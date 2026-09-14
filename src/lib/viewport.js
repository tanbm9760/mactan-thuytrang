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
 * Con số ấy cũng được ghi ra CSS thành `--screen-h`, cho những phần cao theo
 * màn hình (ảnh mở đầu, dải ảnh) - xem `--screen` trong index.css. Ở đó thì
 * cú nhảy còn nặng hơn: trong Zalo / Messenger, thanh công cụ nhả ra là cả
 * khung web co lại, `svh` co theo, và đo được hai phần ấy ngắn đi tổng cộng
 * 150px. Mọi thứ bên dưới nhảy lên đúng ngần ấy - lúc đang cuộn LÊN, vì cuộn
 * xuống thì thanh công cụ chỉ thu vào một lần ở đầu trang rồi thôi.
 *
 * Nên: đo một lần, và CHỈ đo lại khi bề ngang đổi - xoay máy, hoặc kéo cửa sổ
 * trên máy tính. Riêng máy tính thì đổi chiều cao cửa sổ cũng đo lại.
 *
 * Trên máy cảm ứng, bề cao đổi mà bề ngang giữ nguyên thì chỉ có hai khả
 * năng: thanh công cụ trượt ra vào, hoặc bàn phím bật lên lúc khách gõ lời
 * chúc. Cả hai đều tạm thời, nên bỏ qua hẳn. (Trước đây còn đo lại nếu cửa
 * sổ đổi cỡ lúc không cuộn - nhưng bàn phím đúng là bật lên lúc không cuộn,
 * và ảnh mở đầu co lại cả nửa màn hình ngay giữa lúc khách đang gõ.)
 *
 * Con số lệch vài chục pixel so với thực tế - không ai nhận ra - đổi lại là
 * không còn cú giật nào.
 */
let height = 0
let width = 0

function measure() {
  /* Có trình duyệt trong app báo 0 ở khoảnh khắc đầu tiên. Khi đó để trống,
     CSS lùi về `100svh`, và lần đổi cỡ đầu tiên (bề ngang khác 0) sẽ đo lại. */
  if (!window.innerHeight) return
  height = window.innerHeight
  width = window.innerWidth
  document.documentElement.style.setProperty('--screen-h', `${height}px`)
}

if (typeof window !== 'undefined') {
  const touch = window.matchMedia('(pointer: coarse)')
  measure()
  window.addEventListener(
    'resize',
    () => {
      if (window.innerWidth !== width || !touch.matches) measure()
    },
    { passive: true },
  )
  window.addEventListener('orientationchange', () => setTimeout(measure, 300), { passive: true })
}

export function viewportHeight() {
  return height || window.innerHeight || 1
}
