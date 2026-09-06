import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../lib/i18n'
import { config, orderedNames } from '../config'
import { guestName } from '../lib/guest'
import Monogram from './Monogram'
import Florals, { COVER_TWINS } from './Florals'

const SEEN_KEY = 'wedding-cover-seen'

const pad = (n) => String(n).padStart(2, '0')

const stillPreferred = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── Nhịp của màn mở thiệp, tính bằng mili giây kể từ lúc chạm ──────────────
   Bốn nhịp, và chúng CHỒNG LÊN NHAU chứ không nối đuôi nhau: nắp còn đang
   ngả xuống thì tấm thiệp đã bắt đầu trồi lên. Đợi nhịp trước dứt hẳn mới
   chạy nhịp sau là cách một hoạt ảnh dài 2,5 giây bị cảm thấy như 5 giây.

   `flapBack` là nhịp kỹ thuật: nắp vừa lật quá 90°, phải cho nó xuống dưới
   tấm thiệp, nếu không thiệp rút lên sẽ chui ra sau lưng cái nắp đang mở. */
/* `flapBack` = 285ms không phải con số chọn bừa: nắp chờ 120ms cho dấu triện
   tan, rồi lật trong 1 giây theo đường cong cubic-bezier(0.32, 0.72, 0, 1) -
   với đường cong ấy thì 165ms sau khi khởi hành là ĐÚNG lúc nắp đi qua mốc
   90°. Ngay khoảnh khắc đó nắp mỏng như một sợi chỉ, nên đổi thứ tự lớp thì
   không ai thấy được. Đổi muộn hơn thì có một quãng mặt sau của nắp nằm đè
   lên mặt trước phong bì. */
const BEATS = { flapBack: 285, card: 500, fly: 700, dissolve: 1900, done: 2860 }

/* Khách tắt hiệu ứng chuyển động thì không có nhịp nào cả: bìa không tách nắp,
   không rút thiệp, hoa không bay - cả tấm bìa mờ đi trong 0,7 giây rồi thôi.
   Trước đây vẫn chạy đủ các nhịp nhưng nén xuống một phần tư giây; đó không
   phải là ít chuyển động hơn, đó là cùng ngần ấy chuyển động nhồi vào một
   khoảnh khắc - đúng thứ mà người bật cài đặt này muốn tránh. */
const STILL_MS = 800

/**
 * Bìa thiệp - một chiếc phong bì thật, đặt trên mặt giấy ngà.
 *
 * Cùng vật liệu với tấm thiệp in của gia đình: giấy ngà, hoa màu nước rải
 * trên giấy, mực đồng, một dấu triện ở mũi nắp. Khách chạm vào thì triện mờ
 * đi, nắp phong bì ngả ra sau, tấm thiệp bên trong được rút lên - rồi chính
 * tấm thiệp ấy nở ra thành trang web.
 *
 * Bốn lớp giấy xếp chồng, đúng thứ tự của một chiếc phong bì thật:
 *
 *   .env-back    lòng phong bì, sẫm hơn mặt ngoài
 *   .env-card    tấm thiệp nằm trong đó — tên hai người ở đây
 *   .env-front   mặt trước, che tấm thiệp lại
 *   .env-flap    nắp, gập xuống đè lên mặt trước
 *
 * Tên hai người CỐ TÌNH không đặt ở mặt ngoài phong bì. Phong bì kín chỉ có
 * một dấu triện và dòng "trân trọng kính mời"; tên chỉ hiện ra khi tấm thiệp
 * được rút lên. Có vậy thì việc mở thiệp mới đáng để mở.
 *
 * Chuyển cảnh không phải một nhịp mờ dần: mười bông hoa trên mặt bàn CHÍNH LÀ
 * mười bông hoa của màn hình mở đầu. Lúc thiệp được rút ra, chúng bay tới đúng
 * ô của mình rồi trùng khít lên bông sinh đôi đang chờ sẵn dưới lớp bìa - nên
 * lúc bìa tắt, không có gì biến mất cả, chỉ có tờ giấy lui đi.
 *
 * Ngoài việc tạo nghi thức, bìa còn che đúng khoảng thời gian ảnh mở đầu
 * đang tải - khách không bao giờ thấy màn hình trống.
 *
 * Chỉ hiện một lần mỗi phiên: cuộn lại trang giữa chừng không phải mở lại.
 */
