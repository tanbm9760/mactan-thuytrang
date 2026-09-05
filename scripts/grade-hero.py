"""
Chỉnh màu ảnh mở đầu và nướng thẳng vào file .webp.

Chỉnh màu ở file ảnh chứ không phủ lớp lên trên: lớp phủ làm phẳng cả bức ảnh,
còn đường cong màu thì làm sâu vùng tối, giữ vùng sáng và đẩy sắc hoàng hôn -
ảnh trông nét hơn, đồng thời hai bàn tay thành bóng đậm để chữ trắng có chỗ bám.

Chạy lại:  python3 scripts/grade-hero.py
"""

from PIL import Image, ImageOps, ImageEnhance
import pathlib

SRC = pathlib.Path("src/assets/prewedding_simplevows/NDL09829.JPG")
DEST = pathlib.Path("src/assets/hero/NDL09829.webp")

# Đường cong từng kênh màu (vào, ra). Đỏ được đẩy lên ở vùng sáng, lam bị kéo
# xuống - đó là cách tạo ra sắc vàng đồng của hoàng hôn.
CURVES = {
    "r": [(0, 0), (50, 44), (128, 146), (205, 228), (255, 255)],
    "g": [(0, 0), (50, 40), (128, 126), (205, 204), (255, 248)],
    "b": [(0, 6), (50, 38), (128, 110), (205, 176), (255, 230)],
}
SATURATION = 1.16
CONTRAST = 1.12
LONG_EDGE = 2400
QUALITY = 82


def lut(points):
    """Bảng tra 256 mức, nội suy tuyến tính qua các điểm điều khiển."""
    pts = sorted(points)
    table = []
    for i in range(256):
        for k in range(len(pts) - 1):
            x0, y0 = pts[k]
            x1, y1 = pts[k + 1]
            if x0 <= i <= x1:
                t = 0 if x1 == x0 else (i - x0) / (x1 - x0)
                table.append(max(0, min(255, round(y0 + t * (y1 - y0)))))
                break
        else:
            table.append(i)
    return table


def main():
    with Image.open(SRC) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        im.thumbnail((LONG_EDGE, LONG_EDGE), Image.LANCZOS)
        im = im.point(lut(CURVES["r"]) + lut(CURVES["g"]) + lut(CURVES["b"]))
        im = ImageEnhance.Color(im).enhance(SATURATION)
        im = ImageEnhance.Contrast(im).enhance(CONTRAST)
        DEST.parent.mkdir(parents=True, exist_ok=True)
        im.save(DEST, "WEBP", quality=QUALITY, method=6)

    kb = DEST.stat().st_size // 1024
    print(f"{DEST}  {im.size[0]}x{im.size[1]}  {kb} KB")


if __name__ == "__main__":
    main()
