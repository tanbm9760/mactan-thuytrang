/**
 * Lấy bản tiếng Anh của một trường trong config, nếu có.
 *
 * Quy ước: bất kỳ trường nào trong `config` cũng có thể có một trường sinh đôi
 * tên là `<tên trường>En`. Khi khách đang xem bản tiếng Anh thì dùng bản sinh
 * đôi ấy; không khai thì dùng nguyên bản tiếng Việt.
 *
 *   hall:   'Sảnh Tầng 2'
 *   hallEn: '2nd Floor Hall'
 *
 * Chỉ dùng cho những chữ MÔ TẢ (tên sảnh, ngày âm, "nhà trai/nhà gái"...).
 * Tên người, tên địa điểm và địa chỉ thì giữ nguyên tiếng Việt ở cả hai bản -
 * khách nước ngoài còn phải đưa địa chỉ ấy cho tài xế đọc.
 */
export const local = (obj, key, language) =>
  (language === 'en' && obj?.[`${key}En`]) || obj?.[key]
