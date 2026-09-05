# Thiệp mời cưới

Thiệp cưới online một trang, song ngữ **Tiếng Việt / English**, chạy tốt trên điện thoại.
Dựng bằng React + Vite + Tailwind CSS v4.

---

## 1. Chạy thử trên máy

```bash
npm install     # chỉ cần chạy lần đầu
npm run dev     # mở http://localhost:5173
```

Sửa file rồi lưu là trang tự cập nhật, không cần tải lại.

---

## 2. Sửa thông tin đám cưới

**Mọi thông tin nằm trong một file duy nhất: [`src/config.js`](src/config.js)**

| Cần sửa | Mục trong config |
|---|---|
| Tên cô dâu, chú rể, viết tắt trên logo | `groom`, `bride` |
| Ngày giờ cưới (dùng cho đếm ngược) | `weddingDate` |
| Ngày âm lịch | `lunarDate` |
| Nhà hàng, địa chỉ, bản đồ | `venue` |
| Tên bố mẹ hai bên, địa chỉ, hoa sen | `families` |
| Bật/tắt từng phần của thiệp | `sections` |
| Chương trình trong ngày (lễ, đón khách, khai tiệc) | `schedule` |
| Sảnh tiệc trong toà nhà | `venue.hall` |
| Ngân hàng, số tài khoản mừng cưới | `gift` |
| Link nhận phản hồi RSVP, hạn chót | `rsvp` |
| Số điện thoại liên hệ ở cuối trang | `contact` |

> ⚠️ `weddingDate: new Date(2026, 8, 20, 17, 0)` — **tháng đếm từ 0**, nên `8` nghĩa là **tháng 9**.

Muốn đổi chữ trên thiệp (lời mời, tiêu đề, câu chuyện tình yêu…):
sửa [`src/lib/translations.js`](src/lib/translations.js) — khối `vi` cho tiếng Việt, `en` cho tiếng Anh.

---

## 3. Thay ảnh

Bỏ file vào đúng thư mục là xong, không phải khai báo gì thêm:

```
src/assets/
├── hero/       → ảnh mở đầu, ảnh NGANG (lấy 1 file đầu tiên)
├── story/      → 1 ảnh ở phần "Chuyện của chúng mình", ảnh DỌC
├── band/       → dải ảnh tràn viền trước phần xác nhận, ảnh NGANG
├── gallery/    → album cuối trang (chia thư mục con thành nhiều bộ)
├── qr/         → mã QR chuyển khoản
└── music/      → nhạc nền (.mp3)
```

**Ảnh hero** nên là ảnh ngang có vùng tối ở nửa dưới, vì tên hai bạn đặt ở đó.

**Ảnh story** bị cắt thành khung vòm (nửa trên bo tròn), nên hãy chọn ảnh dọc
có mặt hai người nằm gọn ở phần trên khung. Ảnh mà đỉnh đầu sát mép trên sẽ bị
vòm cắt mất.

**Album cuối trang.** Chia thư mục con để có nhiều bộ ảnh:

```
src/assets/gallery/studio/       → bộ 1
src/assets/gallery/ngoai-canh/   → bộ 2
```

Tên bộ **không hiện ra ngoài**. Toàn bộ ảnh của các thư mục con được ghép thành
một cuốn album lật từng trang, theo đúng thứ tự khai trong `config.albums`.

Ảnh **đặt lọt trong khung giấy** chứ không cắt đầy trang, nên ảnh ngang và ảnh
dọc lẫn lộn vẫn hiện đủ khung - giống ảnh dán trong album thật.

Máy tính mở hai trang có gáy ở giữa, điện thoại một trang. Lật bằng nút hai bên
hoặc vuốt ngang trên điện thoại. Chạm vào ảnh để xem lớn.

**Mã QR**: đặt tên file có chữ `groom` / `bride` (hoặc `trai` / `gai`).

**Nhạc nền**: bỏ 1 file mp3 vào `src/assets/music/`, rồi bật `sections.music: true`.

