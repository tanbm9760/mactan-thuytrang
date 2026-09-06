/**
 * Lớp vân giấy phủ toàn trang ở độ mờ rất thấp. Gần như không nhìn thấy,
 * nhưng đủ để màn hình hết cảm giác phẳng lì như giao diện phần mềm - và đủ
 * để những mảng màu ngà lớn có được chút "hạt" của giấy in.
 *
 * Dùng feTurbulence của SVG nên không tốn thêm một file ảnh nào.
 *
 * Cách hoà trộn nằm ở class `.paper-grain` trong index.css, không đặt ở đây:
 * máy cảm ứng phải bỏ mix-blend-mode đi thì cuộn mới mượt - xem ghi chú ở đó.
 */
export default function PaperGrain() {
  return (
    <div
      aria-hidden
      className="paper-grain pointer-events-none fixed inset-0 z-100"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  )
}
