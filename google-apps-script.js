/**
 * GOOGLE APPS SCRIPT WEBHOOK CHO WEBSITE "NẾP TÓC THORAKAO"
 * Tự động tiếp nhận:
 * 1. Đơn Hàng (DonHang)
 * 2. Form Liên Hệ (LienHe)
 * 3. Đăng Ký Bản Tin (BanTin)
 * 4. Chatbot Tư Vấn AI (Gemini 2.0 Flash Proxy thông minh)
 * 
 * HƯỚNG DẪN CẤU HÌNH TRONG 2 PHÚT (XEM HUONG-DAN-CHATBOT-AI.md):
 * 1. Mở file Google Sheet quản lý của bạn -> Tiện ích mở rộng (Extensions) -> Apps Script.
 * 2. Dán toàn bộ nội dung file này vào Editor.
 * 3. Điền GEMINI_API_KEY của bạn vào biến GEMINI_API_KEY bên dưới (hoặc vào Project Settings -> Script Properties).
 *    (Lấy key miễn phí trong 30s tại: https://aistudio.google.com/app/apikey)
 * 4. Nhấn Lưu (Ctrl + S) -> Triển khai (Deploy) -> Quản lý bản triển khai (Manage deployments)
 *    -> Chỉnh sửa (Edit) -> Phiên bản mới (New version) -> Triển khai.
 */

// ==================== CẤU HÌNH API KEY ====================
// Dán Gemini API Key của bạn vào giữa 2 dấu ngoặc kép bên dưới:
var GEMINI_API_KEY = ""; 

function getGeminiApiKey() {
  if (GEMINI_API_KEY && GEMINI_API_KEY.trim() !== "") {
    return GEMINI_API_KEY.trim();
  }
  try {
    var key = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
    if (key) return key.trim();
  } catch (e) {}
  return "";
}

