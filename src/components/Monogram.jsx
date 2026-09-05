import { config } from '../config'

/**
 * Dấu ấn của hai người: hai chữ viết tắt xếp chồng, ngăn bằng một nét kẻ tóc.
 *
 * Vòng tròn bao ngoài là tuỳ chọn (`ring`) - ở cỡ nhỏ như trên thanh nav, vòng
 * tròn chỉ làm chữ chật lại và biến monogram thành một cái icon. Bỏ vòng đi thì
 * nó lại là một dấu triện in trên giấy.
 */
export default function Monogram({ className = '', size = 96, tone = 'gold', ring = false }) {
  const stroke = tone === 'light' ? 'rgba(240,233,218,0.5)' : 'var(--color-gold)'
  const text = tone === 'light' ? '#f0e9da' : 'var(--color-primary)'

  const first = config.nameOrder === 'bride-first' ? config.bride.initial : config.groom.initial
  const second = config.nameOrder === 'bride-first' ? config.groom.initial : config.bride.initial

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`${first} & ${second}`}
    >
      {ring && (
        <>
          <circle cx="50" cy="50" r="47" fill="none" stroke={stroke} strokeWidth="0.5" />
          <circle cx="50" cy="50" r="43.5" fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.45" />
        </>
      )}
      <text
        x="50" y="43" textAnchor="middle" fill={text}
        fontFamily="Fraunces, Georgia, serif" fontSize="25" fontWeight="300" letterSpacing="3"
        style={{ fontVariationSettings: '"SOFT" 20, "WONK" 0, "opsz" 144' }}
      >
        {first}
      </text>
      <line x1="30" y1="50.5" x2="70" y2="50.5" stroke={stroke} strokeWidth="0.7" />
      <text
        x="50" y="74" textAnchor="middle" fill={text}
        fontFamily="Fraunces, Georgia, serif" fontSize="25" fontWeight="300" letterSpacing="3"
        style={{ fontVariationSettings: '"SOFT" 20, "WONK" 0, "opsz" 144' }}
      >
        {second}
      </text>
    </svg>
  )
}
