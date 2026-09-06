import { useReveal } from '../hooks/useReveal'
import { useFloralScroll } from '../hooks/useFloralScroll'

/**
 * Hoa nhỏ rải rác - lấy thẳng từ tấm thiệp in của gia đình.
 *
 * Đây KHÔNG phải hoạ tiết trang trí chung chung: tấm thiệp in có đúng những
 * bông này, đúng những màu này (vàng bơ, xanh lam nhạt, tím oải hương, hồng
 * phấn, cam đào) rải thưa ở lề giấy. Website phải nhận ra được là cùng một bộ
 * với tấm thiệp cầm trên tay, nên hoa vẽ theo thiệp chứ không vẽ theo ý mình.
 *
 * Vẽ hoàn toàn bằng SVG, không dùng file ảnh - nét ở mọi độ phân giải và
 * không thêm một byte nào vào phần ảnh phải tải.
 *
 * Ba điều giữ cho nó không thành rườm rà:
 *   - Chỉ rải trên các phần nền giấy. Không bao giờ đặt lên ảnh cưới.
 *   - Nằm ở lề, tránh cột chữ.
 *   - Trôi rất chậm (14-26 giây một nhịp) và mỗi bông một nhịp khác nhau, nên
 *     mắt không bao giờ bắt được hai bông cùng động - giống hoa khô rung rất
 *     nhẹ trên mặt giấy, không phải hoạt ảnh.
 */

/* Màu lấy từ thiệp in: nhạt ở rìa cánh, đậm dần vào tâm - đó là thứ khiến
   bông hoa trông như vẽ màu nước chứ không phải hình vector phẳng. */
const HUES = {
  vang: { light: '#FCEFC7', mid: '#F6D98A', deep: '#DFA83F', heart: '#E3A038' },
  lam: { light: '#DFE8F6', mid: '#B4C8E9', deep: '#7F9FD2', heart: '#F0E3BE' },
  tim: { light: '#E8DCF1', mid: '#C9AFDF', deep: '#9C7ABD', heart: '#EFE1B4' },
  hong: { light: '#FADCE0', mid: '#F1B2BC', deep: '#DC8496', heart: '#F2E0BC' },
  cam: { light: '#FCE3CE', mid: '#F5BE97', deep: '#E39463', heart: '#E5A247' },
}

function Petals({ id, hue }) {
  const c = HUES[hue]
  return (
    <defs>
      <radialGradient id={id} cx="50%" cy="82%" r="78%">
        <stop offset="0%" stopColor={c.deep} stopOpacity="0.95" />
        <stop offset="42%" stopColor={c.mid} stopOpacity="0.92" />
        <stop offset="100%" stopColor={c.light} stopOpacity="0.72" />
      </radialGradient>
    </defs>
  )
}

/** Bông sáu cánh, dáng cúc chuồn - loại xuất hiện nhiều nhất trên thiệp in */
function BlossomA({ hue, uid }) {
  const c = HUES[hue]
  const g = `fl-${uid}`
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full">
      <Petals id={g} hue={hue} />
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <ellipse
          key={deg}
          cx="32"
          /* mỗi cánh lệch nhau một chút cho ra vẻ vẽ tay */
          cy={18.5 + (i % 3) * 0.9}
          rx={9.4 + (i % 2) * 0.7}
          ry="12.2"
          fill={`url(#${g})`}
          transform={`rotate(${deg + (i % 2 ? 5 : -4)} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="5" fill={c.heart} opacity="0.92" />
      <circle cx="30.2" cy="30.2" r="1.9" fill={c.light} opacity="0.85" />
    </svg>
  )
}

/** Bông năm cánh nhỏ hơn, cánh tròn và chồng lên nhau */
function BlossomB({ hue, uid }) {
  const c = HUES[hue]
  const g = `fl-${uid}`
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full">
      <Petals id={g} hue={hue} />
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <ellipse
          key={deg}
          cx="32"
          cy={20.5 + (i % 2) * 1.1}
          rx={11 - (i % 2) * 0.9}
          ry="11.4"
          fill={`url(#${g})`}
          transform={`rotate(${deg + (i % 2 ? 6 : -5)} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="4.2" fill={c.heart} opacity="0.9" />
    </svg>
  )
}

/** Nhành oải hương: cọng mảnh với vài nụ nhỏ dọc thân - dùng để phá nhịp
    giữa các bông tròn, đúng như trên thiệp in. */
function Sprig({ hue, uid }) {
  const c = HUES[hue]
  const g = `fl-${uid}`
  const buds = [
    [32, 12, 3.4, 4.6, 0],
    [27.5, 20, 3.1, 4.2, -22],
    [36.5, 22, 3.1, 4.2, 22],
    [28.5, 29, 2.8, 3.8, -18],
    [35.5, 31, 2.8, 3.8, 18],
    [31.5, 37, 2.5, 3.4, 0],
  ]
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full">
      <Petals id={g} hue={hue} />
      <path
        d="M32 58 C 30.5 48, 32 40, 31.5 14"
        stroke="#A9B49B"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M31.8 40 C 27 37, 25 34, 23.5 30" stroke="#A9B49B" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <path d="M32 46 C 37 44, 39 41, 40.5 37" stroke="#A9B49B" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      {buds.map(([x, y, rx, ry, rot], i) => (
        <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill={`url(#${g})`} transform={`rotate(${rot} ${x} ${y})`} />
      ))}
      <circle cx="32" cy="12" r="1.4" fill={c.deep} opacity="0.7" />
    </svg>
  )
}