// ==================== HÀM TIẾP NHẬN YÊU CẦU GET ====================
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: "online", 
      message: "Webhook Nếp Tóc Thorakao đang hoạt động!", 
      features: ["ORDER", "CONTACT", "NEWSLETTER", "CHATBOT_AI"],
      geminiConfigured: !!getGeminiApiKey()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==================== HÀM TIẾP NHẬN YÊU CẦU POST ====================
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var contents = e.postData.contents;
    var data = JSON.parse(contents);
    var now = Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss");

    // ----------------------------------------------------
    // 1. XỬ LÝ CHATBOT TƯ VẤN BẰNG GEMINI AI
    // ----------------------------------------------------
    if (data.type === "CHATBOT") {
      var userMsg = data.message || "";
      if (!userMsg.trim()) {
        return ContentService
          .createTextOutput(JSON.stringify({ status: "error", message: "Tin nhắn trống" }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      var apiKey = getGeminiApiKey();
      if (!apiKey) {
        return ContentService
          .createTextOutput(JSON.stringify({ 
            status: "no_key", 
            message: "Chưa cấu hình GEMINI_API_KEY trong Google Apps Script" 
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      var aiReply = callGeminiAI(userMsg, apiKey, data.history || []);
      return ContentService
        .createTextOutput(JSON.stringify({ 
          status: "success", 
          reply: aiReply 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Các tác vụ ghi vào Google Sheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // ----------------------------------------------------
    // 2. XỬ LÝ ĐƠN HÀNG (ORDER)
    // ----------------------------------------------------
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
          "Ghi Chú",
          "Email Tài Khoản",
          "UID Tài Khoản"
        ]);
        sheet.getRange("A1:N1").setFontWeight("bold").setBackground("#B23A48").setFontColor("#FFFFFF");
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
        data.note || "",
        data.email || "",
        data.uid || ""
      ]);

    // ----------------------------------------------------
    // 3. XỬ LÝ LIÊN HỆ (CONTACT)
    // ----------------------------------------------------
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

    // ----------------------------------------------------
    // 4. XỬ LÝ ĐĂNG KÝ BẢN TIN (NEWSLETTER)
    // ----------------------------------------------------
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

// ==================== HÀM GỌI GOOGLE GEMINI AI ====================
function callGeminiAI(userMessage, apiKey, history) {
  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=" + apiKey;
  
  var systemPrompt = "Bạn là Trợ lý tư vấn AI chính thức của thương hiệu 'Nếp Tóc Thorakao'.\n"
    + "Phong cách: Thân thiện, duyên dáng, tinh tế, am hiểu về chăm sóc tóc truyền thống và hiện đại.\n"
    + "QUY TẮC BẮT BUỘC: Bạn CHỈ DỰA VÀO DỮ LIỆU CỦA WEBSITE NẾP TÓC THORAKAO DƯỚI ĐÂY để trả lời. Tuyệt đối không tự bịa đặt thông tin sai lệch ngoài dữ liệu này.\n\n"
    + "=== TOÀN BỘ DỮ LIỆU CHÍNH XÁC CỦA WEBSITE NẾP TÓC THORAKAO ===\n"
    + "1. SẢN PHẨM CHÍNH:\n"
    + "   - Tên: Dầu Gội Bồ Kết Thorakao 750ml (chai lớn tiết kiệm 750ml).\n"
    + "   - Giá niêm yết: 113.000₫ / chai.\n"
    + "   - Thương hiệu: Thorakao Việt Nam (thương hiệu mỹ phẩm lâu đời từ năm 1961, uy tín hơn 60 năm).\n"
    + "2. THÀNH PHẦN & CÔNG DỤNG BỒ KẾT:\n"
    + "   - Chiết xuất bồ kết tự nhiên nguyên chất giàu Saponin (tạo bọt làm sạch êm dịu, thông thoáng da đầu, kháng khuẩn, giảm gàu ngứa tự nhiên) và Flavonoid (chống oxy hóa, củng cố nang tóc chắc khỏe, giảm gãy rụng, giữ màu tóc đen bóng mượt).\n"
    + "   - Độ pH cân bằng lành tính, dịu êm cho da đầu, không gây khô xơ rít tóc, dùng an toàn cho mẹ bầu và phụ nữ sau sinh.\n"
    + "3. CHIẾN DỊCH KOC 'GIỮ NẾP XƯA - TỎ NẾP MÌNH':\n"
    + "   - Chuỗi video 'Thử món mẹ từng dùng', khơi gợi nét đẹp gội đầu bồ kết của bà và mẹ xưa, gắn kết tình cảm gia đình với giới trẻ hiện đại.\n"
    + "4. MINI QUIZ CHĂM SÓC 3 NHÓM TÓC:\n"
    + "   - Nhóm A (Nếp tóc thích thoáng nhẹ / Tóc dầu bết): Nên gội cách ngày hoặc hàng ngày bằng nước mát, massage kỹ da đầu, tránh bôi dầu dưỡng sát chân tóc.\n"
    + "   - Nhóm B (Nếp tóc cần nâng niu / Tóc khô xơ, chẻ ngọn do uốn nhuộm nhiệt): Gội nước ấm nhẹ/mát, dùng thêm dầu xả ở phần thân và ngọn tóc.\n"
    + "   - Nhóm C (Nếp tóc theo gu riêng / Tóc thường khỏe mạnh): Duy trì thảo mộc lành tính, che chắn khi ra nắng.\n"
    + "5. CHÍNH SÁCH VẬN CHUYỂN TOÀN QUỐC:\n"
    + "   - Đơn từ 200.000₫ trở lên (từ 2 chai trở lên): MIỄN PHÍ VẬN CHUYỂN (Freeship toàn quốc).\n"
    + "   - Đơn dưới 200.000₫ (1 chai): Phí vận chuyển tiêu chuẩn là 25.000₫ (1 chai gồm ship là 138.000₫, 2 chai freeship là 226.000₫).\n"
    + "   - Thời gian nhận hàng: TP.HCM từ 1 - 2 ngày; các tỉnh khác từ 2 - 4 ngày làm việc.\n"
    + "6. CHÍNH SÁCH ĐỔI TRẢ & THANH TOÁN:\n"
    + "   - Đổi trả linh hoạt trong 7 ngày nếu sản phẩm bị hư hỏng do vận chuyển hoặc lỗi sản xuất (vui lòng giữ nguyên hiện trạng sản phẩm).\n"
    + "   - Thanh toán: COD (nhận hàng kiểm tra xong mới trả tiền mặt) hoặc chuyển khoản.\n"
    + "7. THÔNG TIN LIÊN HỆ CHÍNH THỨC:\n"
    + "   - Địa chỉ showroom: 241 bis Cách Mạng Tháng Tám, Phường Bàn Cờ, TP. Hồ Chí Minh.\n"
    + "   - Hotline hỗ trợ: (028) 88 873 241 | Email: info@thorakao.com.\n"
    + "   - Website: https://thorakao.com | Fanpage: facebook.com/neptocthorakao | TikTok & Threads: @neptoc.thorakao.\n\n"
    + "HƯỚNG DẪN TRẢ LỜI: Trả lời ngắn gọn, súc tích (khoảng 2-4 đoạn ngắn), dùng các ký hiệu gạch đầu dòng rõ ràng. Khi khách hỏi mua hàng hoặc hỏi giá, hãy nhắc đến ưu đãi Freeship từ 2 chai.";

  var contents = [];
  
  if (Array.isArray(history) && history.length > 0) {
    var recent = history.slice(-4);
    for (var i = 0; i < recent.length; i++) {
      if (recent[i].role && recent[i].text) {
        contents.push({
          role: recent[i].role === "user" ? "user" : "model",
          parts: [{ text: String(recent[i].text) }]
        });
      }
    }
  }

  contents.push({
    role: "user",
    parts: [{ text: String(userMessage) }]
  });

  var payload = {
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: contents,
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 800
    }
  };

  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  var code = response.getResponseCode();
  if (code === 200) {
    var resData = JSON.parse(response.getContentText());
    if (resData.candidates && resData.candidates[0] && resData.candidates[0].content && resData.candidates[0].content.parts) {
      return resData.candidates[0].content.parts[0].text;
    }
    return "Dạ mình đã ghi nhận thông tin, bạn có thể tham khảo thêm tại website hoặc hotline (028) 88 873 241 nhé!";
  } else {
    throw new Error("Gemini API Error (" + code + "): " + response.getContentText());
  }
}

function formatMoney(num) {
  if (typeof num === "number") {
    return num.toLocaleString("vi-VN") + "₫";
  }
  return num;
}
