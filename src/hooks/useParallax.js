import { useEffect, useRef } from 'react'
import { viewportHeight } from '../lib/viewport'

/**
 * Ảnh trôi chậm hơn trang khi cuộn. Phần tử bọc ngoài phải có overflow-hidden,
 * còn ảnh bên trong phải cao hơn khung đúng bằng `strength * 2` phần trăm thì
 * mới không hở mép ở hai đầu.
 *
 * Vì sao tự viết thay vì dùng thư viện: chỉ đụng tới `transform`, đọc vị trí
 * trong một vòng requestAnimationFrame duy nhất, và ngừng hẳn khi ảnh ra khỏi
 * màn hình — nên không làm giật khi cuộn trên điện thoại.
 *
 * @param {number} strength phần trăm chiều cao khung mà ảnh được phép trôi
 */
export function useParallax(strength = 12) {
  const wrapRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const img = imgRef.current
    if (!wrap || !img) return

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    let visible = false
    let frame = 0
    // Màn hình nhỏ thì biên độ trôi giảm còn 60%: khung hình hẹp nên cùng một
    // biên độ sẽ thấy "lắc" rõ hơn nhiều so với trên máy tính.
    const amount = window.innerWidth < 768 ? strength * 0.6 : strength

    const update = () => {
      frame = 0
      const rect = wrap.getBoundingClientRect()
      /* Không đọc `innerHeight` ở đây: trong trình duyệt của Messenger, thanh
         địa chỉ co lại giữa lúc cuộn làm con số ấy nhảy 60-120px, và bức ảnh
         giật đúng một cái theo. Xem lib/viewport. */
      const viewport = viewportHeight()

      // -1 khi khung vừa chạm đáy màn hình, +1 khi vừa rời khỏi đỉnh
      const progress = (rect.top + rect.height / 2 - viewport / 2) / (viewport / 2 + rect.height / 2)
      const clamped = Math.max(-1, Math.min(1, progress))

      img.style.transform = `translate3d(0, ${(clamped * amount).toFixed(2)}%, 0)`
    }

    const onScroll = () => {
      if (!visible || frame) return
      frame = requestAnimationFrame(update)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) update()
      },
      { threshold: 0 },
    )
    observer.observe(wrap)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [strength])

  return { wrapRef, imgRef }
}
