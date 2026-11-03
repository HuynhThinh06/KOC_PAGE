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
  var fnStr = typeof sendNewsletterWelcomeEmail === "function" ? sendNewsletterWelcomeEmail.toString() : "";
  var imgs = fnStr.match(/src="([^"]+)"/g) || [];
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: "online", 
      version: "v9-exact-2-column-client-layout",
      imageHost: "https://huynhthinh06.github.io/KOC_PAGE/assets/images/email/",
      imgCount: imgs.length,
      sampleImg: imgs[0] || "",
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
// Sử dụng chuẩn 100% mẫu thiết kế THORAKAO của khách hàng (2 CỘT SONG SONG: ẢNH TRÁI - CHỮ PHẢI)
function sendNewsletterWelcomeEmail(recipientEmail) {
  var subject = "Chào mừng bạn đến với Nếp Tóc Thorakao - Giữ Nếp Xưa, Tỏ Nếp Mình";

  var plainTextBody = "Chào mừng bạn đến với Thorakao!\n\n"
    + "Cùng khám phá những giá trị chăm sóc tóc thân quen được làm mới trong nhịp sống hiện đại.\n\n"
    + "GIỮ NẾP XƯA – TỎ NẾP MÌNH (Giữ Hương Tóc Xưa, Bật Nét Sống Mới)\n"
    + "- Bồ kết – Nét quen thuộc qua nhiều thế hệ: Bồ kết từ lâu đã gắn liền với thói quen chăm sóc tóc của người Việt. Thorakao mang đến dầu gội Bồ Kết 750ml, kết hợp nét truyền thống với sự tiện lợi trong cuộc sống hiện đại.\n"
    + "- Thử món mẹ từng dùng: Ngày bé, có lẽ ai cũng từng được mẹ chăm sóc tóc bằng bồ kết. Với dầu gội Bồ Kết Thorakao, hương thơm thân quen ấy được tái hiện theo cách tiện lợi hơn, giúp bạn tìm lại những ký ức dịu dàng bên mẹ.\n\n"
    + "Khám phá chiến dịch tại: https://huynhthinh06.github.io/KOC_PAGE/\n\n"
    + "Công ty TNHH Sản Xuất Mỹ Phẩm Lan Hảo\n"
    + "241bis Cách Mạng Tháng Tám, Phường Bàn Cờ, TP. HCM, Việt Nam | Hotline: 028 8887 3241";

  var htmlBody = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml" lang="en"><head>
    <title>Chào mừng bạn đến với Nếp Tóc Thorakao</title>
    
    
    
    
    
<meta name="x-apple-disable-message-reformatting">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<meta http-equiv="X-UA-Compatible" content="IE=edge">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
a.cta_button{-moz-box-sizing:content-box !important;-webkit-box-sizing:content-box !important;box-sizing:content-box !important;vertical-align:middle}.tk-breadcrumb-menu{list-style-type:none;margin:0px 0px 0px 0px;padding:0px 0px 0px 0px}.tk-breadcrumb-menu-item{float:left;padding:10px 0px 10px 10px}.tk-breadcrumb-menu-divider:before{content:'›';padding-left:10px}.tk-featured-image-link{border:0}.tk-featured-image{float:right;margin:0 0 20px 20px;max-width:50%}@media (max-width: 568px){.tk-featured-image{float:none;margin:0;width:100%;max-width:100%}}.tk-screen-reader-text{clip:rect(1px, 1px, 1px, 1px);height:1px;overflow:hidden;position:absolute !important;width:1px}
</style>


    <!--[if gte mso 9]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    <w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word">
      <w:DontUseAdvancedTypographyReadingMail/>
    </w:WordDocument>
  </xml>
  
  <style>
    ul > li {
      text-indent: -1em;
    }
  </style>
<![endif]-->
<!--[if mso]>
<style type="text/css">
 body, td {font-family: Arial, Helvetica, sans-serif;}
 .tk-body-wrapper-table {background-color: #EEEEEE;}
</style>
<![endif]-->

<!--[if mso | IE]>
  <style type="text/css">
    .tk-column-container { border: none !important; padding: 0 !important; }
  </style>
<![endif]-->

    






      

  



  














    


  <!--[if !((mso)|(IE))]><!-- --><style type="text/css">@media only print, only screen and (max-width:639px){img.stretch-on-mobile,.hs_rss_email_entries_table img,.tk-stretch-cta .tk-cta-img{height:auto !important;width:100% !important}
.display_block_on_small_screens{display:block}.tk_padded{padding-left:20px !important;padding-right:20px !important}
.tk-hm,table.tk-hm{display:none}.tk-hd{display:block !important}table.tk-hd{display:table !important}
}@media only print, only screen and (max-width:639px){.tk-border-m{border-left:1px solid #eaf0f6 !important;border-right:1px solid #eaf0f6 !important;box-sizing:border-box}
.tk-border-bottom-m{border-bottom:1px solid #eaf0f6 !important}.tk-border-top-m{border-top:1px solid #eaf0f6 !important}
.tk-border-top-hm{border-top:none !important}.tk-border-bottom-hm{border-bottom:none !important}
}.moz-text-html .tk-column-container{max-width:600px !important;width:600px !important}
.moz-text-html .tk-column{display:table-cell;vertical-align:top}.moz-text-html .tk-section .tk-size-6{max-width:300px !important;width:300px !important}
.moz-text-html .tk-section .tk-size-12{max-width:600px !important;width:600px !important}
@media only print, only screen and (min-width:640px){.tk-column-container{max-width:600px !important;width:600px !important}
.tk-column{display:table-cell;vertical-align:top}.tk-section .tk-size-6{max-width:300px !important;width:300px !important}
.tk-section .tk-size-12{max-width:600px !important;width:600px !important} }@media only print, only screen and (max-width:639px){.tk-body-wrapper-td{padding-top:20px !important}
#section-0 .tk-column-container{padding-top:10px !important;padding-bottom:10px !important}
#section-0 .tk-column-container{background-color:#fff !important} }@media only print, only screen and (max-width:639px){ #section-1 .tk-column-container{padding-top:0px !important;padding-bottom:0px !important}
#section-1 .tk-column-container{background-color:#ad402e !important} }@media only print, only screen and (max-width:639px){ #section-2 .tk-column-container{padding-top:0px !important;padding-bottom:0px !important}
#section-2 .tk-column-container{background-color:#fff !important} }@media only print, only screen and (max-width:639px){ #section-3 .tk-column-container{padding-top:0px !important;padding-bottom:0px !important}
#section-3 .tk-column-container{background-color:#ad402e !important} }@media only print, only screen and (max-width:639px){ #section-4 .tk-column-container{padding-top:10px !important;padding-bottom:10px !important}
#section-4 .tk-column-container{background-color:#fff !important} }@media only print, only screen and (max-width:639px){ #section-5 .tk-column-container{padding-top:0px !important;padding-bottom:0px !important}
#section-5 .tk-column-container{background-color:#fff !important} }@media only print, only screen and (max-width:639px){ #section-6 .tk-column-container{padding-top:0px !important;padding-bottom:0px !important}
#section-6 .tk-column-container{background-color:#fff !important} }@media only print, only screen and (max-width:639px){ #section-7 .tk-column-container{padding-top:0px !important;padding-bottom:0px !important}
#section-7 .tk-column-container{background-color:#fff !important} }@media screen and (max-width:639px){.social-network-cell{display:inline-block}
}@media only print, only screen and (max-width:639px){ #section-8 .tk-column-container{padding-top:0px !important;padding-bottom:0px !important}
#section-8 .tk-column-container{background-color:#ffc800 !important} }</style><!--<![endif]--><style type="text/css">#tk_body #tk_wrapper_main a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-family:inherit !important;font-weight:inherit !important;line-height:inherit !important}
a{text-decoration:underline}p{margin:0}body{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased;moz-osx-font-smoothing:grayscale}
table{border-spacing:0;mso-table-lspace:0;mso-table-rspace:0}table,td{border-collapse:collapse}
img{-ms-interpolation-mode:bicubic}p,a,li,td,blockquote{mso-line-height-rule:exactly}
.ShadowHTML p,.sh-modified-inline p{margin:0}</style></head>
  <body id="tk_body" bgcolor="#EEEEEE" style="margin:0 !important; padding:0 !important; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
    
    
<!--[if gte mso 9]>
<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
    <v:fill type="tile" size="100%,100%" color="#ffffff"/>
</v:background>
<![endif]-->

    <div class="tk-body-background" lang="en" style="background-color:#eeeeee" bgcolor="#eeeeee">
      <table role="presentation" class="tk-body-wrapper-table" cellpadding="0" cellspacing="0" style="margin:0; padding:0; width:100% !important; min-width:320px !important; height:100% !important" width="100%" height="100%">
        <tbody><tr>
          <td class="tk-body-wrapper-td" valign="top" style="font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding-top:20px">
            <div id="tk_wrapper_main" class="tk_wrapper tk_wrapper_widget tk_wrapper_type_dnd_area" style="color: inherit; font-size: inherit; line-height: inherit;">  <div id="section-0" class="tk-section tk-section-first" style="padding-left:10px; padding-right:10px">

    
    
      <div class="tk-column-container" style="min-width:280px; max-width:600px; margin:0 auto; background-color:#FFFFFF; padding-bottom:10px; padding-top:10px" bgcolor="#FFFFFF">
    
    <!--[if (mso)|(IE)]>
      <table align="center" style="width:600px;" cellpadding="0" cellspacing="0" role="presentation" width="600" bgcolor="#FFFFFF">
      <tr style="background-color:#FFFFFF;">
    <![endif]-->

    <!--[if (mso)|(IE)]>
  <td valign="top" style="width:600px;padding-bottom:10px; padding-top:10px;">
<![endif]-->
<!--[if gte mso 9]>
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px">
<![endif]-->
<div id="column-0-0" class="tk-column tk-size-12">
  <div id="tk_wrapper_module-0-0-0" class="tk_wrapper tk_wrapper_widget tk_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;"><table class="tk-image-wrapper" role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tbody>
    <tr>
      <td align="center" valign="top" style="font-family:Arial, sans-serif; color:#23496d; word-break:break-word; text-align:center; padding:0px; font-size:0px">
        <img alt="Logo Thorakao" src="https://huynhthinh06.github.io/KOC_PAGE/assets/images/email/tk-logo-v3.png" style="outline:none; text-decoration:none; max-width:100%; font-size:16px" width="271" align="middle">
      </td>
    </tr>
  </tbody>
</table></div>
</div>
<!--[if gte mso 9]></table><![endif]-->
<!--[if (mso)|(IE)]></td><![endif]-->

    <!--[if (mso)|(IE)]></tr></table><![endif]-->

    </div>
   
  </div>
  <div id="section-1" class="tk-section" style="padding-left:10px; padding-right:10px">
      <div class="tk-column-container" style="min-width:280px; max-width:600px; margin:0 auto; background-color:#ad402e" bgcolor="#ad402e">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%; border-collapse:collapse; table-layout:fixed;">
          <tbody>
            <tr>
              <td width="50%" valign="middle" align="center" style="padding:10px 5px; font-family:Arial, sans-serif; text-align:center;">
                <h2 style="margin:0; line-height:140%; font-size:18px; text-align:center;"><span style="color: #ffc800; font-weight:bold;">CÂU CHUYỆN BỒ KẾT</span></h2>
              </td>
              <td width="50%" valign="middle" align="center" style="padding:10px 5px; font-family:Arial, sans-serif; text-align:center;">
                <h2 style="margin:0; line-height:140%; font-size:18px; text-align:center;"><span style="color: #ffc800; font-weight:bold;">KHÁM PHÁ CHIẾN DỊCH</span></h2>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  </div>
  <div id="section-2" class="tk-section" style="padding-left:10px; padding-right:10px">

    
    
      <div class="tk-column-container" style="min-width:280px; max-width:600px; margin:0 auto; background-color:#ffffff" bgcolor="#ffffff">
    
    <!--[if (mso)|(IE)]>
      <table align="center" style="width:600px;" cellpadding="0" cellspacing="0" role="presentation" width="600" bgcolor="#ffffff">
      <tr style="background-color:#ffffff;">
    <![endif]-->

    <!--[if (mso)|(IE)]>
  <td valign="top" style="width:600px;">
<![endif]-->
<!--[if gte mso 9]>
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px">
<![endif]-->
<div id="column-2-0" class="tk-column tk-size-12">
  <div id="tk_wrapper_module-2-0-0" class="tk_wrapper tk_wrapper_widget tk_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;"><table class="tk-image-wrapper" role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tbody>
    <tr>
      <td align="center" valign="top" style="font-family:Arial, sans-serif; color:#23496d; word-break:break-word; text-align:center; padding:0px; font-size:0px">
        <img alt="Banner Chiến Dịch Thorakao" src="https://huynhthinh06.github.io/KOC_PAGE/assets/images/email/tk-banner-v3.jpg" style="outline:none; text-decoration:none; max-width:100%; font-size:16px" width="600" align="middle">
      </td>
    </tr>
  </tbody>
</table></div>
</div>
<!--[if gte mso 9]></table><![endif]-->
<!--[if (mso)|(IE)]></td><![endif]-->

    <!--[if (mso)|(IE)]></tr></table><![endif]-->

    </div>
   
  </div>
  <div id="section-3" class="tk-section" style="padding-left:10px; padding-right:10px">

    
    
      <div class="tk-column-container" style="min-width:280px; max-width:600px; margin:0 auto; background-color:#ad402e" bgcolor="#ad402e">
    
    <!--[if (mso)|(IE)]>
      <table align="center" style="width:600px;" cellpadding="0" cellspacing="0" role="presentation" width="600" bgcolor="#ad402e">
      <tr style="background-color:#ad402e;">
    <![endif]-->

    <!--[if (mso)|(IE)]>
  <td valign="top" style="width:600px;">
<![endif]-->
<!--[if gte mso 9]>
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px">
<![endif]-->
<div id="column-3-0" class="tk-column tk-size-12">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="" style=""><tbody><tr><td class="tk_padded" style="font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px"><div id="tk_wrapper_module-3-0-0" class="tk_wrapper tk_wrapper_widget tk_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;"><div id="tk_wrapper_module-3-0-0_" class="tk_wrapper tk_wrapper_widget tk_wrapper_type_rich_text" style="color: inherit; font-size: inherit; line-height: inherit;"><h1 style="margin:0; line-height:150%; font-size:28px; text-align:center" align="center"><span style="color: #ffc800;">GIỮ NẾP XƯA – TỎ NẾP MÌNH</span></h1>
<h3 style="font-size:17px; margin:0; line-height:150%; text-align:center" align="center"><span style="color: #ffc800;">Giữ Hương Tóc Xưa, Bật Nét Sống Mới</span></h3></div></div></td></tr></tbody></table>
</div>
<!--[if gte mso 9]></table><![endif]-->
<!--[if (mso)|(IE)]></td><![endif]-->

    <!--[if (mso)|(IE)]></tr></table><![endif]-->

    </div>
   
  </div>
  <div id="section-4" class="tk-section" style="padding-left:10px; padding-right:10px">

    
    
      <div class="tk-column-container" style="min-width:280px; max-width:600px; margin:0 auto; background-color:#ffffff; padding-bottom:10px; padding-top:10px" bgcolor="#ffffff">
    
    <!--[if (mso)|(IE)]>
      <table align="center" style="width:600px;" cellpadding="0" cellspacing="0" role="presentation" width="600" bgcolor="#ffffff">
      <tr style="background-color:#ffffff;">
    <![endif]-->

    <!--[if (mso)|(IE)]>
  <td valign="top" style="width:600px;padding-bottom:10px; padding-top:10px;">
<![endif]-->
<!--[if gte mso 9]>
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px">
<![endif]-->
<div id="column-4-0" class="tk-column tk-size-12">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="" style=""><tbody><tr><td class="tk_padded" style="font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px"><div id="tk_wrapper_module-4-0-0" class="tk_wrapper tk_wrapper_widget tk_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;"><div id="tk_wrapper_module-4-0-0_" class="tk_wrapper tk_wrapper_widget tk_wrapper_type_rich_text" style="color: inherit; font-size: inherit; line-height: inherit;"><h2 style="margin:0; font-size:28px; line-height:150%; text-align:center" align="center"><span style="color: #000000;">Chào mừng bạn đến với Thorakao!</span></h2>
<p style="line-height:150%; text-align:center" align="center"><span style="color: #000000;">Cùng khám phá những giá trị chăm sóc tóc thân quen được làm mới trong nhịp sống hiện đại.</span></p></div></div></td></tr></tbody></table>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="" style=""><tbody><tr><td class="tk_padded" style="font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 40px"><div id="tk_wrapper_module-4-0-1" class="tk_wrapper tk_wrapper_widget tk_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;"><table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;">
    <tbody><tr>
      <td align="center" valign="middle" bgcolor="#ffc800" style="font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; border-radius:0px; cursor:auto; background-color:#ffc800; mso-padding-alt:12px 18px">
        <a href="https://huynhthinh06.github.io/KOC_PAGE/" target="_blank" style="color:#00a4bd; font-size:21px; font-family:Helvetica,Arial,sans-serif; Margin:0; text-transform:none; letter-spacing:0px; text-decoration:none; padding:12px 18px; display:block">
          <strong style="color:#ad402e;font-weight:bold;text-decoration:none;font-style:normal;">KHÁM PHÁ CHIẾN DỊCH</strong>
        </a>
      </td>
    </tr>
  </tbody></table></div></td></tr></tbody></table>
</div>
<!--[if gte mso 9]></table><![endif]-->
<!--[if (mso)|(IE)]></td><![endif]-->

    <!--[if (mso)|(IE)]></tr></table><![endif]-->

    </div>
   
  </div>
  <div id="section-5" class="tk-section" style="padding-left:10px; padding-right:10px">

    
    
      <div class="tk-column-container" style="min-width:280px; max-width:600px; margin:0 auto; background-color:#ffffff" bgcolor="#ffffff">
    
    <!--[if (mso)|(IE)]>
      <table align="center" style="width:600px;" cellpadding="0" cellspacing="0" role="presentation" width="600" bgcolor="#ffffff">
      <tr style="background-color:#ffffff;">
    <![endif]-->

    <!--[if (mso)|(IE)]>
  <td valign="top" style="width:600px;">
<![endif]-->
<!--[if gte mso 9]>
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px">
<![endif]-->
<div id="column-5-0" class="tk-column tk-size-12">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="" style=""><tbody><tr><td class="tk_padded" style="font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px"><div id="tk_wrapper_module-5-0-0" class="tk_wrapper tk_wrapper_widget tk_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;"><div id="tk_wrapper_module-5-0-0_" class="tk_wrapper tk_wrapper_widget tk_wrapper_type_rich_text" style="color: inherit; font-size: inherit; line-height: inherit;"><h1 style="margin:0; line-height:150%; font-size:28px; text-align:center" align="center"><span style="color: #ad402e;">CÙNG THORAKAO KHÁM PHÁ</span></h1></div></div></td></tr></tbody></table>
</div>
<!--[if gte mso 9]></table><![endif]-->
<!--[if (mso)|(IE)]></td><![endif]-->

    <!--[if (mso)|(IE)]></tr></table><![endif]-->

    </div>
   
  </div>
  <div id="section-6" class="tk-section" style="padding-left:10px; padding-right:10px">
      <div class="tk-column-container" style="min-width:280px; max-width:600px; margin:0 auto; background-color:#ffffff" bgcolor="#ffffff">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%; border-collapse:collapse;">
          <tbody>
            <tr>
              <td width="46%" valign="middle" align="center" style="padding:10px 10px 10px 15px;">
                <img alt="Bồ kết truyền thống" src="https://huynhthinh06.github.io/KOC_PAGE/assets/images/email/tk-product-v3.jpg" style="outline:none; text-decoration:none; max-width:100%; width:100%; height:auto; display:block;" align="middle">
              </td>
              <td width="54%" valign="middle" align="left" style="padding:10px 15px 10px 10px; font-family:Arial, sans-serif;">
                <h2 style="margin:0 0 6px; font-size:16px; line-height:140%;"><span style="color: #000000; font-weight:bold;">Bồ kết – Nét quen thuộc qua nhiều thế hệ</span></h2>
                <div style="border-top:1px dashed #23496d; width:100%; margin:6px 0 8px;"></div>
                <p style="font-size:13px; line-height:145%; margin:0; text-align:left; color:#000000;">Bồ kết từ lâu đã gắn liền với thói quen chăm sóc tóc của người Việt. Thorakao mang đến dầu gội Bồ Kết 750ml, kết hợp nét truyền thống với sự tiện lợi trong cuộc sống hiện đại.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  </div>
  <div id="section-7" class="tk-section" style="padding-left:10px; padding-right:10px">
      <div class="tk-column-container" style="min-width:280px; max-width:600px; margin:0 auto; background-color:#ffffff" bgcolor="#ffffff">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%; border-collapse:collapse;">
          <tbody>
            <tr>
              <td width="46%" valign="middle" align="center" style="padding:10px 10px 10px 15px;">
                <img alt="Nghệ sĩ Bích Hằng" src="https://huynhthinh06.github.io/KOC_PAGE/assets/images/email/tk-artist-v3.jpg" style="outline:none; text-decoration:none; max-width:100%; width:100%; height:auto; display:block;" align="middle">
              </td>
              <td width="54%" valign="middle" align="left" style="padding:10px 15px 10px 10px; font-family:Arial, sans-serif;">
                <h2 style="margin:0 0 6px; font-size:16px; line-height:140%;"><span style="color: #000000; font-weight:bold;">Thử món mẹ từng dùng</span></h2>
                <div style="border-top:1px dashed #23496d; width:100%; margin:6px 0 8px;"></div>
                <p style="font-size:13px; line-height:145%; margin:0; text-align:left; color:#000000;">Ngày bé, có lẽ ai cũng từng được mẹ chăm sóc tóc bằng bồ kết. Với dầu gội Bồ Kết Thorakao, hương thơm thân quen ấy được tái hiện theo cách tiện lợi hơn, giúp bạn tìm lại những ký ức dịu dàng bên mẹ.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  </div>
  <div id="section-8" class="tk-section" style="padding-left:10px; padding-right:10px">

    
    
      <div class="tk-column-container" style="min-width:280px; max-width:600px; margin:0 auto; background-color:#ffc800" bgcolor="#ffc800">
    
    <!--[if (mso)|(IE)]>
      <table align="center" style="width:600px;" cellpadding="0" cellspacing="0" role="presentation" width="600" bgcolor="#ffc800">
      <tr style="background-color:#ffc800;">
    <![endif]-->

    <!--[if (mso)|(IE)]>
  <td valign="top" style="width:600px;">
<![endif]-->
<!--[if gte mso 9]>
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px">
<![endif]-->
<div id="column-8-0" class="tk-column tk-size-12">
  <div id="tk_wrapper_module-8-0-0" class="tk_wrapper tk_wrapper_widget tk_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;"><table class="tk-image-wrapper" role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tbody>
    <tr>
      <td class="tk_padded" align="center" valign="top" style="font-family:Arial, sans-serif; color:#23496d; word-break:break-word; text-align:center; padding:20px 20px 10px; font-size:0px">
        <img alt="Logo Thorakao" src="https://huynhthinh06.github.io/KOC_PAGE/assets/images/email/tk-logo-v3.png" style="outline:none; text-decoration:none; max-width:100%; font-size:16px" width="271" align="middle">
      </td>
    </tr>
  </tbody>
</table></div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="" style=""><tbody><tr><td class="tk_padded" style="font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:0px 20px"><div id="tk_wrapper_module-8-0-1" class="tk_wrapper tk_wrapper_widget tk_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;"><table role="presentation" align="center" style="width: auto; text-align: center; margin: 0 auto; " class="tk_wrapper_type_social_module">
  <tbody>
    <tr>
      <td class="social-network-cell" align="center" style="font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
        <table role="presentation" align="center" style="width: auto; text-align: center; margin: 0 auto; " class="tk_wrapper_type_social_module_single">
          <tbody>
            <tr>
              <td class="display_block_on_small_screens" align="center" style="font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
                <a href="https://www.facebook.com/neptoc.thorakao/" style="color:#00a4bd; text-decoration:none !important" target="_blank"><img src="https://huynhthinh06.github.io/KOC_PAGE/assets/images/email/tk-fb-v3.png" alt="Facebook" height="25" style="outline:none; text-decoration:none; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </td><td class="social-network-cell" align="center" style="font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
        <table role="presentation" align="center" style="width: auto; text-align: center; margin: 0 auto; " class="tk_wrapper_type_social_module_single">
          <tbody>
            <tr>
              <td class="display_block_on_small_screens" align="center" style="font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
                <a href="https://www.threads.com/@neptoc.thorakao" style="color:#00a4bd; text-decoration:none !important" target="_blank"><img src="https://huynhthinh06.github.io/KOC_PAGE/assets/images/email/tk-threads-v3.png" alt="Threads" height="25" style="outline:none; text-decoration:none; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </td><td class="social-network-cell" align="center" style="font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
        <table role="presentation" align="center" style="width: auto; text-align: center; margin: 0 auto; " class="tk_wrapper_type_social_module_single">
          <tbody>
            <tr>
              <td class="display_block_on_small_screens" align="center" style="font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
                <a href="https://www.tiktok.com/@neptoc.thorakao" style="color:#00a4bd; text-decoration:none !important" target="_blank"><img src="https://huynhthinh06.github.io/KOC_PAGE/assets/images/email/tk-tiktok-v3.png" alt="TikTok" height="25" style="outline:none; text-decoration:none; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </td><td class="social-network-cell" align="center" style="font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
        <table role="presentation" align="center" style="width: auto; text-align: center; margin: 0 auto; " class="tk_wrapper_type_social_module_single">
          <tbody>
            <tr>
              <td class="display_block_on_small_screens" align="center" style="font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
                <a href="https://thorakao.com/" style="color:#00a4bd; text-decoration:none !important" target="_blank"><img src="https://huynhthinh06.github.io/KOC_PAGE/assets/images/email/tk-web-v3.png" alt="Website" height="25" style="outline:none; text-decoration:none; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>

</div></td></tr></tbody></table>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="" style=""><tbody><tr><td class="tk_padded" style="font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px"><div id="tk_wrapper_module-8-0-2" class="tk_wrapper tk_wrapper_widget tk_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;"><table role="presentation" class="tk-footer tk-secondary" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial, sans-serif; font-size:12px; line-height:135%; color:#23496d; margin-bottom:0; padding:0">
  <tbody>
    <tr>
      <td align="center" valign="top" style="font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; text-align:center; margin-bottom:0; line-height:135%; padding:10px 20px">
        <p style="font-family:Arial, sans-serif;font-size:12px;font-weight:normal;text-decoration:none;font-style:normal;color:#FFFFFF">
          Công ty TNHH Sản Xuất Mỹ Phẩm Lan Hảo, 241bis Cách Mạng Tháng Tám, Phường Bàn Cờ, TP HCM,  70000, Việt Nam , 028 8887 3241
        </p>
        <p>
          <a href="https://huynhthinh06.github.io/KOC_PAGE/#footer" style="font-family:Lato,Tahoma,sans-serif; font-size:14px; color:#FFFFFF; font-weight:normal; text-decoration:underline; font-style:normal" target="_blank">Unsubscribe</a>
          <a href="https://huynhthinh06.github.io/KOC_PAGE/#footer" style="font-family:Lato,Tahoma,sans-serif; font-size:14px; color:#FFFFFF; font-weight:normal; text-decoration:underline; font-style:normal" target="_blank">Manage preferences</a>
        </p>
      </td>
    </tr>
  </tbody>
</table></div></td></tr></tbody></table>
</div>
<!--[if gte mso 9]></table><![endif]-->
<!--[if (mso)|(IE)]></td><![endif]-->

    <!--[if (mso)|(IE)]></tr></table><![endif]-->

    </div>
   
  </div>

</div>
          </td>
        </tr>
      </tbody></table>
    </div>
  
</body></html>`;

  MailApp.sendEmail({
    to: recipientEmail,
    name: "Nếp Tóc Thorakao",
    replyTo: "neptocthorakao@gmail.com",
    subject: subject,
    body: plainTextBody,
    htmlBody: htmlBody
  });
}
