import { useEffect, useRef } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Hiện dần khi cuộn tới. Gắn ref lên phần tử có class "reveal" hoặc "reveal-img".
 *
 * `delay` (ms) dùng để xếp tầng nhiều phần tử trong cùng một cảnh: dòng chữ thứ
 * hai chờ dòng đầu một nhịp rồi mới hiện. Đây là thứ tạo cảm giác có nhịp điệu
 * thay vì cả khối bật lên cùng lúc.
 */
export function useReveal({ threshold = 0.15, once = true, delay = 0 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`)

    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
      el.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            entry.target.classList.remove('is-visible')
          }
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once, delay])

  return ref
}