export default function Cover() {
  const { t } = useLanguage()
  const [state, setState] = useState('hidden') // hidden | shown | opening | done
  const [phase, setPhase] = useState(0) // 0 kín · 1 bật nắp · 2 rút thiệp · 3 tan
  const [flapBack, setFlapBack] = useState(false)
  const [flying, setFlying] = useState(false)
  const stageRef = useRef(null)
  const timers = useRef([])

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1'
    } catch {
      /* trình duyệt chặn storage — cứ hiện bìa */
    }
    setState(seen ? 'done' : 'shown')
  }, [])

  useEffect(() => {
    if (state !== 'shown' && state !== 'opening') return
    /* Đưa trang về đầu trước khi khoá cuộn. Mở lại tab cũ, trình duyệt có thể
       khôi phục chỗ cuộn dở - mà lúc ấy màn hình mở đầu nằm đâu đó phía trên,
       và đàn hoa sẽ bay ra ngoài khung nhìn thay vì bay về chỗ của nó. */
    window.scrollTo(0, 0)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [state])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  /* ── Cho hoa bay ────────────────────────────────────────────────────────
     Kỹ thuật FLIP: đo vị trí THẬT của bông hoa trên bìa và của bông sinh đôi
     trong màn hình mở đầu (nó đã nằm sẵn dưới lớp bìa từ lúc trang tải xong),
     rồi nhét đúng quãng lệch ấy vào ba biến --fly-*.

     Không tính bằng phần trăm được, vì hai lớp hoa không cùng một hệ toạ độ:
     lớp của bìa bị kẹp trong khung 62rem, lớp của màn mở đầu thì tràn khung;
     một bên đo theo chiều cao khung nhìn, một bên đo theo `svh`; cỡ bông một
     bên tính từ bề ngang phong bì, một bên tính theo khổ máy. Đo thẳng trên
     DOM thì mọi khác biệt ấy tự triệt tiêu, kể cả quãng trôi khi cuộn.

     Đo Ở THẺ NGOÀI (thẻ mang data-fl), không đo thẻ trong: thẻ trong đang
     chạy hoạt ảnh đung đưa, đo vào đó là lấy phải vị trí tức thời của nó. */
  useEffect(() => {
    if (!flying || !stageRef.current) return

    COVER_TWINS.forEach((heroIndex, i) => {
      const from = stageRef.current.querySelector(`[data-fl="cover-${i}"]`)
      const to = document.querySelector(`[data-fl="hero-${heroIndex}"]`)
      if (!from || !to) return

      const a = from.getBoundingClientRect()
      const b = to.getBoundingClientRect()
      if (!a.width || !b.width) return /* bông bị ẩn ở khổ máy này */

      from.style.setProperty('--fly-x', `${b.left + b.width / 2 - (a.left + a.width / 2)}px`)
      from.style.setProperty('--fly-y', `${b.top + b.height / 2 - (a.top + a.height / 2)}px`)
      from.style.setProperty('--fly-s', `${b.width / a.width}`)
      /* So le nhau một chút, và bông ở xa đi trước - đàn hoa mở ra như một
         nhịp thở chứ không bật cùng một lúc như một hiệu ứng. */
      from.style.setProperty('--fly-delay', `${i * 35}ms`)
    })
  }, [flying])

  const open = () => {
    if (state !== 'shown') return
    setState('opening')
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* bỏ qua */
    }

    if (stillPreferred()) {
      /* Nhảy thẳng tới nhịp cuối. Các biến chuyển động bị khoá lại ở
         @media (prefers-reduced-motion) nên chỉ còn độ mờ chạy. */
      setPhase(3)
      timers.current = [setTimeout(() => setState('done'), STILL_MS)]
      return
    }

    setPhase(1)
    timers.current = [
      setTimeout(() => setFlapBack(true), BEATS.flapBack),
      setTimeout(() => setPhase(2), BEATS.card),
      setTimeout(() => setFlying(true), BEATS.fly),
      setTimeout(() => setPhase(3), BEATS.dissolve),
      setTimeout(() => setState('done'), BEATS.done),
    ]
  }

  if (state === 'hidden' || state === 'done') return null

  const opening = state === 'opening'
  const date = config.weddingDate
  const dateStr = `${pad(date.getDate())} · ${pad(date.getMonth() + 1)} · ${date.getFullYear()}`

  return (
    <div
      ref={stageRef}
      className={[
        'cover-stage fixed inset-0 z-200 flex flex-col items-center justify-center gap-[clamp(2.25rem,7vh,4.5rem)] overflow-hidden',
        phase >= 1 && 'is-open',
        phase >= 2 && 'is-out',
        phase >= 3 && 'is-gone',
        flapBack && 'flap-back',
      ]
        .filter(Boolean)
        .join(' ')}
      role={opening ? undefined : 'button'}
      tabIndex={opening ? -1 : 0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          open()
        }
      }}
      aria-label={t('cover.open')}
    >
      {/* Hoa trên mặt bàn, quanh phong bì - và cũng chính là hoa của màn hình
          mở đầu, xem COVER_TWINS trong Florals.jsx. */}
      <Florals preset="cover" />

      <div className="cover-env">
        <div aria-hidden className="env-sheet env-back" />

        {/* Tấm thiệp bên trong. Chữ dồn lên nửa trên vì lúc được rút ra thì
            phần dưới vẫn còn nằm trong phong bì - viết xuống dưới là viết vào
            chỗ không ai đọc được. */}
        <div className="env-sheet env-card">
          <div aria-hidden className="absolute inset-[5.5%] border border-gold/25" />
          <div className="env-card-ink absolute inset-x-0 top-0 flex flex-col items-center px-[10%] pt-[13%] text-center">
            <p className="t-display env-name text-primary italic">{orderedNames[0]}</p>
            <p className="env-amp my-[1.5%] font-serif text-gold italic">&amp;</p>
            <p className="t-display env-name text-primary italic">{orderedNames[1]}</p>
            <div aria-hidden className="my-[6%] h-px w-[18%] bg-gold/55" />
            <p className="env-date text-muted-foreground">{dateStr}</p>
          </div>
        </div>

        {/* Mặt trước phong bì: hoa in trên giấy, một dòng đề, và dòng kính mời
            có nét chấm chấm để điền tên - đúng như phong bì in của gia đình. */}
        <div className="env-sheet env-front">
          <Florals preset="envelope" />

          {/* Bắt đầu ở 62% chứ không phải ở mũi nắp (47%): dấu triện tròn đè
              xuống quá mũi nắp một quãng, chữ đặt sát mũi sẽ chui vào gầm triện. */}
          <div className="absolute inset-x-[9%] top-[62%] bottom-[7%] flex flex-col items-center justify-between text-center">
            <p className="env-label text-foreground/75">{t('cover.ceremony')}</p>

            <div className="w-full">
              <p className="env-label text-muted-foreground/70">{t('cover.inviting')}</p>
              <p className="env-guest mt-[0.45em] truncate border-b border-dotted border-foreground/25 pb-[0.3em] font-serif text-foreground/85 italic">
                {guestName || ' '}
              </p>
            </div>
          </div>
        </div>

        {/* Nắp phong bì. Giấy nằm ở lớp con để cái bóng đổ không bị chính
            đường cắt tam giác xén mất — xem ghi chú trong index.css. */}
        <div className="env-flap">
          <div aria-hidden className="env-flap-paper" />
          <div className="env-seal">
            <Monogram size={100} tone="gold" className="h-[56%] w-[56%]" />
          </div>
        </div>
      </div>

      {/* Dòng mời chạm đi liền dưới phong bì trong cùng một cột, KHÔNG neo vào
          đáy màn hình: neo đáy thì trên máy tính nó rơi xuống tận mép dưới, cách
          chiếc phong bì gần hai trăm pixel và thành một dòng chữ mồ côi. */}
      <div className="cover-hint text-center">
        <p className="t-eyebrow breathe text-muted-foreground">{t('cover.open')}</p>
      </div>

      {/* Vân giấy riêng cho bìa: lớp vân của cả trang nằm DƯỚI bìa nên không
          nhìn thấy ở đây, mà một mặt giấy phẳng lì thì lộ ngay là màn hình.

          Không hoà trộn (mix-blend): lớp này phủ lên đúng cảnh đang chạy ba
          chiều, mà hoà trộn thì mỗi khung hình trình duyệt phải gom cả cảnh
          lại rồi trộn - đắt gấp nhiều lần một lớp mờ chồng lên bình thường. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23c)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}
