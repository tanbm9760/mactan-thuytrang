/**
 * Lớp nhiễu giấy phủ toàn trang ở độ mờ rất thấp. Gần như không nhìn thấy,
 * nhưng đủ để màn hình hết cảm giác phẳng lì như giao diện phần mềm.
 * Dùng feTurbulence của SVG nên không tốn thêm một file ảnh nào.
 */
export default function PaperGrain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-100 opacity-[0.035] mix-blend-multiply"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  )
}
