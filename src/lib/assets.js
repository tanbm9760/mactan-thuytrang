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
}

/**
 * Ảnh giữ chỗ cho story và album khi thư mục còn trống.
 *
 * Trước đây chỗ trống được lấp bằng ảnh cưới mẫu trên Unsplash - tức là ảnh
 * cưới của người khác, nằm trong thiệp của mình. Giờ là một tờ giấy da bò khổ
 * 2:3 (đúng khổ ảnh dọc của album) với đường chỉ mảnh và một mặt trời lặn trên
 * mặt hồ: nhìn là biết chỗ này đang chờ ảnh, và vẫn cùng vật liệu với thiệp.
 *
 * `label` là số thứ tự trong album. Ngoài việc cho biết thứ tự, nó làm mỗi tấm
 * có một địa chỉ riêng - album dùng địa chỉ ảnh làm khoá của React.
 */
function placeholder(label = '') {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1000' height='1500' viewBox='0 0 1000 1500'>
    <defs><linearGradient id='p' x2='0' y2='1'><stop offset='0' stop-color='#efe8d8'/><stop offset='1' stop-color='#e3d9c4'/></linearGradient></defs>
    <rect width='1000' height='1500' fill='url(#p)'/>
    <rect x='44' y='44' width='912' height='1412' fill='none' stroke='#a98a53' stroke-opacity='.3' stroke-width='2'/>
    <g fill='none' stroke='#a98a53' stroke-opacity='.6' stroke-width='5' stroke-linecap='round'>
      <path d='M430 760 A70 70 0 0 1 570 760'/>
      <path d='M380 760 H620'/>
      <path d='M445 792 H555'/>
      <path d='M470 822 H530'/>
    </g>
    ${label ? `<text x='500' y='930' text-anchor='middle' font-family='Georgia, serif' font-size='50' letter-spacing='10' fill='#7f6234' fill-opacity='.55'>${label}</text>` : ''}
  </svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const firstOr = (files, fallback) => {
  const entries = sortedEntries(files)
  return entries.length ? entries[0][1] : fallback
}

export const heroImage = firstOr(heroFiles, FALLBACK.hero)
export const storyImage = firstOr(storyFiles, placeholder())

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
        photos: Array.from({ length: 6 }, (_, i) => ({
          src: placeholder(String(i + 1).padStart(2, '0')),
          alt: `Ảnh ${i + 1}`,
        })),
      },
    ]
  }

  const grouped = new Map()
  for (const [path, src] of entries) {
    const rest = path.replace('../assets/gallery/', '')
    const key = rest.includes('/') ? rest.slice(0, rest.indexOf('/')) : 'default'
    if (!grouped.has(key)) grouped.set(key, [])
    /* Lời mô tả cho trình đọc màn hình. Lấy theo số thứ tự chứ không lấy tên
       file: tên file là mã máy ảnh (NDL09189), đọc lên chẳng ai hiểu gì. */
    grouped.get(key).push({ src, alt: `Ảnh cưới ${grouped.get(key).length + 1}` })
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