const SHAPES = { a: BlossomA, b: BlossomB, s: Sprig }

/* ── Các cách rải hoa dựng sẵn ────────────────────────────────────────────
   Toạ độ theo phần trăm khung của phần tử cha. `sm` nghĩa là chỉ hiện từ màn
   hình ≥640px trở lên: điện thoại khung hẹp, rải nhiều sẽ thành rối và hoa
   dễ chui vào sau cột chữ. */
/* Bề ngang khối hoa của từng phần. Hoa phải bám lấy CỘT CHỮ, không bám mép
   màn hình: tấm thiệp in là khổ đứng, hoa nằm ngay sát chữ; còn màn hình máy
   tính rộng gấp đôi, rải theo mép thì hoa dạt ra tận rìa và trông như lạc chỗ.
   Số ở đây khớp với bề ngang nội dung của từng phần. */
/* Cỡ hoa theo khổ máy: nhỏ lại trên điện thoại, to lên trên máy tính. */
const SCALES = {
  /* Hoa ở màn hình mở đầu nhỏ hơn các phần khác một chút: nền ở đó là bầu
     trời chứ không phải giấy, hoa to quá sẽ tranh chỗ với hai bàn tay. */
  hero: '[--fl-scale:0.86] sm:[--fl-scale:1.05] md:[--fl-scale:1.35]',

  /* Hai bộ của bìa thiệp. `cover` rải trên mặt bàn quanh chiếc phong bì,
     `envelope` rải TRÊN chính tờ giấy phong bì - nên nhỏ hơn hẳn, vì nó phải
     đúng tỉ lệ với một tờ giấy rộng chưa tới nửa mét chứ không phải với cả
     màn hình. Đúng như tấm thiệp in: hoa nằm trên giấy, không nằm quanh giấy. */
  /* Cả hai bộ của bìa thiệp đều đo theo bề ngang phong bì. Chiếc phong bì
     là vật duy nhất trên màn ấy, nên hoa phải to nhỏ theo NÓ chứ không
     theo khổ máy - máy để ngang chỉ cao 390px thì phong bì bị ép nhỏ lại,
     mà hoa vẫn ăn cỡ `md` thì hoa to gần bằng chiếc phong bì. */
  cover: '[--fl-unit:calc(var(--ew)*0.0025)]',

  /* Phần đếm ngược nhỏ hơn hẳn mọi phần khác. Bốn con số cỡ lớn ăn hết bề
     ngang, phần lại thấp - nên hoa ở đây phải là hoa nhỏ, nếu không thì không
     còn một ô trống nào đủ chỗ đặt. */
  countdown: '[--fl-scale:0.72] sm:[--fl-scale:0.85] md:[--fl-scale:1]',
  /* Hoa trên phong bì đo theo BỀ NGANG PHONG BÌ (--ew), không theo khổ máy:
     máy để ngang rộng 820px vẫn ăn cỡ `md`, mà chiếc phong bì ở đó lại bị
     chiều cao ép xuống chỉ còn 250px - hoa cỡ máy tính rơi lên tờ giấy bé
     bằng nửa, to như hoa dán.

     Đổi ĐƠN VỊ chứ không đổi hệ số: `--fl-scale` là một con số, mà --ew là
     một độ dài, nhân hai thứ đó với nhau ra px² - CSS bỏ luôn cả dòng khai
     báo và bông hoa nở ra cỡ mặc định của thẻ SVG. Nhân vào `--fl-unit`
     (mặc định 1px) thì phép tính vẫn là số × độ dài. 1/560 để ở khổ giấy lớn
     nhất hoa đúng bằng cỡ đã dựng trong bảng toạ độ. */
  envelope: '[--fl-unit:calc(var(--ew)*0.001786)]',
}
const DEFAULT_SCALE = '[--fl-scale:0.74] sm:[--fl-scale:1.05] md:[--fl-scale:1.5]'

