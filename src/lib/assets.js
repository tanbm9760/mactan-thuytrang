/* ============================================================================
 *  Tự động nạp ảnh từ src/assets/. Bạn chỉ cần bỏ file ảnh vào thư mục,
 *  không phải import hay khai báo gì thêm.
 *
 *    src/assets/hero/     → ảnh nền màn hình đầu tiên (lấy file đầu tiên)
 *    src/assets/story/    → ảnh ở phần "Chuyện của chúng mình"
 *    src/assets/gallery/  → ảnh album. Có thể chia thư mục con để tạo nhiều album.
 *    src/assets/qr/       → ảnh QR, tên file chứa "groom" hoặc "bride"
 *    src/assets/music/    → nhạc nền (mp3)
 * ========================================================================== */

import { config } from '../config'

/* import.meta.glob yêu cầu cả đường dẫn lẫn tuỳ chọn phải viết thẳng tại chỗ,
   nên không tách được thành biến dùng chung. Phần mở rộng ảnh được hỗ trợ:
   jpg / jpeg / png / webp / avif (không phân biệt hoa thường). */

const heroFiles = import.meta.glob(
  '../assets/hero/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,avif,AVIF}',
  { eager: true, query: '?url', import: 'default' },
)
const storyFiles = import.meta.glob(
  '../assets/story/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,avif,AVIF}',
  { eager: true, query: '?url', import: 'default' },
)
const galleryFiles = import.meta.glob(
  '../assets/gallery/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,avif,AVIF}',
  { eager: true, query: '?url', import: 'default' },
)
const bandFiles = import.meta.glob(
  '../assets/band/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,avif,AVIF}',
  { eager: true, query: '?url', import: 'default' },
)
const qrFiles = import.meta.glob(
  '../assets/qr/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,avif,AVIF}',
  { eager: true, query: '?url', import: 'default' },
)
const musicFiles = import.meta.glob('../assets/music/**/*.{mp3,MP3,m4a,M4A,ogg,OGG}', {
  eager: true,
  query: '?url',
  import: 'default',
})

/** Sắp xếp theo tên file để thứ tự ảnh ổn định giữa các lần build */
const sortedEntries = (files) =>
  Object.entries(files).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))

/* --- Ảnh dự phòng khi thư mục còn trống, để trang vẫn chạy được ngay ------- */
const FALLBACK = {
  hero: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2400&auto=format&fit=crop',
  story:
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop',
  gallery: [
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop',
  ],
}

const firstOr = (files, fallback) => {
  const entries = sortedEntries(files)
  return entries.length ? entries[0][1] : fallback
}

export const heroImage = firstOr(heroFiles, FALLBACK.hero)
export const storyImage = firstOr(storyFiles, firstOr(heroFiles, FALLBACK.hero))

/**
 * Album ảnh. Ảnh trong thư mục con → mỗi thư mục là một album;
 * ảnh để thẳng trong gallery/ → gộp vào album "default".
 * @returns {{ key: string, photos: {src: string, alt: string}[] }[]}
 */
export const galleryAlbums = (() => {
  const entries = sortedEntries(galleryFiles)

  if (entries.length === 0) {
    return [
      {
        key: 'default',
        photos: FALLBACK.gallery.map((src, i) => ({ src, alt: `Ảnh cưới ${i + 1}` })),
      },
    ]
  }

  const grouped = new Map()
  for (const [path, src] of entries) {
    const rest = path.replace('../assets/gallery/', '')
    const key = rest.includes('/') ? rest.slice(0, rest.indexOf('/')) : 'default'
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key).push({ src, alt: rest.split('/').pop().replace(/\.[^.]+$/, '') })
  }

  // Thứ tự album = thứ tự bạn khai trong config.albums; album lạ xếp cuối
  const order = Object.keys(config.albums ?? {})
  const rank = (key) => {
    const i = order.indexOf(key)
    return i === -1 ? order.length : i
  }

  return [...grouped.entries()]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([key, photos]) => ({ key, photos }))
})()

const findQr = (keyword) => {
  const hit = sortedEntries(qrFiles).find(([path]) => path.toLowerCase().includes(keyword))
  return hit ? hit[1] : null
}

export const qrGroom = findQr('groom') ?? findQr('trai')
export const qrBride = findQr('bride') ?? findQr('gai')
export const musicTrack = firstOr(musicFiles, null)

/** Ảnh cho các dải tràn viền, theo thứ tự tên file (01-…, 02-…) */
export const bandImages = sortedEntries(bandFiles).map(([, src]) => src)
