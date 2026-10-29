/**
 * GOOGLE APPS SCRIPT WEBHOOK CHO WEBSITE "NẾP TÓC THORAKAO"
 * Tự động tiếp nhận Đơn Hàng (Orders), Form Liên Hệ (Contact) và Đăng Ký Bản Tin (Newsletter).
 * 
 * Hướng dẫn triển khai trong 1 phút:
 * 1. Mở https://sheets.new tạo một Google Sheet mới.
 * 2. Chọn Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Xóa toàn bộ nội dung cũ trong Editor và dán toàn bộ file này vào.
 * 4. Nhấn biểu tượng Lưu (Ctrl + S).
 * 5. Nhấn "Triển khai" (Deploy) -> "Triển khai dưới dạng ứng dụng web mới" (New deployment).
 *    - Mô tả: Thorakao Webhook v1
 *    - Thực thi dưới dạng (Execute as): Tôi (My account)
 *    - Người có quyền truy cập (Who has access): Bất kỳ ai (Anyone)
 * 6. Nhấn "Triển khai" và cấp quyền khi được hỏi.
 * 7. Sao chép URL Ứng dụng web (Web App URL dạng: https://script.google.com/macros/s/.../exec)
 *    và dán vào file assets/js/config.js (biến GOOGLE_SHEET_WEBHOOK_URL).
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Khóa script trong 10 giây để tránh xung đột ghi đè dòng khi nhiều khách gửi cùng lúc
  lock.tryLock(10000);
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var contents = e.postData.contents;
    var data = JSON.parse(contents);
    var now = Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss");

    // 1. XỬ LÝ ĐƠN HÀNG (ORDER)
    if (data.type === "ORDER") {
      var sheet = ss.getSheetByName("DonHang");
      if (!sheet) {
        sheet = ss.insertSheet("DonHang");
        sheet.appendRow([
          "Thời Gian", 
          "Mã Đơn", 
          "Họ Tên", 
          "Số Điện Thoại", 
          "Địa Chỉ Nhận Hàng", 
          "Sản Phẩm", 
          "Số Lượng", 
          "Tạm Tính", 
          "Phí Vận Chuyển", 
          "Tổng Thanh Toán", 
          "Phương Thức TT", 
          "Ghi Chú"
        ]);
        sheet.getRange("A1:L1").setFontWeight("bold").setBackground("#B23A48").setFontColor("#FFFFFF");
        sheet.setFrozenRows(1);
      }
      
      sheet.appendRow([
        now,
        data.orderId || "",
        data.fullName || "",
        data.phone || "",
        data.address || "",
        data.productName || "Dầu Gội Bồ Kết Thorakao 750ml",
        data.quantity || 1,
        data.subtotal ? formatMoney(data.subtotal) : "",
        data.shippingFee === 0 ? "Miễn phí" : formatMoney(data.shippingFee),
        data.totalPrice ? formatMoney(data.totalPrice) : "",
        data.paymentMethod || "COD (Thanh toán khi nhận hàng)",
        data.note || ""
      ]);

    // 2. XỬ LÝ LIÊN HỆ (CONTACT)
    } else if (data.type === "CONTACT") {
      var sheet = ss.getSheetByName("LienHe");
      if (!sheet) {
        sheet = ss.insertSheet("LienHe");
        sheet.appendRow([
          "Thời Gian", 
          "Họ", 
          "Tên", 
          "Họ Và Tên",
          "Email", 
          "Chủ Đề", 
          "Nội Dung Tin Nhắn"
        ]);
        sheet.getRange("A1:G1").setFontWeight("bold").setBackground("#4A6B53").setFontColor("#FFFFFF");
        sheet.setFrozenRows(1);
      }
      
      sheet.appendRow([
        now,
        data.lastName || "",
        data.firstName || "",
        (data.lastName ? data.lastName + " " : "") + (data.firstName || ""),
        data.email || "",
        data.subject || "Chung",
        data.message || ""
      ]);

    // 3. XỬ LÝ ĐĂNG KÝ BẢN TIN (NEWSLETTER)
    } else if (data.type === "NEWSLETTER") {
      var sheet = ss.getSheetByName("BanTin");
      if (!sheet) {
        sheet = ss.insertSheet("BanTin");
        sheet.appendRow([
          "Thời Gian", 
          "Email Đăng Ký",
          "Nguồn"
        ]);
        sheet.getRange("A1:C1").setFontWeight("bold").setBackground("#C08552").setFontColor("#FFFFFF");
        sheet.setFrozenRows(1);
      }
      
      sheet.appendRow([
        now,
        data.email || "",
        data.source || "Footer Website"
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Data recorded successfully" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function formatMoney(num) {
  if (typeof num === "number") {
    return num.toLocaleString("vi-VN") + "₫";
  }
  return num;
}