const BOXES = {
  hero: 'max-w-none',
  /* Hoa bám lấy chiếc phong bì chứ không bám mép màn hình: trên máy tính
     rộng 1440px, rải theo mép thì hoa dạt ra tận hai rìa, cách phong bì
     nửa mét và trông như lạc sang một trang khác. */
  cover: 'max-w-[62rem]',
  envelope: 'max-w-none',
  /* Rộng hơn hẳn cột chữ (max-w-4xl = 56rem) để hai lề ngoài cột đủ chỗ
     cho hoa. Bằng 62rem như cũ thì lề chỉ còn 48px mỗi bên, hoa rơi thẳng
     vào giữa mấy con số. */
  countdown: 'max-w-[74rem]',
  story: 'max-w-none',
  families: 'max-w-[54rem]',
  details: 'max-w-[62rem]',
  gallery: 'max-w-[66rem]',
  gift: 'max-w-[42rem]',
}

const PRESETS = {
  /* Mặt bàn quanh chiếc phong bì - mà cũng chính là mười bông hoa của màn
     hình mở đầu, đang đứng chờ ở một chỗ khác.

     `twin` là số thứ tự của bông tương ứng trong preset `hero`. Lúc mở thiệp,
     mỗi bông ở đây bay tới đúng ô của bông ấy rồi trùng khít lên nó - hai màn
     hình nối vào nhau bằng chính những bông hoa, chứ không bằng một nhịp mờ
     dần. Xem đoạn "cho hoa bay" trong Cover.jsx.

     Vì thế hue / kind / size / rot ở đây phải SAO Y bông twin: lệch một thứ
     thôi là lúc hạ cánh mắt bắt được ngay hai bông khác nhau chồng lên nhau.
     Chỉ `top` và `left` được khác - đó mới là quãng đường bay.

     Toạ độ đi bay chọn sát chiếc phong bì hơn toạ độ đích, nên khi mở thiệp
     hoa nở rộng ra chứ không xô lại. Và không bông nào nằm trong khoảng
     26-74% chiều cao: đó là chỗ của chiếc phong bì. */
  cover: [
    { top: 26, left: 7, size: 54, rot: -16, hue: 'vang', kind: 'a', twin: 0 },
    { top: 24, left: 93, size: 50, rot: 20, hue: 'lam', kind: 'b', twin: 1 },
    { top: 29, left: 17, size: 38, rot: 8, hue: 'cam', kind: 's', twin: 2 },
    { top: 28, left: 83, size: 40, rot: -10, hue: 'hong', kind: 's', twin: 3 },
    { top: 33, left: 3, size: 38, rot: 10, hue: 'hong', kind: 'b', twin: 4 },
    { top: 31, left: 97, size: 36, rot: -14, hue: 'tim', kind: 'b', twin: 5 },
    { top: 74, left: 93, size: 52, rot: 14, hue: 'vang', kind: 'a', twin: 8 },
    { top: 78, left: 84, size: 40, rot: -12, hue: 'hong', kind: 'b', twin: 9 },
    { top: 76, left: 6, size: 50, rot: -8, hue: 'tim', kind: 'a', twin: 10 },
    { top: 79, left: 15, size: 40, rot: 16, hue: 'lam', kind: 'b', twin: 11 },
  ],

  /* Trên chính tờ giấy phong bì. Toạ độ tránh hai chỗ: dải chữ ở giữa, và
     phần bị nắp che (tam giác từ đỉnh xuống 47%) - trừ hai bông cố ý đặt ở
     hai vai, nơi tam giác không với tới nên vẫn thấy lúc phong bì còn kín. */
  envelope: [
    { top: 60, left: 8, size: 44, rot: -14, hue: 'vang', kind: 'a' },
    { top: 68, left: 93, size: 46, rot: 16, hue: 'tim', kind: 'a' },
    { top: 82, left: 15, size: 32, rot: 8, hue: 'lam', kind: 'b' },
    { top: 53, left: 86, size: 30, rot: -10, hue: 'hong', kind: 's' },
    { top: 88, left: 88, size: 34, rot: 12, hue: 'cam', kind: 'b' },
    { top: 22, left: 6, size: 34, rot: 12, hue: 'hong', kind: 'b' },
    { top: 26, left: 94, size: 30, rot: -16, hue: 'vang', kind: 's' },
  ],

  /* Màn hình mở đầu.

     Chỉ rải trong DẢI TRỜI VẼ THÊM ở đỉnh khung (0-25%), tuyệt đối không đặt
     lên bức ảnh. Cả phần dưới 25% là ảnh thật - hoa nằm lên đó trông như dán
     sticker lên ảnh cưới, nhất là chỗ hai bàn tay và tay áo.

     Dải trời lại mỏng, nên hoa ở đây ít hơn các phần khác. Bù lại phần đếm
     ngược ngay bên dưới - toàn nền giấy, không có ảnh - được rải dày hơn. */
  hero: [
    /* Trên dải trời nối thêm */
    { top: 11, left: 5, size: 54, rot: -16, hue: 'vang', kind: 'a' },
    { top: 10, left: 95, size: 50, rot: 20, hue: 'lam', kind: 'b' },
    { top: 16, left: 13, size: 38, rot: 8, hue: 'cam', kind: 's' },
    { top: 15, left: 88, size: 40, rot: -10, hue: 'hong', kind: 's' },
    { top: 16, left: 3, size: 38, rot: 10, hue: 'hong', kind: 'b' },
    { top: 17, left: 97, size: 36, rot: -14, hue: 'tim', kind: 'b' },
    { top: 11, left: 22, size: 34, rot: 12, hue: 'tim', kind: 'b', sm: true },
    { top: 10, left: 78, size: 36, rot: -18, hue: 'vang', kind: 'b', sm: true },

    /* Xuống cả phần dưới, nhưng chỉ vào những ô đã đo là KHÔNG có bàn tay:
       lườn phải ở quãng 58-70%, và góc trái dưới ở quãng 94% - chỗ nằm dưới
       mấy đầu ngón tay. Toạ độ lấy từ bản đồ chỗ trống, không đặt bằng mắt. */
    { top: 60, left: 95, size: 52, rot: 14, hue: 'vang', kind: 'a' },
    { top: 67, left: 88, size: 40, rot: -12, hue: 'hong', kind: 'b' },
    { top: 94, left: 6, size: 50, rot: -8, hue: 'tim', kind: 'a' },
    { top: 96, left: 19, size: 40, rot: 16, hue: 'lam', kind: 'b' },
    { top: 61, left: 79, size: 34, rot: 6, hue: 'cam', kind: 's', sm: true },
    { top: 94, left: 31, size: 36, rot: -14, hue: 'cam', kind: 'b', sm: true },
  ],
  /* Phần đếm ngược là phần CHẬT nhất trang: bốn con số cỡ lớn trải hết bề
     ngang cột chữ, mà cột chữ thì rộng gần bằng cả khung. Chỉ còn hai chỗ
     trống thật:

       - dải padding trên và dưới, không có chữ nào;
       - hai lề ngoài cột chữ - nhưng lề ấy chỉ có từ 640px trở lên, dưới
         mức đó lề chỉ còn 24px nên mọi bông đặt ngang tầm chữ đều đè lên số.

     Năm toạ độ dưới đây lấy từ bản đồ chỗ trống đo ở ba khổ máy (390 / 768 /
     1440), tính cả quãng hoa trôi khi cuộn: dải trên bên phải chữ "CÒN LẠI",
     mép phải ngoài cột số, và góc trái dưới cùng. Không đặt bằng mắt. */
  countdown: [
    { top: 10, left: 90, size: 34, rot: 8, hue: 'vang', kind: 'b' },
    { top: 16, left: 42, size: 26, rot: -12, hue: 'lam', kind: 's' },
    { top: 44, left: 96, size: 30, rot: 14, hue: 'cam', kind: 'b' },
    { top: 76, left: 96, size: 26, rot: 6, hue: 'tim', kind: 'a' },
    { top: 96, left: 10, size: 34, rot: -10, hue: 'hong', kind: 'b' },
  ],
  story: [
    /* Phần chật nhất trang: ảnh chiếm cả cột trái trên máy tính và cả bề ngang
       khi xếp dọc, còn cột chữ chạy gần hết phần còn lại.

       Trên điện thoại thì KHÔNG CÒN chỗ nào thật: dải trống duy nhất là
       padding cuối phần, mà dải ấy hẹp hơn đúng một bông hoa cộng quãng trôi
       khi cuộn - đặt vào đó thì hoặc hoa chạm chữ, hoặc hoa thò xuống dải ảnh
       của phần sau. Thà để trống còn hơn đặt một bông ở chỗ không có chỗ.

       Từ 640px trở lên, cột chữ thu hẹp lại và hở ra một dải bên phải chạy
       suốt chiều cao phần - hoa dồn cả vào đó. */
    { top: 62, left: 98, size: 44, rot: 10, hue: 'lam', kind: 's', sm: true },
    { top: 74, left: 98, size: 38, rot: -16, hue: 'tim', kind: 'a', sm: true },
    { top: 86, left: 98, size: 34, rot: 14, hue: 'cam', kind: 'b', sm: true },
  ],
  families: [
    { top: 10, left: 10, size: 58, rot: -18, hue: 'vang', kind: 'a' },
    { top: 15, left: 90, size: 48, rot: 24, hue: 'lam', kind: 'b' },
    { top: 31, left: 7, size: 40, rot: 12, hue: 'tim', kind: 'b' },
    { top: 47, left: 93, size: 36, rot: 8, hue: 'cam', kind: 's' },
    { top: 56, left: 5, size: 44, rot: -8, hue: 'hong', kind: 'a' },
    { top: 80, left: 91, size: 42, rot: 18, hue: 'vang', kind: 'b' },
    { top: 90, left: 12, size: 34, rot: -10, hue: 'lam', kind: 's', sm: true },
    { top: 40, left: 96, size: 32, rot: -14, hue: 'hong', kind: 'b', sm: true },
  ],
  details: [
    { top: 9, left: 8, size: 50, rot: 20, hue: 'lam', kind: 'b' },
    { top: 13, left: 92, size: 44, rot: -16, hue: 'hong', kind: 'a' },
    { top: 24, left: 3, size: 36, rot: -10, hue: 'vang', kind: 's' },
    { top: 55, left: 94, size: 48, rot: 14, hue: 'tim', kind: 'a' },
    { top: 70, left: 4, size: 38, rot: 6, hue: 'cam', kind: 'b' },
    { top: 78, left: 96, size: 34, rot: -8, hue: 'vang', kind: 'b', sm: true },
  ],
  /* Album là phần DUY NHẤT có vật cản biết đi: dải ảnh tự chạy, nên một chỗ
     hôm nay trống thì mười giây nữa đã có ảnh trôi qua. Vì vậy hoa chỉ đặt ở
     những dải KHÔNG BAO GIỜ có ảnh dù dải ảnh chạy tới đâu: padding đầu phần,
     và khoảng hở giữa hai album. */
  gallery: [
    { top: 4, left: 7, size: 44, rot: -14, hue: 'cam', kind: 'b' },
    { top: 3, left: 93, size: 50, rot: 18, hue: 'vang', kind: 'a' },
    { top: 54, left: 5, size: 38, rot: 12, hue: 'lam', kind: 's', sm: true },
    { top: 54, left: 95, size: 40, rot: -10, hue: 'hong', kind: 'b', sm: true },
  ],
  gift: [
    { top: 20, left: 8, size: 50, rot: -22, hue: 'cam', kind: 'a' },
    { top: 66, left: 92, size: 52, rot: 18, hue: 'vang', kind: 'a' },
    { top: 22, left: 93, size: 36, rot: 6, hue: 'lam', kind: 's' },
    { top: 72, left: 7, size: 38, rot: -10, hue: 'tim', kind: 'b' },
  ],
}

