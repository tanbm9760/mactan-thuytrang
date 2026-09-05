import { Children, cloneElement, isValidElement } from 'react'
import { useReveal } from '../hooks/useReveal'

/**
 * Bọc một nhóm phần tử để chúng hiện dần so le nhau khi cuộn tới.
 * Chỉ dùng MỘT observer cho cả nhóm, độ trễ của từng phần tử nằm ở CSS.
 *
 *   <RevealGroup step={80}>
 *     <p>dòng một</p>
 *     <p>dòng hai</p>   ← hiện sau 80ms
 *   </RevealGroup>
 */
export function RevealGroup({ children, step = 80, start = 0, threshold = 0.2, className = '', as: Tag = 'div', ...rest }) {
  const ref = useReveal({ threshold })

  return (
    <Tag ref={ref} className={`reveal-group ${className}`} {...rest}>
      {Children.toArray(children).map((child, i) =>
        isValidElement(child)
          ? cloneElement(child, {
              className: `reveal-item ${child.props.className ?? ''}`,
              style: { ...child.props.style, '--i-delay': `${start + i * step}ms` },
            })
          : child,
      )}
    </Tag>
  )
}

/**
 * Tiêu đề hiện lên từng chữ một. Dùng cho tên chương và các câu ngắn -
 * đừng dùng cho đoạn văn dài, vừa rối vừa làm chậm máy.
 */
export function SplitWords({ text, step = 55, start = 0, className = '', as: Tag = 'span' }) {
  const ref = useReveal({ threshold: 0.3 })
  const words = String(text).split(' ')

  return (
    <Tag ref={ref} className={`reveal-group ${className}`}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="reveal-item inline-block"
          style={{ '--i-delay': `${start + i * step}ms` }}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}
