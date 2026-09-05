import { config } from '../config'

/**
 * Gửi phản hồi RSVP tới Google Apps Script Web App.
 *
 * Dùng Content-Type "text/plain" một cách có chủ đích: đây là "simple request"
 * nên trình duyệt không gửi preflight OPTIONS — thứ mà Apps Script không xử lý
 * được. Phía Apps Script vẫn đọc được JSON qua e.postData.contents.
 *
 * Nếu vẫn bị CORS chặn, ta gửi lại ở chế độ no-cors: yêu cầu vẫn tới nơi và
 * ghi được vào Sheet, chỉ là trình duyệt không cho đọc phản hồi.
 */
export async function submitRsvp(payload) {
  const endpoint = config.rsvp.endpoint?.trim()
  if (!endpoint) {
    return { ok: false, reason: 'not-configured' }
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
    // Kế hoạch B: gửi mù, không đọc phản hồi.
    try {
      await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body,
      })
      return { ok: true, opaque: true }
    } catch {
      return { ok: false, reason: 'network' }
    }
  }
}
