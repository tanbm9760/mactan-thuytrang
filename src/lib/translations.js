/* ============================================================================
 *  Toàn bộ chữ nghĩa trên thiệp. Sửa tiếng Việt ở khối `vi`, tiếng Anh ở `en`.
 *  Muốn bỏ tiếng Anh: xoá khối `en` và sửa `languages` trong src/lib/i18n.jsx.
 * ========================================================================== */

export const translations = {
  vi: {
    cover: {
      inviting: 'Trân trọng kính mời',
      open: 'Chạm để mở thiệp',
    },
    schedule: {
      title: 'Chương trình ngày vui',
    },
    bands: ['Ngày vui sẽ trọn vẹn hơn nếu có bạn ở đó.'],
    nav: {
      home: 'Trang chủ',
      story: 'Chuyện chúng mình',
      details: 'Thông tin',
      gallery: 'Album',
      gift: 'Mừng cưới',
      rsvp: 'Xác nhận',
    },
    hero: {
      subtitle: 'Chúng mình sắp kết hôn',
      invite: 'Chúng mình sắp kết hôn',
      cta: 'Xác nhận tham dự',
      scroll: 'Cuộn xuống',
    },
    countdown: {
      title: 'Còn lại',
      days: 'Ngày',
      hours: 'Giờ',
      minutes: 'Phút',
      seconds: 'Giây',
      done: 'Hôm nay là ngày hạnh phúc của chúng mình!',
    },
    families: {
      title: 'Trân trọng kính mời',
      intro:
        'Sự hiện diện của quý vị là niềm vinh hạnh lớn lao đối với gia đình chúng tôi.',
      father: 'Ông',
      mother: 'Bà',
      son: 'Con trai',
      daughter: 'Con gái',
    },
    story: {
      title: 'Chuyện của chúng mình',
      subtitle: 'Bắt đầu từ những lần gặp gỡ tình cờ',
      paragraphs: [
        'Tháng 9 năm 2022, giữa rất nhiều người, chúng mình tình cờ gặp nhau khi cùng làm việc. Rồi thêm một lần tình cờ nữa, cả hai lại xuất hiện trong cùng một buổi hội nghị.',
        'Và cũng từ đó, mới biết rằng hóa ra chúng mình vẫn luôn ở rất gần nhau - gần đến mức chỉ cách nhau vài con đường, nhưng phải đến đúng thời điểm mới thật sự bước vào cuộc đời nhau.',
        'Từ những cuộc trò chuyện ban đầu, những lần gặp gỡ giản dị, chúng mình dần hiểu nhau hơn, thương nhau nhiều hơn, rồi tự nhiên trở thành một phần trong cuộc sống của nhau. Và tháng 12 năm 2022, chúng mình chính thức bắt đầu.',
        'Có lẽ tình yêu của chúng mình không bắt đầu bằng một khoảnh khắc quá ồn ào, mà được tạo nên từ rất nhiều điều nhỏ bé và những lần “vô tình” thật đẹp.',
        'Từ tháng 12 năm 2022 đến hôm nay, sau tất cả những ngày đã cùng nhau đi qua, chúng mình biết rằng người mình muốn đồng hành trong những năm tháng phía trước vẫn là người đang đứng cạnh mình lúc này.',
      ],
      closing:
        'Và hôm nay, câu chuyện ấy chính thức bước sang một chương mới - chương mang tên “gia đình”.',
    },
    details: {
      title: 'Thông tin buổi lễ',
      subtitle: 'Chúng mình mong được gặp bạn tại',
      when: 'Thời gian',
      time: 'Giờ đón khách',
      where: 'Địa điểm',
      lunar: 'Ngày âm',
      directions: 'Chỉ đường',
      addToCalendar: 'Thêm vào lịch',
      weekdays: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
      dateFormat: (d) => `${d.getDate()} tháng ${d.getMonth() + 1}, ${d.getFullYear()}`,
      timeFormat: (d) => {
        const h = d.getHours()
        const buoi = h < 11 ? 'Sáng' : h < 13 ? 'Trưa' : h < 18 ? 'Chiều' : 'Tối'
        const gio12 = h % 12 === 0 ? 12 : h % 12
        return `${gio12}:${String(d.getMinutes()).padStart(2, '0')} ${buoi}`
      },
    },
    gallery: {
      title: 'Khoảnh khắc',
      subtitle: 'Một vài kỷ niệm của chúng mình',
      empty: 'Album ảnh sẽ được cập nhật sớm.',
      prev: 'Ảnh trước',
      next: 'Ảnh sau',
      close: 'Đóng',
      viewLarger: 'Xem ảnh lớn',
    },
    gift: {
      title: 'Hộp mừng cưới',
      desc: 'Sự hiện diện của bạn trong ngày vui đã là món quà quý giá nhất đối với chúng mình. Nếu bạn muốn gửi thêm một lời chúc, chúng mình xin phép để mã QR bên dưới.',
      groomBtn: 'Mừng cưới nhà trai',
      brideBtn: 'Mừng cưới nhà gái',
      scanHint: 'Quét mã QR bằng ứng dụng ngân hàng',
      copy: 'Sao chép số tài khoản',
      copied: 'Đã sao chép!',
      noQr: 'Chưa có mã QR. Hãy bỏ ảnh vào thư mục src/assets/qr/',
    },
    rsvp: {
      title: 'Bạn sẽ đến chứ?',
      subtitle: (d) =>
        `Vui lòng phản hồi trước ngày ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`,
      nameLabel: 'Họ và tên',
      namePlaceholder: 'Nguyễn Văn A',
      phoneLabel: 'Số điện thoại',
      phonePlaceholder: '09xx xxx xxx',
      sideLabel: 'Bạn là khách mời của',
      sideGroom: 'Nhà trai',
      sideBride: 'Nhà gái',
      attendingLabel: 'Bạn có tham dự được không?',
      accept: 'Chắc chắn có mặt',
      decline: 'Rất tiếc, mình không đến được',
      guestsLabel: 'Số người tham dự (tính cả bạn)',
      messageLabel: 'Lời chúc gửi cô dâu chú rể (không bắt buộc)',
      messagePlaceholder: 'Chúc hai bạn trăm năm hạnh phúc!',
      submit: 'Gửi xác nhận',
      submitting: 'Đang gửi...',
      successTitle: 'Cảm ơn bạn rất nhiều!',
      successDesc: 'Chúng mình đã nhận được phản hồi. Rất mong chờ được gặp bạn trong ngày vui!',
      again: 'Gửi phản hồi khác',
      errorTitle: 'Gửi không thành công',
      errorDesc: 'Bạn thử lại giúp mình nhé, hoặc nhắn trực tiếp cho cô dâu chú rể.',
      required: 'Vui lòng điền thông tin này',
      nameTooShort: 'Tên phải có ít nhất 2 ký tự',
      phoneInvalid: 'Số điện thoại chưa hợp lệ',
      notConfigured:
        'Form chưa được kết nối. Xem mục "Kết nối Google Sheets" trong README.md.',
    },
    footer: {
      thanks: 'Cảm ơn bạn đã là một phần trong câu chuyện của chúng mình.',
      contact: 'Liên hệ',
      groom: 'Chú rể',
      bride: 'Cô dâu',
    },
    music: { play: 'Bật nhạc', pause: 'Tắt nhạc' },
  },

  en: {
    cover: {
      inviting: 'You are warmly invited',
      open: 'Tap to open',
    },
    schedule: {
      title: 'Schedule of the day',
    },
    bands: ['The day will be complete with you there.'],
    nav: {
      home: 'Home',
      story: 'Our Story',
      details: 'Details',
      gallery: 'Gallery',
      gift: 'Gift',
      rsvp: 'RSVP',
    },
    hero: {
      subtitle: 'Save the date',
      invite: 'We are getting married',
      cta: 'RSVP Now',
      scroll: 'Scroll',
    },
    countdown: {
      title: 'Counting down',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
      done: 'Today is our big day!',
    },
    families: {
      title: 'Together with our families',
      intro: 'We would be honoured by your presence on our wedding day.',
      father: 'Mr.',
      mother: 'Mrs.',
      son: 'Son of',
      daughter: 'Daughter of',
    },
    story: {
      title: 'Our Story',
      subtitle: 'It began with a series of happy accidents',
      paragraphs: [
        'In September 2022, among a great many people, we happened to meet while working together. Then, by chance again, we both turned up at the same conference.',
        'That was when we found out we had been living close to each other all along - only a few streets apart - but it took the right moment for us to truly step into each other\'s lives.',
        'From those first conversations and simple meetings, we came to understand each other more, to love each other more, and quite naturally became part of each other\'s lives. And in December 2022, we began, for real.',
        'Perhaps our love did not begin with any loud, dramatic moment. It was made of many small things, and of a few beautiful accidents.',
        'From December 2022 until today, after everything we have walked through together, we know that the person we want beside us for the years ahead is the one standing beside us right now.',
      ],
      closing:
        'And today, that story turns to a new chapter - one called “family”.',
    },
    details: {
      title: 'The Details',
      subtitle: 'We would love to see you at',
      when: 'When',
      time: 'Reception',
      where: 'Where',
      lunar: 'Lunar date',
      directions: 'Get Directions',
      addToCalendar: 'Add to Calendar',
      weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dateFormat: (d) =>
        d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      timeFormat: (d) =>
        d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    },
    gallery: {
      title: 'Moments',
      subtitle: 'A few of our favourite memories',
      empty: 'Photos coming soon.',
      prev: 'Previous photo',
      next: 'Next photo',
      close: 'Close',
      viewLarger: 'View larger',
    },
    gift: {
      title: 'Gift',
      desc: 'Your presence at our wedding is the greatest gift of all. If you would still like to send us your best wishes, we have included our QR codes below.',
      groomBtn: "Groom's family",
      brideBtn: "Bride's family",
      scanHint: 'Scan this QR code with your banking app',
      copy: 'Copy account number',
      copied: 'Copied!',
      noQr: 'No QR code yet. Drop an image into src/assets/qr/',
    },
    rsvp: {
      title: 'Will you join us?',
      subtitle: (d) =>
        `Kindly reply before ${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      nameLabel: 'Full name',
      namePlaceholder: 'Jane Doe',
      phoneLabel: 'Phone number',
      phonePlaceholder: '09xx xxx xxx',
      sideLabel: 'You are a guest of',
      sideGroom: "The groom's family",
      sideBride: "The bride's family",
      attendingLabel: 'Will you be attending?',
      accept: 'Joyfully accepts',
      decline: 'Regretfully declines',
      guestsLabel: 'Number of guests (including you)',
      messageLabel: 'Leave a message for the couple (optional)',
      messagePlaceholder: "Can't wait to celebrate with you!",
      submit: 'Send RSVP',
      submitting: 'Sending...',
      successTitle: 'Thank you so much!',
      successDesc: "We have received your response. We can't wait to see you!",
      again: 'Send another response',
      errorTitle: 'Something went wrong',
      errorDesc: 'Please try again, or message the couple directly.',
      required: 'This field is required',
      nameTooShort: 'Please enter at least 2 characters',
      phoneInvalid: 'That phone number does not look right',
      notConfigured:
        'The form is not connected yet. See "Kết nối Google Sheets" in README.md.',
    },
    footer: {
      thanks: 'Thank you for being part of our story.',
      contact: 'Contact',
      groom: 'Groom',
      bride: 'Bride',
    },
    music: { play: 'Play music', pause: 'Pause music' },
  },
}

export const languages = [
  { code: 'vi', label: 'VI', name: 'Tiếng Việt' },
  { code: 'en', label: 'EN', name: 'English' },
]
