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

Tên bộ **không hiện ra ngoài** - hai bộ chỉ ngăn nhau bằng một dấu mảnh. Tên
khai trong `config.albums` chỉ dùng cho trình đọc màn hình và để quyết định thứ
tự hiện. Thẻ ảnh trong album cao cố định, rộng tự do, nên ảnh ngang và ảnh dọc
đều hiện đủ khung, không bị cắt.

**Mã QR**: đặt tên file có chữ `groom` / `bride` (hoặc `trai` / `gai`).

Album chỉ dùng **ảnh đứng** cho đều khổ. Thẻ ảnh cao cố định, rộng tự do - nếu
sau này bạn thêm ảnh ngang thì nó vẫn hiện đủ khung chứ không bị cắt, chỉ là
thẻ sẽ rộng hơn các thẻ còn lại.

**Chạm** vào ảnh để xem lớn, **giữ** ngón tay để nhấc ảnh lên xem kỹ. Vuốt ngang
để lướt.

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

Hoa lấy thẳng từ **tấm thiệp in của gia đình** - đúng những bông ấy, đúng năm
màu ấy (vàng bơ, xanh lam nhạt, tím oải hương, hồng phấn, cam đào). Website
phải nhận ra được là cùng một bộ với tấm thiệp cầm trên tay, nên hoa vẽ theo
thiệp chứ không vẽ theo ý người làm web.

Vẽ hoàn toàn bằng SVG trong
[`src/components/Florals.jsx`](src/components/Florals.jsx), không dùng file
ảnh - nét ở mọi độ phân giải và không thêm byte nào vào phần ảnh phải tải.

Mỗi phần dùng một cách rải riêng, khai trong `PRESETS`:

```js
{ top: 10, left: 10, size: 58, rot: -18, hue: 'vang', kind: 'a' }
//  vị trí theo %     cỡ px  độ nghiêng   màu        dáng hoa
```

- `hue`: `vang` · `lam` · `tim` · `hong` · `cam`
- `kind`: `a` (sáu cánh) · `b` (năm cánh) · `s` (nhành oải hương)
- Thêm `sm: true` nếu chỉ muốn hiện từ màn hình ≥640px

Ba điều giữ cho nó không thành rườm rà, sửa `PRESETS` thì nhớ giữ:

1. **Chỉ rải trên nền giấy.** Không bao giờ đặt hoa lên ảnh cưới - ảnh là thứ
   đáng được nhìn nhất, hoa mà đè lên thì cả hai cùng hỏng.
2. **Toạ độ bám cột chữ, không bám mép màn hình.** `BOXES` khoá bề ngang khối
   hoa theo bề ngang nội dung của từng phần. Tấm thiệp in là khổ đứng, hoa nằm
   ngay sát chữ; màn hình máy tính rộng gấp đôi, rải theo mép thì hoa dạt ra
   tận rìa và trông như lạc chỗ.
3. **Mỗi bông một nhịp trôi khác nhau** (14-26 giây), nên mắt không bao giờ
   bắt được hai bông động cùng lúc - đó là khác biệt giữa "hoa khô rung rất
   nhẹ trên mặt giấy" và "hoạt ảnh trang trí". Chuyển động tự tắt khi máy bật
   *giảm chuyển động*.

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

> ⚠️ **Phải là URL kết thúc bằng `/exec`, không phải `/dev`.**
> Apps Script cho hai URL: `/dev` là bản thử nghiệm, chỉ chạy khi chính bạn
> đang đăng nhập bằng tài khoản sở hữu script - khách mở lên sẽ bị Google đòi
> đăng nhập và phản hồi mất trắng. Hai URL dùng hai mã ID khác nhau nên không
> thể tự đổi đuôi; phải lấy `/exec` từ màn hình Triển khai.
>
> Trang web tự chặn trường hợp này: nếu `endpoint` kết thúc bằng `/dev` thì
> form báo lỗi ngay thay vì để khách gặp.

Kiểm tra: mở thẳng URL đó trên trình duyệt, thấy `{"ok":true,...}` là đã chạy.
Nếu bị chuyển sang trang đăng nhập Google thì bản triển khai chưa đặt quyền
"Bất kỳ ai".

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
    ├── Monogram.jsx          dấu triện hai chữ viết tắt (SVG)
    ├── SectionMark.jsx       dấu mở chương: số La Mã + kẻ tóc
    ├── LotusIcon.jsx         bông sen cạnh tên cha mẹ đã khuất
    ├── PaperGrain.jsx        lớp vân giấy phủ toàn trang
    ├── PhotoBand.jsx         ảnh tràn viền, dùng như một lần lật trang
    ├── Schedule.jsx          chương trình trong ngày
    ├── Navbar.jsx            thanh điều hướng + đổi ngôn ngữ
    ├── Hero.jsx              màn hình đầu tiên
    ├── Countdown.jsx         đếm ngược
    ├── Families.jsx          lời mời + tên bố mẹ hai bên
    ├── Story.jsx             chuyện tình yêu, dựng như trang đôi tạp chí
    ├── Details.jsx           ngày cỡ lớn, chương trình, địa điểm, bản đồ
    ├── Gallery.jsx           album ảnh (dải ảnh + xem phóng to)
    ├── Lightbox.jsx          khung xem ảnh phóng to
    ├── Gift.jsx              mã QR mừng cưới
    ├── Rsvp.jsx              form xác nhận tham dự
    ├── Footer.jsx            liên hệ cô dâu chú rể
    └── MusicToggle.jsx       nút bật/tắt nhạc nền