/** Số thứ tự bông `hero` tương ứng của từng bông `cover`, đúng thứ tự preset.
 *  Cover.jsx dùng bảng này để bắt cặp lúc cho hoa bay sang màn hình mở đầu. */
export const COVER_TWINS = PRESETS.cover.map((it) => it.twin)

export default function Florals({ preset, className = '' }) {
  const ref = useReveal({ threshold: 0.05 })
  useFloralScroll(ref)
  const items = PRESETS[preset] ?? []
  if (items.length === 0) return null

  return (
    <div
      ref={ref}
      aria-hidden
      className={`reveal-soft pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
    >
      {/* `--fl-scale`: cùng một bộ toạ độ, hoa đổi cỡ theo khổ máy. Giữ
          nguyên cỡ px thì trên máy tính hoa nhỏ như hạt bụi, mà trên điện
          thoại lại to quá và tràn cả ra mép - một bộ toạ độ, ba cỡ. */}
      <div
        className={`relative mx-auto h-full w-full ${SCALES[preset] ?? DEFAULT_SCALE} ${
          BOXES[preset] ?? 'max-w-none'
        }`}
      >
      {items.map((it, i) => {
        const Shape = SHAPES[it.kind] ?? BlossomA
        /* Nhịp đung đưa suy ra từ số thứ tự, nhưng bông trên bìa phải mượn số
           thứ tự của bông sinh đôi: cùng chu kỳ, cùng độ trễ thì tới lúc hạ
           cánh hai bông đang ở đúng một pha, chồng lên nhau không lệch một
           pixel. Lấy số thứ tự riêng thì đúng khoảnh khắc bìa tắt có một cái
           giật rất nhỏ. */
        const seed = it.twin ?? i
        return (
          <span
            key={i}
            data-fl={`${preset}-${i}`}
            className={`absolute block ${it.sm ? 'hidden sm:block' : ''}`}
            style={{
              top: `${it.top}%`,
              left: `${it.left}%`,
              /* `--fl-unit` mặc định 1px, nên với mọi phần khác thì đây vẫn
                 là `size px × tỉ lệ` như cũ. Riêng phong bì đổi đơn vị ấy đi. */
              width: `calc(${it.size} * var(--fl-unit, 1px) * var(--fl-scale, 1))`,
              height: `calc(${it.size} * var(--fl-unit, 1px) * var(--fl-scale, 1))`,
              /* Quãng bay đi qua BIẾN, không đi qua chuỗi transform dựng sẵn:
                 React vẽ lại là ghi đè mất thuộc tính `transform` đặt bằng
                 tay, còn biến tự đặt thì nó không đụng tới. */
              /* Ba chuyển động chồng lên nhau trong một dòng transform:
                   --fly-*   quãng bay từ bìa thiệp sang màn hình mở đầu
                   --fl-scroll x --fl-depth   quãng trôi theo trang khi cuộn
                   -50%      đưa tâm bông về đúng toạ độ
                 Quãng bay và quãng trôi đi qua BIẾN chứ không viết thẳng vào
                 chuỗi: React vẽ lại là ghi đè mất thuộc tính `transform` đặt
                 bằng tay, còn biến tự đặt thì nó không đụng tới. */
              transform:
                'translate(var(--fly-x, 0px), calc(var(--fly-y, 0px) + var(--fl-scroll, 0px) * var(--fl-depth, 1)))' +
                ' translate(-50%, -50%) scale(var(--fly-s, 1))',
              /* Bông to là bông gần, trôi nhanh hơn bông nhỏ ở xa. Chia cho 46
                 (cỡ bông trung bình) nên độ sâu rơi vào quãng 0,65-1,17. */
              '--fl-depth': (it.size / 46).toFixed(2),
            }}
          >
            {/* Lớp trong lo phần trôi; lớp ngoài lo phần định vị. Tách ra vì
                cả hai đều dùng `transform`, gộp một chỗ thì đè lên nhau. */}
            <span
              className="floral-drift block h-full w-full"
              style={{
                '--rot': `${it.rot}deg`,
                '--spin': `${(seed % 2 ? 1 : -1) * (2 + (seed % 3))}deg`,
                '--dx': `${(seed % 2 ? 1 : -1) * (3 + (seed % 4))}px`,
                '--dy': `${(seed % 3 ? -1 : 1) * (5 + (seed % 5))}px`,
                '--dur': `${16 + ((seed * 7) % 11)}s`,
                '--delay': `${(seed * 1.7) % 6}s`,
                opacity: it.opacity ?? 1,
              }}
            >
              <Shape hue={it.hue} uid={`${preset}-${i}`} />
            </span>
          </span>
        )
      })}
      </div>
    </div>
  )
}
