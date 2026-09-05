import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Nhận biết thao tác "giữ" (nhấn và giữ) tách bạch với "chạm" và "vuốt".
 *
 * Ba điều phải xử lý đúng, nếu không sẽ phá trải nghiệm trên điện thoại:
 *  1. Vuốt để lướt album cũng bắt đầu bằng một cú chạm - nên nếu ngón tay
 *     nhích quá vài pixel thì huỷ, đó là vuốt chứ không phải giữ.
 *  2. Sau khi giữ, lúc nhả tay KHÔNG được mở ảnh lớn - giữ và chạm là hai
 *     thao tác khác nhau.
 *  3. Giữ lâu trên ảnh làm trình duyệt di động bật menu "lưu ảnh" - phải chặn.
 */
export function usePressHold({ delay = 170, moveTolerance = 10 } = {}) {
  const [held, setHeld] = useState(false)
  const timer = useRef(0)
  const origin = useRef(null)
  const didHold = useRef(false)

  const stop = useCallback(() => {
    clearTimeout(timer.current)
    timer.current = 0
    origin.current = null
    setHeld(false)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  const handlers = {
    onPointerDown: (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      origin.current = { x: e.clientX, y: e.clientY }
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        didHold.current = true
        setHeld(true)
      }, delay)
    },
    onPointerMove: (e) => {
      if (!origin.current) return
      const moved =
        Math.abs(e.clientX - origin.current.x) > moveTolerance ||
        Math.abs(e.clientY - origin.current.y) > moveTolerance
      if (moved) {
        didHold.current = false
        stop()
      }
    },
    onPointerUp: stop,
    onPointerCancel: () => {
      didHold.current = false
      stop()
    },
    onPointerLeave: stop,
    onContextMenu: (e) => {
      if (didHold.current) e.preventDefault()
    },
  }

  /** Gọi trong onClick: trả về true nếu cú nhấn vừa rồi là "giữ", không phải "chạm" */
  const consumeHold = useCallback(() => {
    const was = didHold.current
    didHold.current = false
    return was
  }, [])

  return { held, handlers, consumeHold }
}
