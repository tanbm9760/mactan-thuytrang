import { config } from '../config'

/**
 * Monogram vẽ bằng SVG: vòng tròn kẻ tóc vàng đồng, hai chữ viết tắt xếp chồng.
 * Thay cho dòng chữ "MT & TT" ở thanh nav và trên bìa thiệp.
 */
export default function Monogram({ className = '', size = 96, tone = 'gold' }) {
  const stroke = tone === 'light' ? 'rgba(247,243,234,0.55)' : 'var(--color-gold)'
  const text = tone === 'light' ? '#f7f3ea' : 'var(--color-primary)'

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
      <circle cx="50" cy="50" r="46" fill="none" stroke={stroke} strokeWidth="0.8" />
      <circle cx="50" cy="50" r="42" fill="none" stroke={stroke} strokeWidth="0.4" opacity="0.6" />
      <text
        x="50" y="42" textAnchor="middle" fill={text}
        fontFamily="Fraunces, Georgia, serif" fontSize="24" letterSpacing="1.5"
      >
        {first}
      </text>
      <line x1="34" y1="50" x2="66" y2="50" stroke={stroke} strokeWidth="0.6" />
      <text
        x="50" y="72" textAnchor="middle" fill={text}
        fontFamily="Fraunces, Georgia, serif" fontSize="24" letterSpacing="1.5"
      >
        {second}
      </text>
    </svg>
  )
}
