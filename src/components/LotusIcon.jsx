/**
 * Bông sen nhỏ đặt cạnh tên cha mẹ đã khuất - đúng quy ước của thiệp cưới
 * Việt Nam, và giống hệt tấm thiệp in của gia đình.
 */
export default function LotusIcon({ className = '', size = 15 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Đã khuất"
    >
      <g fill="currentColor">
        {/* cánh giữa */}
        <path d="M12 3.4c1.7 2 2.6 4 2.6 6.1 0 2-.9 3.8-2.6 5.4-1.7-1.6-2.6-3.4-2.6-5.4 0-2.1.9-4.1 2.6-6.1z" />
        {/* hai cánh trong */}
        <path d="M7.4 6.6c2 1.4 3.2 3 3.7 4.8.5 1.8.2 3.6-.8 5.4-2-.8-3.4-2.1-4.1-3.8-.7-1.7-.6-3.8.4-6.2l.8-.2z" opacity=".82" />
        <path d="M16.6 6.6c1 2.4 1.1 4.5.4 6.2-.7 1.7-2.1 3-4.1 3.8-1-1.8-1.3-3.6-.8-5.4.5-1.8 1.7-3.4 3.7-4.8l.8.2z" opacity=".82" />
        {/* hai cánh ngoài */}
        <path d="M3.2 11c2.4.4 4.1 1.2 5.2 2.4 1.1 1.2 1.6 2.8 1.6 4.9-2.3.1-4.1-.5-5.4-1.7-1.2-1.2-1.7-3-1.4-5.6z" opacity=".6" />
        <path d="M20.8 11c.3 2.6-.2 4.4-1.4 5.6-1.3 1.2-3.1 1.8-5.4 1.7 0-2.1.5-3.7 1.6-4.9 1.1-1.2 2.8-2 5.2-2.4z" opacity=".6" />
      </g>
    </svg>
  )
}
