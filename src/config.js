/* ============================================================================
 *  👉 TOÀN BỘ THÔNG TIN ĐÁM CƯỚI NẰM Ở FILE NÀY. CHỈ CẦN SỬA Ở ĐÂY.
 *  Không cần đụng vào bất kỳ file nào khác.
 * ========================================================================== */

export const config = {
  /* --- Cô dâu & chú rể ---------------------------------------------------- */
  /* `name` dùng ở màn hình đầu; `fullName` dùng ở phần lời mời của hai gia
     đình, đúng như cách ghi trên thiệp in. */
  groom: { name: 'Mạc Tân', fullName: 'Bùi Mạc Tân', shortName: 'Tân', initial: 'MT' },
  bride: { name: 'Thùy Trang', fullName: 'Đỗ Thùy Trang', shortName: 'Trang', initial: 'TT' },

  /* Thứ tự hiển thị tên trên thiệp: 'groom-first' hoặc 'bride-first' */
  nameOrder: 'groom-first',

  /* --- Ngày giờ ----------------------------------------------------------- */
  /* Dùng cho đồng hồ đếm ngược và nút "Thêm vào lịch".
     Định dạng: năm, tháng-1 (0 = tháng 1), ngày, giờ, phút */
  /* Trường nào cũng có thể có một trường sinh đôi tên `<trường>En` - khi khách
     xem bản tiếng Anh thì dùng bản ấy. Xem src/lib/local.js. */
  weddingDate: new Date(2026, 8, 29, 10, 30), // ⇢ 10:30 sáng 29/09/2026
  lunarDate: 'Tức ngày 19 tháng 8 năm Bính Ngọ', // để '' nếu không muốn hiện
  lunarDateEn: 'The 19th day of the 8th lunar month, Year of Bính Ngọ',

  /* --- Địa điểm ----------------------------------------------------------- */
  venue: {
    name: 'Trung tâm Hội nghị Quốc tế',
    nameEn: 'International Convention Centre', // đúng như trên biển tên toà nhà
    subName: 'Văn phòng Chính phủ', // dòng phụ dưới tên
    subNameEn: 'Government Office',
    hall: 'Sảnh Tầng 2', // sảnh cụ thể trong toà nhà, để '' nếu không cần
    hallEn: '2nd Floor Hall',
    address: '35 Hùng Vương, Ba Đình, Hà Nội', // cổng khách vào
    city: 'Hà Nội, Việt Nam',
    cityEn: 'Hanoi, Vietnam',

    /* Để trống cả hai dòng dưới → bản đồ tự tìm theo `name` + `address` ở trên.
       Ở đây điền sẵn vì đã có link chính xác của địa điểm. */
    mapUrl: 'https://maps.app.goo.gl/r1Zcr4UcGDpbxrhJ6',
    mapEmbedUrl: 'https://www.google.com/maps?q=21.0337129,105.835005&z=17&output=embed',
  },

  /* --- Chương trình trong ngày ------------------------------------------- */
  /* Lấy từ thiệp in. Xoá cả mảng (schedule: []) nếu không muốn hiện phần này. */
  schedule: [
    {
      time: '06:30',
      vi: 'Lễ thành hôn',
      en: 'Wedding ceremony',
      viNote: 'Tại tư gia nhà trai',
      enNote: 'At the groom’s family home',
    },
    { time: '10:30', vi: 'Đón khách', en: 'Guests arrive' },
    { time: '11:00', vi: 'Khai tiệc', en: 'Reception begins' },
  ],

  /* --- Gia đình hai bên (để null nếu không muốn hiện phần này) ------------- */
  families: {
    /* `fatherLotus` / `motherLotus` đặt một bông sen nhỏ cạnh tên - quy ước
       của thiệp cưới Việt Nam cho cha mẹ đã khuất. Bỏ dòng đó đi nếu không cần. */
    groom: {
      title: 'NHÀ TRAI',
      titleEn: "THE GROOM'S FAMILY",
      father: 'Ông Bùi Trần Tuyến',
      fatherEn: 'Mr. Bùi Trần Tuyến',
      fatherLotus: true,
      mother: 'Bà Trần Thị Mai',
      motherEn: 'Mrs. Trần Thị Mai',
      address: 'P. Lĩnh Nam, Hà Nội',
    },
    bride: {
      title: 'NHÀ GÁI',
      titleEn: "THE BRIDE'S FAMILY",
      father: 'Ông Đỗ Thế Hường',
      fatherEn: 'Mr. Đỗ Thế Hường',
      mother: 'Bà Hoàng Thị Hồng Ánh',
      motherEn: 'Mrs. Hoàng Thị Hồng Ánh',
      address: 'P. Vĩnh Hưng, Hà Nội',
    },
  },

  /* --- Bật / tắt từng phần ------------------------------------------------ */
  sections: {
    countdown: true,
    story: true,
    families: true,
    gallery: true,
    gift: true,
    cover: true,      // bìa thiệp phải chạm để mở
    schedule: true,   // chương trình trong ngày
    photoBands: true, // dải ảnh tràn viền xen giữa các phần
    rsvp: true,
    music: false, // bật lên sau khi bỏ file nhạc vào src/assets/music/
  },

  /* --- Quà cưới (mã QR chuyển khoản) -------------------------------------- */
  /* Bỏ ảnh QR vào src/assets/qr/ và đặt tên có chữ "groom" / "bride"
     ví dụ: qr-groom.jpg, qr-bride.png */
  gift: {
    groom: { label: 'Mừng cưới nhà trai', bank: 'Vietcombank', account: '0123456789', holder: 'BUI MAC TAN' },
    bride: { label: 'Mừng cưới nhà gái', bank: 'Techcombank', account: '9876543210', holder: 'DO THUY TRANG' },
  },

  /* --- Form xác nhận tham dự (RSVP) --------------------------------------- */
  rsvp: {
    /* Dán URL Web App của Google Apps Script vào đây.
       Hướng dẫn lấy URL: xem file README.md, mục "Kết nối Google Sheets". */
    endpoint:
      'https://script.google.com/macros/s/AKfycbxmKteLt7lFj606bu12Es1gSiYnOnymG6YK7I4JLHf1LenGkw8-BWiPzF2lrF55YApd_g/exec',
    deadline: new Date(2026, 8, 15), // hạn phản hồi: 15/09/2026
    maxGuests: 6,
  },

  /* --- Liên hệ nhanh (hiện ở footer) -------------------------------------- */
  /* Tách nhóm cho dễ đọc; nút gọi tự bỏ khoảng trắng khi bấm. */
  contact: {
    groomPhone: '0964 359 384',
    bridePhone: '0984 289 451',
  },

  /* --- Gallery: tên hiển thị cho từng album ------------------------------- */
  /* Key = tên thư mục con trong src/assets/gallery/
     Ảnh để thẳng trong src/assets/gallery/ sẽ thuộc album "default". */
  /* Thứ tự khai ở đây là thứ tự album hiện trên thiệp.
     Tên album KHÔNG hiện ra ngoài — hai bộ ảnh chỉ ngăn nhau bằng một dấu
     mảnh. Tên chỉ dùng cho trình đọc màn hình (aria-label). */
  albums: {
    studio: { vi: 'Trong studio', en: 'In the studio' },
    'ngoai-canh': { vi: 'Ngoại cảnh bên hồ', en: 'By the lake' },
  },
}

/* Tên đã sắp xếp theo nameOrder — dùng nội bộ, không cần sửa */
export const orderedNames =
  config.nameOrder === 'bride-first'
    ? [config.bride.name, config.groom.name]
    : [config.groom.name, config.bride.name]

export const coupleNames =
  config.nameOrder === 'bride-first'
    ? `${config.bride.name} & ${config.groom.name}`
    : `${config.groom.name} & ${config.bride.name}`

export const coupleInitials =
  config.nameOrder === 'bride-first'
    ? `${config.bride.initial} & ${config.groom.initial}`
    : `${config.groom.initial} & ${config.bride.initial}`