```

### Nhịp của cả trang

Thứ tự và **độ cao** các phần là quyết định thiết kế quan trọng nhất, và nó nằm
ở [`src/App.jsx`](src/App.jsx). Không phần nào cao bằng phần nào:

```
BÌA        nghi thức     tối, kín màn hình
MỞ ĐẦU     cao trào      ảnh kín màn hình, chữ đặt vào khoảng trời trống
ĐẾM NGƯỢC  nghỉ          rất thấp, rất thoáng
CHUYỆN     thân mật      cao nhất trang, trang đôi lệch trục
ẢNH        lật trang     lại kín màn hình
GIA ĐÌNH   trang trọng   đối xứng tuyệt đối, nền giấy da bò
NGÀY CƯỚI  đồ hoạ        chữ số cỡ lớn, rồi chương trình và địa điểm
ALBUM      phóng khoáng  dải ảnh tràn ra hai mép màn hình
MỪNG CƯỚI  nhỏ tiếng     thấp nhất trang
XÁC NHẬN   đoạn kết      tắt đèn: nền olive sẫm cho tới hết trang
```

## 8. Đổi màu và font chữ

Bảng màu **"Hoàng hôn"** được rút từ chính ảnh cưới của bạn — đồng và olive
sẫm của ảnh mở đầu lúc hoàng hôn, nền ngà ấm của bộ studio. Cả trang chỉ dùng
năm giá trị, không hơn. Tất cả nằm trong khối `@theme` ở đầu
[`src/index.css`](src/index.css):

```css
--color-background: #f5f0e4;  /* ngà ấm — nền chính         */
--color-sand:       #ebe3d1;  /* giấy da bò — nền xen kẽ    */
--color-foreground: #23211a;  /* mực olive — chữ   (14.2:1) */
--color-primary:    #7f6234;  /* đồng sẫm — CHỮ nhấn (5.1:1) */
--color-gold:       #a98a53;  /* đồng sáng — CHỈ kẻ và dấu  */
--color-deep:       #22221b;  /* olive sẫm — bìa & đoạn kết */
```

Màu nền `#f5f0e4` không phải chọn cho đẹp mắt: vùng trời trong ảnh mở đầu đo
được là `rgb(253,234,196)`, và màu giấy được đặt sát đúng độ sáng đó. Nhờ vậy
mép trên tấm ảnh **tan vào trang** thay vì dán lên trang - đó là lý do chữ ở
màn hình đầu tiên đọc được mà không cần phủ tối lên ảnh một chút nào.

> ⚠️ `--color-gold` chỉ đạt **2.8:1** trên nền ngà, dưới ngưỡng đọc được.
> Dùng nó cho đường kẻ, chấm tròn, dấu nhỏ — **đừng bao giờ dùng làm màu chữ**.
> Chữ màu vàng phải dùng `--color-primary`.

**Font:** tiêu đề dùng **Fraunces**, nội dung dùng **Be Vietnam Pro**.

Fraunces là font biến thiên, có ba trục đáng chú ý — `opsz` (đổi hẳn hình dáng
chữ: bản 144 mảnh và sắc như chữ tít tạp chí, bản 9 dày và tròn như chữ chú
thích), `SOFT` (độ mềm của đầu nét) và `WONK` (bộ chữ "lệch chuẩn", chính là
chữ `&` uốn lượn).

Cỡ chữ **không** đặt rời rạc ở từng component nữa. `src/index.css` có bảy vai
trò chữ, mỗi vai một class — sửa ở đó là cả trang đổi theo:

| Class | Dùng cho |
| --- | --- |
| `.t-display` | tên cô dâu chú rể, ngày cưới cỡ lớn |
| `.t-head` | tên chương |
| `.t-quote` | câu cảm xúc, lời dẫn (serif nghiêng) |
| `.t-eyebrow` / `.t-eyebrow-lg` | nhãn chữ hoa giãn rộng |
| `.t-roman` | chữ số La Mã mở chương |
| `.t-body` | đoạn văn |
| `.t-caption` | chú thích |
| `.t-num` | chữ số: ngày cưới, đếm ngược, giờ |

Nhịp dọc cũng vậy: `.sec-sm` · `.sec` · `.sec-lg` cho ba độ cao khác nhau -
đừng đặt cùng một `py-` cho mọi phần, vì đó là thứ làm cả trang phẳng lì.

> Khi đổi sang font khác, **kiểm tra font đó có bộ ký tự tiếng Việt không**.
> Rất nhiều font serif đẹp trên Google Fonts (Bodoni Moda, DM Serif Display,
> Cinzel, Marcellus, Italiana, Instrument Serif) **không có** — chữ sẽ vỡ dấu ở
> ệ, ộ, ữ, đ. Cách kiểm tra nhanh: mở
> `fonts.googleapis.com/css2?family=Tên+Font` và tìm dòng `/* vietnamese */`.