> Ảnh nên nén trước khi bỏ vào (dùng [squoosh.app](https://squoosh.app), xuất
> `.webp`, chiều rộng ~1500px). Ảnh gốc từ máy ảnh 8-10 MB/tấm sẽ làm thiệp tải
> rất chậm trên 4G.
>
> WebP không giữ EXIF, nên khi nén lại thì toạ độ GPS trong ảnh gốc cũng bị
> loại bỏ - thiệp là link công khai.
>
> ⚠️ Nếu ảnh gốc là ảnh dọc chụp bằng máy ảnh, chúng thường được lưu nằm ngang
> kèm thẻ EXIF xoay. Công cụ nén nào bỏ qua thẻ này sẽ cho ra ảnh nằm nghiêng.

### Sửa lời kể

Lời kể nằm ở `story.paragraphs` trong
[`src/lib/translations.js`](src/lib/translations.js) - mỗi phần tử của mảng là
một đoạn văn. `story.closing` là câu kết in nghiêng màu vàng đồng ở cuối.

---

### Bông sen cạnh tên cha mẹ

Theo quy ước của thiệp cưới Việt Nam, cha mẹ đã khuất được đặt một bông sen nhỏ
cạnh tên. Bật bằng `fatherLotus: true` hoặc `motherLotus: true` trong
`config.families`; bỏ dòng đó đi là hoa biến mất.

### Hoa nhỏ rải rác

Hoa được vẽ hoàn toàn bằng SVG trong
[`src/components/Florals.jsx`](src/components/Florals.jsx), không dùng file ảnh
- nhờ vậy nét ở mọi độ phân giải và không thêm byte nào vào phần ảnh phải tải.

Mỗi phần của trang dùng một cách rải riêng, khai trong `PRESETS`. Mỗi bông là
một dòng:

```js
{ top: 5, left: 8, size: 52, rot: -18, hue: 'vang', kind: 'a' }
//  vị trí theo %      cỡ px  độ nghiêng   màu        dáng hoa
```

- `hue`: `vang` · `lam` · `tim` · `hong` · `cam`
- `kind`: `a` (sáu cánh) · `b` (năm cánh) · `s` (nhành hoa)
- Thêm `sm: true` nếu chỉ muốn hiện từ màn hình ≥640px - điện thoại khung hẹp,
  rải nhiều sẽ thành rối.

---

## 4. Thiệp mời đích danh

Thêm `?guest=` vào cuối link là bìa thiệp hiện tên khách và form RSVP tự điền sẵn:

```
https://thiep-cuoi.com/?guest=Anh%20Ch%E1%BB%8B%20Nam
                        →  "Trân trọng kính mời Anh Chị Nam"

https://thiep-cuoi.com/?guest=B%C3%A1c%20Hoa&side=gai
                        →  thêm: chọn sẵn "khách của nhà gái"
```

Tên có dấu và dấu cách phải được mã hoá URL. Cách nhanh nhất để tạo hàng loạt
link: dùng công thức `=ENCODEURL(A2)` trong Google Sheets, rồi nối vào link gốc.

`side` nhận `trai` hoặc `gai`. Bỏ qua tham số nào thì phần đó về mặc định.

---

## 5. Kết nối Google Sheets (nhận danh sách khách)

Form "Xác nhận tham dự" gửi thẳng vào một Google Sheet của bạn — miễn phí, không cần server.

1. Tạo Google Sheet mới tại [sheets.new](https://sheets.new)
2. Menu **Tiện ích mở rộng → Apps Script**
3. Xoá code mẫu, dán toàn bộ nội dung file [`scripts/google-apps-script.gs`](scripts/google-apps-script.gs)
4. Bấm **Lưu**, rồi **Triển khai → Tùy chọn triển khai mới**
   - Loại: **Ứng dụng web**
   - Thực thi với tư cách: **Tôi**
   - Ai có quyền truy cập: **Bất kỳ ai** ← bắt buộc, nếu không khách sẽ không gửi được
5. Cấp quyền cho script (Nâng cao → Chuyển đến… → Cho phép)
6. Copy URL dạng `https://script.google.com/macros/s/AKfy.../exec`
7. Dán vào `rsvp.endpoint` trong `src/config.js`

Kiểm tra: mở thẳng URL đó trên trình duyệt, thấy `{"ok":true,...}` là đã chạy.

Mỗi phản hồi sẽ thành một dòng trong sheet: thời gian, họ tên, số điện thoại,
khách của nhà trai/nhà gái, có tham dự không, số người, lời chúc.

> Sửa lại file `.gs` sau này thì phải **Triển khai lại**
> (Triển khai → Quản lý triển khai → bút chì → Phiên bản: Phiên bản mới) mới có hiệu lực.

---

## 6. Đưa thiệp lên mạng

```bash
npm run build     # kết quả nằm trong thư mục dist/
```

Chọn một trong các cách sau, đều miễn phí:

**Netlify (dễ nhất)** — vào [app.netlify.com/drop](https://app.netlify.com/drop),
kéo thả nguyên thư mục `dist/` vào trang. Xong, có link ngay.

**Vercel** — `npx vercel --prod` trong thư mục dự án.

**GitHub Pages** — sửa `base: '/ten-repo/'` trong `vite.config.js` trước khi build,
rồi đẩy thư mục `dist/` lên nhánh `gh-pages`.

### Ảnh hiện khi gửi link qua Zalo / Facebook

Bỏ một ảnh tên `opengraph.jpg` (kích thước 1200×630) vào thư mục `public/`,
rồi sửa `og:title` và `og:description` trong `index.html`.

---

## 7. Cấu trúc dự án

```
src/
├── config.js                 👈 sửa thông tin đám cưới ở đây
├── lib/
│   ├── translations.js       👈 sửa chữ nghĩa trên thiệp
│   ├── i18n.jsx              chuyển đổi VI / EN
│   ├── assets.js             tự động nạp ảnh từ src/assets/
│   ├── rsvp.js               gửi phản hồi lên Google Sheets
│   └── calendar.js           link "Thêm vào lịch"
│   ├── guest.js              đọc ?guest= và ?side= từ link
│   └── venue.js              link bản đồ suy ra từ địa chỉ
├── hooks/useReveal.js        hiệu ứng hiện dần khi cuộn
└── components/
    ├── Cover.jsx             bìa thiệp, chạm để mở
    ├── Monogram.jsx          monogram SVG
    ├── PaperGrain.jsx        lớp nhiễu giấy phủ toàn trang
    ├── PhotoBand.jsx         dải ảnh tràn viền xen giữa các phần
    ├── Schedule.jsx          chương trình trong ngày
    ├── Navbar.jsx            thanh điều hướng + đổi ngôn ngữ
    ├── Hero.jsx              màn hình đầu tiên
    ├── Countdown.jsx         đồng hồ đếm ngược
    ├── Families.jsx          lời mời + tên bố mẹ hai bên
    ├── Story.jsx             chuyện tình yêu
    ├── Details.jsx           ngày cỡ lớn, địa điểm, bản đồ, chương trình
    ├── Gallery.jsx           album ảnh (carousel + xem phóng to)
    ├── Gift.jsx              mã QR mừng cưới
    ├── Rsvp.jsx              form xác nhận tham dự
    ├── Footer.jsx            liên hệ cô dâu chú rể
    └── MusicToggle.jsx       nút bật/tắt nhạc nền
```

## 8. Đổi màu và font chữ

Bảng màu **"Hoàng hôn"** được rút từ chính ảnh cưới của bạn — vàng đồng và
olive sẫm của ảnh hero lúc hoàng hôn, nền ngà ấm của bộ studio. Tất cả nằm
trong khối `@theme` ở đầu [`src/index.css`](src/index.css):

```css
--color-background: #f7f3ea;  /* ngà ấm — nền chính        */
--color-sand:       #efe6d6;  /* cát nhạt — section xen kẽ */
--color-foreground: #2e2c24;  /* olive đen — chữ  (12.6:1) */
--color-primary:    #8a6b3c;  /* vàng đồng đậm — CHỮ (4.5:1) */
--color-gold:       #b08d57;  /* vàng đồng sáng — CHỈ kẻ/hoa văn */
--color-deep:       #33322a;  /* olive sẫm — bìa & phần RSVP */
```

> ⚠️ `--color-gold` chỉ đạt **2.79:1** trên nền ngà, dưới ngưỡng đọc được.
> Dùng nó cho đường kẻ, chấm tròn, hoa văn — **đừng bao giờ dùng làm màu chữ**.
> Chữ màu vàng phải dùng `--color-primary`.

**Font:** tiêu đề dùng **Fraunces**, nội dung dùng **Be Vietnam Pro**.

Fraunces là font biến thiên, có hai trục hiếm gặp — `SOFT` (độ mềm của đầu nét)
và `WONK` (bộ chữ "lệch chuẩn", chính là chữ `&` uốn lượn trên bìa thiệp). Chỉnh
trong `.font-serif` ở `src/index.css`:

```css
font-variation-settings: "SOFT" 40, "WONK" 1, "opsz" 100;
```

Đặt `"WONK" 0` nếu muốn chữ nghiêm ngắn hơn, tăng `SOFT` lên 80 nếu muốn mềm hơn.

> Khi đổi sang font khác, **kiểm tra font đó có bộ ký tự tiếng Việt không**.
> Rất nhiều font serif đẹp trên Google Fonts (Bodoni Moda, DM Serif Display,
> Cinzel, Marcellus, Italiana, Instrument Serif) **không có** — chữ sẽ vỡ dấu ở
> ệ, ộ, ữ, đ. Cách kiểm tra nhanh: mở
> `fonts.googleapis.com/css2?family=Tên+Font` và tìm dòng `/* vietnamese */`.
