/* ============================================================================
 *  GOOGLE APPS SCRIPT — nhận phản hồi RSVP và ghi vào Google Sheet
 *
 *  CÁCH CÀI (một lần, khoảng 3 phút):
 *   1. Tạo một Google Sheet mới (sheets.new).
 *   2. Menu Tiện ích mở rộng (Extensions) → Apps Script.
 *   3. Xoá hết code mẫu, dán TOÀN BỘ file này vào.
 *   4. Bấm Lưu (biểu tượng đĩa mềm).
 *   5. Bấm Triển khai (Deploy) → Tùy chọn triển khai mới (New deployment).
 *   6. Chọn loại: Ứng dụng web (Web app).
 *        - Thực thi với tư cách (Execute as): Tôi (Me)
 *        - Ai có quyền truy cập (Who has access): Bất kỳ ai (Anyone)   ← BẮT BUỘC
 *   7. Bấm Triển khai → Cấp quyền (Authorize access) → chọn tài khoản Google
 *      → "Nâng cao" (Advanced) → "Chuyển đến ... (không an toàn)" → Cho phép.
 *   8. Copy URL dạng https://script.google.com/macros/s/AKfy..../exec
 *   9. Dán URL đó vào `rsvp.endpoint` trong src/config.js.
 *
 *  LƯU Ý: mỗi lần sửa file này phải Triển khai lại (Deploy → Manage deployments
 *  → biểu tượng bút chì → Version: New version → Deploy) thì thay đổi mới có hiệu lực.
 * ========================================================================== */

var SHEET_NAME = 'RSVP'

var HEADERS = [
  'Thời gian',
  'Họ và tên',
  'Số điện thoại',
  'Khách của',
  'Tham dự',
  'Số người',
  'Lời chúc',
]

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents)
    var sheet = getSheet_()

    sheet.appendRow([
      new Date(),
      data.name || '',
      // Dấu nháy đầu để Sheet giữ nguyên số 0 ở đầu số điện thoại
      data.phone ? "'" + data.phone : '',
      data.side || '',
      data.attending ? 'Có' : 'Không',
      data.guests || 0,
      data.message || '',
    ])

    return json_({ ok: true })
  } catch (err) {
    return json_({ ok: false, error: String(err) })
  }
}

/** Mở trực tiếp URL để kiểm tra script đã chạy chưa */
function doGet() {
  return json_({ ok: true, message: 'RSVP endpoint đang hoạt động.' })
}

function getSheet_() {
  var book = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = book.getSheetByName(SHEET_NAME)

  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME)
  }

  // Tạo dòng tiêu đề ở lần chạy đầu tiên
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold')
    sheet.setFrozenRows(1)
    sheet.setColumnWidth(1, 160)
    sheet.setColumnWidth(7, 380)
  }

  return sheet
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  )
}
