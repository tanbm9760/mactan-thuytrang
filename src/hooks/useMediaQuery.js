import { useEffect, useState } from 'react'

/**
 * Theo dõi một media query. Cần dùng khi bố cục JS phải biết đang ở khổ nào -
 * ví dụ album mở hai trang trên máy tính nhưng một trang trên điện thoại, nên
 * số ảnh mỗi trang phải quyết định từ trong JS chứ không thể bằng CSS.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
