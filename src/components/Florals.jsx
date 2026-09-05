/**
 * Hoa nhỏ rải rác, lấy tinh thần từ tấm thiệp in: những bông hoa màu nước bé
 * xíu nằm thưa ở lề giấy.
 *
 * Vẽ hoàn toàn bằng SVG, không dùng file ảnh - nhờ vậy hoa nét ở mọi độ phân
 * giải và không thêm một byte nào vào phần ảnh phải tải.
 */

/* Màu lấy từ thiệp in: vàng bơ, xanh lam, tím oải hương, hồng phấn, cam đào */
const HUES = {
  vang: ['#F7DE9C', '#EFC65F', '#D9A83F'],
  lam: ['#C6D7EE', '#9DBBE0', '#7C9FCF'],
  tim: ['#D6C2E5', '#B99AD2', '#9E7BBE'],
  hong: ['#F4C6CE', '#E8A0AE', '#D67D8F'],
  cam: ['#F7CDAE', '#EFA87C', '#E08A57'],
}

/**
 * Chuyển sắc trong từng cánh: nhạt ở rìa, đậm dần vào tâm - đây là thứ khiến
 * bông hoa trông như vẽ màu nước chứ không phải hình vector phẳng.
 */
function PetalGradient({ id, light, mid }) {
  return (
    <defs>
      <radialGradient id={id} cx="50%" cy="78%" r="72%">
        <stop offset="0%" stopColor={mid} />
        <stop offset="55%" stopColor={mid} stopOpacity="0.85" />
        <stop offset="100%" stopColor={light} stopOpacity="0.7" />
      </radialGradient>
    </defs>
  )
}

