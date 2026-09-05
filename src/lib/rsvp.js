import { config } from '../config'

/**
 * Gửi phản hồi RSVP tới Google Apps Script Web App.
 *
 * Dùng Content-Type "text/plain" một cách có chủ đích: đây là "simple request"
 * nên trình duyệt không gửi preflight OPTIONS - thứ mà Apps Script không xử lý
 * được. Phía Apps Script vẫn đọc được JSON qua e.postData.contents.
 */
export async function submitRsvp(payload) {
  const endpoint = config.rsvp.endpoint?.trim()

  if (!endpoint) {
    return { ok: false, reason: 'not-configured' }
  }

  /* URL kết thúc bằng /dev là bản thử nghiệm của Apps Script: chỉ chạy khi
     chính chủ script đang đăng nhập. Khách mở lên sẽ bị Google đòi đăng nhập
     và phản hồi mất trắng. Bắt lỗi ngay từ đây thay vì để khách gặp. */
  if (/\/dev\/?$/.test(endpoint)) {
    return { ok: false, reason: 'dev-url' }
  }

  const body = JSON.stringify({ ...payload, submittedAt: new Date().toISOString() })

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body,
      redirect: 'follow',
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return { ok: true }
  } catch {
    /* Cố tình KHÔNG thử lại bằng mode:'no-cors'.
       Kiểu gửi đó không đọc được phản hồi, nên nếu endpoint sai thì ta vẫn báo
       "cảm ơn bạn" trong khi phản hồi rơi vào hư không - với thiệp cưới thì
       đó là mất trắng danh sách khách, tệ hơn nhiều so với một thông báo lỗi
       nhìn thấy được. Thà để khách biết mà gọi điện. */
    return { ok: false, reason: 'network' }
  }
}
