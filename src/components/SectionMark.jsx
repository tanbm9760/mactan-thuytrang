import { useReveal } from '../hooks/useReveal'

/**
 * Dấu mở chương: một chữ số La Mã nhỏ màu đồng, một nét kẻ tóc tự vẽ ra, và
 * (tuỳ chọn) một dòng nhãn chữ hoa.
 *
 * Đây là thứ duy nhất lặp lại y hệt ở mọi phần của thiệp. Bố cục mỗi phần
 * mỗi khác, nhưng dấu mở chương thì giống nhau - đó là cách một quyển tạp
 * chí giữ được mạch mà không bị đều đều.
 */
export default function SectionMark({ numeral, label, align = 'left', className = '' }) {
  const ref = useReveal({ threshold: 0.4 })
  const centred = align === 'center'

  return (
    <div className={`${centred ? 'flex flex-col items-center text-center' : ''} ${className}`}>
      <span className="t-roman block text-primary">{numeral}</span>
      <span
        ref={ref}
        aria-hidden
        className="reveal-rule mt-3 block h-px w-9 bg-gold"
        style={centred ? { transformOrigin: 'center' } : undefined}
      />
      {label && <p className="t-eyebrow mt-4 text-muted-foreground">{label}</p>}
    </div>
  )
}