/** Bông sáu cánh, dáng cúc chuồn - loại xuất hiện nhiều nhất trên thiệp in */
function BlossomA({ hue, uid }) {
  const [light, mid, deep] = HUES[hue]
  const g = `fg-${uid}`
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full">
      <PetalGradient id={g} light={light} mid={mid} />
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <ellipse
          key={deg}
          cx="20"
          /* mỗi cánh lệch nhau một chút cho ra vẻ vẽ tay */
          cy={11.6 + (i % 3) * 0.5}
          rx={7 + (i % 2) * 0.5}
          ry="8.6"
          fill={`url(#${g})`}
          transform={`rotate(${deg + (i % 2 ? 4 : -3)} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="3.6" fill={deep} opacity="0.9" />
      <circle cx="18.8" cy="18.8" r="1.3" fill={light} opacity="0.8" />
    </svg>
  )
}

/** Bông năm cánh nhỏ hơn, cánh tròn và chồng lên nhau */
function BlossomB({ hue, uid }) {
  const [light, mid, deep] = HUES[hue]
  const g = `fg-${uid}`
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full">
      <PetalGradient id={g} light={light} mid={mid} />
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <ellipse
          key={deg}
          cx="20"
          cy={13.2 + (i % 2) * 0.6}
          rx={8.2 - (i % 2) * 0.6}
          ry="8"
          fill={`url(#${g})`}
          transform={`rotate(${deg + (i % 2 ? 5 : -4)} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="3" fill={deep} opacity="0.88" />
    </svg>
  )
}

/** Nhành hoa: cọng mảnh với vài nụ - dùng để phá nhịp giữa các bông tròn */
function Sprig({ hue, uid }) {
  const [light, mid, deep] = HUES[hue]
  const g = `fg-${uid}`
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full">
      <PetalGradient id={g} light={light} mid={mid} />
      <path
        d="M20.5 39 C 19 30, 20.5 22, 19.5 5"
        stroke="#A9B49B"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M20 22 C 16 20, 14 17.5, 12.5 14.5" stroke="#A9B49B" strokeWidth="0.9" fill="none" strokeLinecap="round" />
      <path d="M20 28 C 24 26.5, 26 24.5, 27.5 21.5" stroke="#A9B49B" strokeWidth="0.9" fill="none" strokeLinecap="round" />
      <ellipse cx="19.5" cy="6" rx="4.6" ry="5.4" fill={`url(#${g})`} />
      <ellipse cx="12" cy="13" rx="3.8" ry="4.4" fill={`url(#${g})`} transform="rotate(-30 12 13)" />
      <ellipse cx="28" cy="20" rx="3.8" ry="4.4" fill={`url(#${g})`} transform="rotate(30 28 20)" />
      <circle cx="19.5" cy="6" r="1.5" fill={deep} opacity="0.8" />
      <circle cx="12" cy="13" r="1.2" fill={deep} opacity="0.7" />
      <circle cx="28" cy="20" r="1.2" fill={deep} opacity="0.7" />
    </svg>
  )
}

const SHAPES = { a: BlossomA, b: BlossomB, s: Sprig }

/* ── Các cách rải hoa dựng sẵn ────────────────────────────────────────────
   Toạ độ theo phần trăm khung của phần tử cha. `sm` nghĩa là chỉ hiện từ màn
   hình ≥640px trở lên: điện thoại khung hẹp, rải nhiều sẽ thành rối. */
const PRESETS = {
  families: [
    { top: 5, left: 8, size: 52, rot: -18, hue: 'vang', kind: 'a' },
    { top: 13, left: 89, size: 42, rot: 24, hue: 'lam', kind: 'b' },
    { top: 58, left: 6, size: 38, rot: 12, hue: 'tim', kind: 'b', sm: true },
    { top: 76, left: 90, size: 50, rot: -14, hue: 'hong', kind: 'a', sm: true },
    { top: 36, left: 93, size: 34, rot: 8, hue: 'cam', kind: 's', sm: true },
    { top: 88, left: 14, size: 40, rot: -8, hue: 'vang', kind: 'b', sm: true },
    { top: 30, left: 4, size: 30, rot: 20, hue: 'hong', kind: 's', sm: true },
  ],
  story: [
    { top: 4, left: 90, size: 48, rot: 16, hue: 'tim', kind: 'a', sm: true },
    { top: 26, left: 95, size: 36, rot: -20, hue: 'vang', kind: 'b', sm: true },
    { top: 90, left: 6, size: 44, rot: 10, hue: 'hong', kind: 'b' },
    { top: 66, left: 93, size: 38, rot: -12, hue: 'lam', kind: 's', sm: true },
    { top: 8, left: 5, size: 34, rot: -14, hue: 'cam', kind: 'b' },
  ],
  details: [
    { top: 4, left: 10, size: 46, rot: 20, hue: 'lam', kind: 'b' },
    { top: 3, left: 87, size: 40, rot: -16, hue: 'hong', kind: 'a', sm: true },
    { top: 42, left: 5, size: 34, rot: -10, hue: 'vang', kind: 's', sm: true },
    { top: 90, left: 88, size: 48, rot: 14, hue: 'tim', kind: 'a', sm: true },
    { top: 70, left: 4, size: 36, rot: 6, hue: 'cam', kind: 'b', sm: true },
  ],
  gift: [
    { top: 12, left: 9, size: 46, rot: -22, hue: 'cam', kind: 'a' },
    { top: 72, left: 89, size: 48, rot: 18, hue: 'vang', kind: 'a', sm: true },
    { top: 22, left: 92, size: 34, rot: 6, hue: 'lam', kind: 'b', sm: true },
    { top: 82, left: 8, size: 32, rot: -10, hue: 'tim', kind: 'b', sm: true },
  ],
  countdown: [
    { top: 22, left: 7, size: 38, rot: 14, hue: 'hong', kind: 'b', sm: true },
    { top: 26, left: 92, size: 42, rot: -18, hue: 'tim', kind: 'a', sm: true },
  ],
}

export default function Florals({ preset, className = '' }) {
  const items = PRESETS[preset] ?? []
  if (items.length === 0) return null

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
    >
      {items.map((it, i) => {
        const Shape = SHAPES[it.kind] ?? BlossomA
        return (
          <span
            key={i}
            className={`absolute block ${it.sm ? 'hidden sm:block' : ''}`}
            style={{
              top: `${it.top}%`,
              left: `${it.left}%`,
              width: it.size,
              height: it.size,
              transform: `translate(-50%, -50%) rotate(${it.rot}deg)`,
              opacity: it.opacity ?? 0.82,
            }}
          >
            <Shape hue={it.hue} uid={`${preset}-${i}`} />
          </span>
        )
      })}
    </div>
  )
}
