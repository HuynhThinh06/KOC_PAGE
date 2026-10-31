# Hướng Dẫn Kích Hoạt Chatbot AI Gemini 2.0 Cho Website "Nếp Tóc Thorakao" (Phương Án A)

Phương án A kết nối trực tiếp **Google Gemini 2.0 Flash AI** thông qua **Google Apps Script Webhook** mà bạn đang dùng để quản lý đơn hàng.
- **Ưu điểm vượt trội:**
  - **Miễn phí 100%**: Gói Gemini miễn phí cung cấp 15 yêu cầu/phút.
  - **Bảo mật tuyệt đối**: API Key nằm an toàn 100% trên Google Apps Script cá nhân của bạn, không lộ ra mã nguồn website (không lo GitHub cảnh báo).
  - **Thông minh thực sự**: Trả lời tự nhiên, duyên dáng mọi câu hỏi bất kỳ, bám sát 100% dữ liệu sản phẩm, chiến dịch, quiz và chính sách của Thorakao.

---

## BƯỚC 1: Lấy Gemini API Key Miễn Phí (30 giây)

1. Truy cập: [Google AI Studio (API Key)](https://aistudio.google.com/app/apikey)
2. Đăng nhập bằng tài khoản Google của bạn.
3. Nhấn nút **Create API key** (hoặc *Tạo khóa API*).
4. Chọn một Google Cloud Project bất kỳ có sẵn (hoặc chọn *Create API key in new project*).
5. Nhấn **Copy** để sao chép chuỗi khóa (bắt đầu bằng `AIzaSy...`).

---

## BƯỚC 2: Cập Nhật Google Apps Script Trên Google Sheet

1. Mở file **Google Sheet** quản lý đơn hàng của bạn.
2. Trên thanh menu, chọn: **Tiện ích mở rộng (Extensions)** ➔ **Apps Script**.
3. Mở file mã [`google-apps-script.js`](file:///d:/KOC/google-apps-script.js) trong thư mục dự án, copy toàn bộ nội dung file.
4. Quay lại màn hình Google Apps Script trên trình duyệt:
   - Xóa toàn bộ nội dung cũ trong khung soạn thảo.
   - Dán toàn bộ nội dung mới từ `google-apps-script.js` vào.
5. Tìm dòng số 17:
   ```javascript
   var GEMINI_API_KEY = "";
   ```
   Dán khóa API bạn vừa copy ở Bước 1 vào giữa hai dấu ngoặc kép:
   ```javascript
   var GEMINI_API_KEY = "AIzaSyCvgN3f..."; 
   ```
6. Nhấn biểu tượng đĩa mềm **Lưu** (hoặc `Ctrl + S`).

---

## BƯỚC 3: Triển Khai Phiên Bản Mới (Deploy New Version)

> **LƯU Ý QUAN TRỌNG:** Mỗi lần sửa code Apps Script, bạn phải tạo một **Phiên bản mới (New version)** thì link Webhook mới nhận code mới.

1. Ở góc trên bên phải màn hình Apps Script, nhấn nút xanh **Triển khai (Deploy)** ➔ Chọn **Quản lý bản triển khai (Manage deployments)**.
2. Nhấn vào biểu tượng **Chiếc bút chì (Edit / Chỉnh sửa)** ở dòng bản triển khai hiện tại.
3. Ở mục **Phiên bản (Version)**: Nhấn chọn **Phiên bản mới (New version)**.
4. Nhấn nút **Triển khai (Deploy)**.
5. (Nếu được hỏi cấp quyền truy cập, hãy bấm *Review permissions* ➔ chọn tài khoản Google của bạn ➔ chọn *Advanced* ➔ bấm *Go to Thorakao Webhook (unsafe)* ➔ bấm *Allow*).
6. Bấm **Xong (Done)**.

---

## BƯỚC 4: Kiểm Tra Hoạt Động Của Chatbot AI

1. Mở website `https://neptocthorakao.com` (hoặc mở trang local).
2. Bấm vào nút chat *"Trò chuyện với chúng tôi"*.
3. Thử đặt bất kỳ câu hỏi tự nhiên nào, ví dụ:
   - *"Dầu gội này gội có bị bết tóc không bạn ơi?"*
   - *"Tóc mình hay uốn nhuộm bị khô xơ thì chăm sóc thế nào?"*
   - *"Mình muốn mua 3 chai về Đà Nẵng thì tính tiền và ship sao bạn?"*
   - *"Chiến dịch Thử món mẹ từng dùng mang ý nghĩa gì thế bot?"*
4. Chatbot AI Gemini sẽ suy luận và trả lời cực kỳ mượt mà, thân thiện, đồng thời hiển thị sẵn các nút bấm tiện ích để khách bấm Đặt hàng hoặc Làm Quizz!

---

> [!TIP]
> **Cơ chế An toàn (Auto Fallback):** Nếu mạng của khách chập chờn hoặc Google Apps Script bị trễ, website sẽ **tự động chuyển về Bộ máy Tri thức Cục bộ (Offline Engine)** để trả lời ngay lập tức, đảm bảo trải nghiệm của khách hàng không bao giờ bị gián đoạn!
