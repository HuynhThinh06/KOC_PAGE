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

      // Tự động gửi email chào mừng và xác nhận cho khách hàng
      if (data.email && data.email.indexOf("@") !== -1) {
        try {
          sendNewsletterWelcomeEmail(data.email);
        } catch (mailErr) {
          console.error("Lỗi gửi email tự động:", mailErr);
        }
      }
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


// ==================== TỰ ĐỘNG GỬI EMAIL CHÀO MỪNG BẢN TIN ====================

// ==================== TỰ ĐỘNG GỬI EMAIL CHÀO MỪNG BẢN TIN ====================
// Sử dụng giao diện Pure HTML & CSS cao cấp (không dùng thẻ <img> ngoài)
// Đảm bảo 100% hiển thị hoàn hảo, không bao giờ bị Gmail chặn hay lỗi ảnh!
function sendNewsletterWelcomeEmail(recipientEmail) {
  var subject = "🌿 [THORAKAO] Khám Phá Chiến Dịch Giữ Nếp Xưa - Tỏ Nếp Mình";
  var htmlBody = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="vi">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Khám Phá Chiến Dịch Giữ Nếp Xưa - Tỏ Nếp Mình | Thorakao</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4efe6; font-family: 'Segoe UI', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <center style="width: 100%; background-color: #f4efe6; padding: 25px 0;">
    <!-- Container 600px -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e8dfd3;">
      
      <!-- 1. HEADER: BRAND LOGO BANNER (PURE HTML/CSS) -->
      <tr>
        <td align="center" style="background-color: #ffffff; padding: 25px 20px 20px; border-bottom: 3px solid #ad402e;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center">
                <div style="display: inline-block; background-color: #ad402e; color: #ffc800; font-weight: 900; font-size: 26px; letter-spacing: 3px; padding: 8px 24px; border-radius: 6px; font-family: 'Georgia', serif; text-transform: uppercase;">
                  THORAKAO
                </div>
                <div style="font-size: 11px; letter-spacing: 2px; color: #ad402e; font-weight: bold; margin-top: 6px; text-transform: uppercase;">
                  Mỹ Phẩm Lan Hảo • Từ Năm 1961
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- 2. CAMPAIGN HERO BANNER (PURE HTML/CSS) -->
      <tr>
        <td align="center" style="background: linear-gradient(135deg, #ad402e 0%, #8a2a1a 100%); background-color: #ad402e; padding: 35px 25px; color: #ffffff;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center">
                <span style="display: inline-block; background-color: #ffc800; color: #ad402e; font-size: 12px; font-weight: 800; letter-spacing: 1.5px; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; margin-bottom: 12px;">
                  CHIẾN DỊCH ĐẶC BIỆT
                </span>
                <h1 style="margin: 8px 0 10px; font-size: 26px; line-height: 1.3; font-weight: 900; color: #ffc800; letter-spacing: 1px; font-family: 'Georgia', serif;">
                  GIỮ NẾP XƯA – TỎ NẾP MÌNH
                </h1>
                <p style="margin: 0; font-size: 16px; color: #fff8eb; font-style: italic; letter-spacing: 0.5px;">
                  "Giữ Hương Tóc Xưa, Bật Nét Sống Mới"
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- 3. WELCOME GREETING -->
      <tr>
        <td style="padding: 30px 30px 20px; background-color: #ffffff;">
          <h2 style="margin: 0 0 12px; font-size: 22px; color: #2b2b2b; font-weight: 700; text-align: center;">
            Chào mừng bạn đến với Thorakao! 🌿
          </h2>
          <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #555555; text-align: center;">
            Cùng chúng tôi khám phá những giá trị chăm sóc tóc thân quen từ trái bồ kết truyền thống, được làm mới tinh tế trong nhịp sống hiện đại.
          </p>

          <!-- CTA Button -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 25px;">
            <tr>
              <td align="center">
                <a href="https://neptocthorakao.com" target="_blank" style="display: inline-block; background-color: #ffc800; color: #ad402e; font-weight: 800; font-size: 15px; letter-spacing: 1px; text-decoration: none; padding: 14px 36px; border-radius: 8px; border: 2px solid #e0aa00; text-transform: uppercase; box-shadow: 0 3px 8px rgba(173,64,46,0.2);">
                  👉 KHÁM PHÁ CHIẾN DỊCH NGAY
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- DIVIDER -->
      <tr>
        <td style="padding: 0 30px;">
          <hr style="border: 0; border-top: 1px dashed #d9cfc1; margin: 15px 0;" />
        </td>
      </tr>

      <!-- 4. PRODUCT FEATURE CARD (PURE HTML/CSS) -->
      <tr>
        <td style="padding: 20px 30px;">
          <div style="background-color: #fff9f0; border: 2px solid #f3e0c4; border-radius: 10px; padding: 22px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <span style="background-color: #ad402e; color: #ffffff; font-size: 11px; font-weight: bold; padding: 3px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                    ⭐ SẢN PHẨM TRỌNG TÂM
                  </span>
                  <h3 style="margin: 10px 0 6px; font-size: 19px; color: #ad402e; font-weight: 800;">
                    Dầu Gội Bồ Kết Thorakao 750ml
                  </h3>
                  <p style="margin: 0 0 14px; font-size: 14px; color: #666666; line-height: 1.5;">
                    Kết tinh từ trái bồ kết thiên nhiên giàu Saponin và Flavonoid, giúp làm sạch êm dịu, thông thoáng da đầu, sạch gàu ngứa và nuôi dưỡng nang tóc đen mượt chắc khỏe.
                  </p>

                  <!-- Specs Grid -->
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 8px; padding: 12px; border: 1px solid #fae8d0;">
                    <tr>
                      <td style="padding: 6px 10px; font-size: 13px; color: #444444;">
                        🧴 <strong>Quy cách:</strong> Chai lớn tiết kiệm 750ml
                      </td>
                      <td align="right" style="padding: 6px 10px; font-size: 15px; color: #ad402e; font-weight: bold;">
                        Giá: 113.000₫
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding: 4px 10px; font-size: 13px; color: #2d5a27;">
                        🚚 <strong>Ưu đãi:</strong> Miễn phí vận chuyển toàn quốc khi mua từ 2 chai!
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>
          </div>
        </td>
      </tr>

      <!-- 5. STORY CARD: "THỬ MÓN MẸ TỪNG DÙNG" -->
      <tr>
        <td style="padding: 10px 30px 25px;">
          <div style="background-color: #faf5ee; border-left: 4px solid #ad402e; border-radius: 4px; padding: 18px 20px;">
            <h4 style="margin: 0 0 8px; font-size: 16px; color: #ad402e; font-weight: 800;">
              ✨ Câu chuyện: "Thử món mẹ từng dùng"
            </h4>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #555555; font-style: italic;">
              "Ngày bé, có lẽ ai trong chúng ta cũng từng được mẹ chăm sóc mái tóc bằng nước bồ kết ấm nồng. Với Thorakao, hương thơm mộc mạc thân quen ấy được tái hiện tiện lợi trong chai 750ml hiện đại, giúp bạn tìm lại ký ức dịu dàng bên mẹ giữa nhịp sống bận rộn."
            </p>
          </div>
        </td>
      </tr>

      <!-- 6. SOCIAL NETWORK LINKS (STYLISH CSS BUTTONS) -->
      <tr>
        <td align="center" style="background-color: #ffc800; padding: 22px 20px;">
          <div style="font-size: 13px; font-weight: 800; color: #ad402e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
            KẾT NỐI VỚI THORAKAO TRÊN MẠNG XÃ HỘI
          </div>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
            <tr>
              <td style="padding: 0 5px;">
                <a href="https://www.facebook.com/neptoc.thorakao" target="_blank" style="display: inline-block; background-color: #1877f2; color: #ffffff; font-size: 12px; font-weight: bold; text-decoration: none; padding: 7px 14px; border-radius: 4px;">
                  Facebook
                </a>
              </td>
              <td style="padding: 0 5px;">
                <a href="https://www.threads.com/@neptoc.thorakao" target="_blank" style="display: inline-block; background-color: #000000; color: #ffffff; font-size: 12px; font-weight: bold; text-decoration: none; padding: 7px 14px; border-radius: 4px;">
                  Threads
                </a>
              </td>
              <td style="padding: 0 5px;">
                <a href="https://www.tiktok.com/@neptoc.thorakao" target="_blank" style="display: inline-block; background-color: #010101; color: #ffffff; font-size: 12px; font-weight: bold; text-decoration: none; padding: 7px 14px; border-radius: 4px;">
                  TikTok
                </a>
              </td>
              <td style="padding: 0 5px;">
                <a href="https://neptocthorakao.com" target="_blank" style="display: inline-block; background-color: #ad402e; color: #ffffff; font-size: 12px; font-weight: bold; text-decoration: none; padding: 7px 14px; border-radius: 4px;">
                  Website
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- 7. FOOTER INFORMATION -->
      <tr>
        <td align="center" style="background-color: #8a2a1a; padding: 22px 25px; color: #ffffff;">
          <p style="margin: 0 0 6px; font-size: 12px; line-height: 1.5; color: #ffd6cc;">
            <strong>Công ty TNHH Sản Xuất Mỹ Phẩm Lan Hảo</strong><br />
            241bis Cách Mạng Tháng Tám, Phường Bàn Cờ, TP. Hồ Chí Minh<br />
            Hotline: 028 8887 3241 • Email: info@thorakao.com
          </p>
          <p style="margin: 12px 0 0; font-size: 11px; color: #e0998a;">
            Bạn nhận được email này vì đã đăng ký bản tin tại website Nếp Tóc Thorakao.<br />
            <a href="mailto:neptocthorakao@gmail.com?subject=Huy%20dang%20ky" style="color: #ffc800; text-decoration: underline;">Hủy đăng ký</a>
          </p>
        </td>
      </tr>

    </table>
  </center>
</body>
</html>
`;

  MailApp.sendEmail({
    to: recipientEmail,
    subject: subject,
    htmlBody: htmlBody,
    bcc: "neptocthorakao@gmail.com"
  });
}
