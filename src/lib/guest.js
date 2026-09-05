/**
 * Thiệp mời đích danh: thêm ?guest=Anh%20Chị%20Nam vào cuối link thì bìa thiệp
 * hiện tên khách và form RSVP tự điền sẵn. Mỗi khách một link riêng.
 *
 *   https://thiep-cuoi.com/?guest=Anh%20Ch%E1%BB%8B%20Nam
 */
const params = new URLSearchParams(window.location.search)

/** Cắt ngắn để một link nghịch ngợm không phá vỡ bố cục bìa. React tự escape
 *  nội dung nên không có nguy cơ chèn mã. */
export const guestName = (params.get('guest') ?? '').trim().replace(/\s+/g, ' ').slice(0, 60)

/** ?side=trai | gai — chọn sẵn "khách của nhà trai/nhà gái" trong form */
const side = (params.get('side') ?? '').toLowerCase()
export const guestSide = side === 'gai' || side === 'bride' ? 'bride' : side === 'trai' || side === 'groom' ? 'groom' : null
