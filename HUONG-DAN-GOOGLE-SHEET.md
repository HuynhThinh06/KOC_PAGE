# HƯỚNG DẪN KẾT NỐI GOOGLE SHEETS TỰ ĐỘNG LƯU ĐƠN HÀNG & LIÊN HỆ

Dự án website **"Nếp Tóc Thorakao"** đã được tích hợp sẵn hệ thống Webhook kết nối Google Sheets hoàn toàn miễn phí, không cần mua server backend, dữ liệu đơn hàng và khách liên hệ sẽ nhảy thẳng vào bảng tính của bạn theo thời gian thực!

---

## 3 BƯỚC THIẾT LẬP (MẤT CHƯA ĐẦY 1 PHÚT)

### Bước 1: Tạo Google Sheet mới
1. Đăng nhập tài khoản Google của bạn và mở: [https://sheets.new](https://sheets.new).
2. Đổi tên trang tính ở góc trên cùng bên trái thành: `DuLieu_Website_Thorakao`.

### Bước 2: Dán mã Script Webhook
1. Trên thanh menu của Google Sheet, bấm vào: **Tiện ích mở rộng** (Extensions) $\rightarrow$ **Apps Script**.
2. Một cửa sổ soạn thảo code sẽ hiện ra. Bạn hãy xóa hết những dòng code mặc định đang có (`function myFunction() {...}`).
3. Mở file `google-apps-script.js` (trong thư mục `D:\KOC\google-apps-script.js`), copy toàn bộ nội dung và dán vào cửa sổ Apps Script.
4. Bấm phím **Ctrl + S** (hoặc biểu tượng đĩa mềm) để lưu lại.

### Bước 3: Triển khai (Deploy) lấy đường link Webhook
1. Nhấn nút màu xanh **Triển khai (Deploy)** ở góc trên bên phải $\rightarrow$ Chọn **Triển khai dưới dạng ứng dụng web mới (New deployment)**.
2. Tại hộp thoại hiện lên, cấu hình như sau:
   - **Mô tả (Description)**: `Thorakao Webhook`
   - **Thực thi dưới dạng (Execute as)**: `Tôi (My account)`
   - **Người có quyền truy cập (Who has access)**: Chọn `Bất kỳ ai (Anyone)` *(Rất quan trọng để website gửi dữ liệu được)*.
3. Bấm **Triển khai (Deploy)**.
4. Google sẽ yêu cầu bạn cấp quyền truy cập:
   - Bấm **Ủy quyền truy cập (Authorize access)** $\rightarrow$ Chọn tài khoản Google của bạn.
   - Nếu có cảnh báo *"Google chưa xác minh ứng dụng này"*, bạn bấm vào chữ **Nâng cao (Advanced)** ở góc dưới $\rightarrow$ bấm tiếp **Đi tới... (không an toàn) / Go to... (unsafe)** $\rightarrow$ Bấm **Cho phép (Allow)**.
5. Sao chép **URL Ứng dụng web (Web App URL)** có dạng:
   `https://script.google.com/macros/s/AKfycbx.../exec`

### Bước 4: Dán link vào Website
Mở file `D:\KOC\assets\js\config.js`, tìm dòng:
```javascript
GOOGLE_SHEET_WEBHOOK_URL: "",
```
và dán link của bạn vào giữa 2 dấu ngoặc kép:
```javascript
GOOGLE_SHEET_WEBHOOK_URL: "https://script.google.com/macros/s/AKfycbx.../exec",
```
Lưu lại là xong! Giờ đây mỗi khi khách hàng:
- **Đặt hàng**: Dữ liệu sẽ tự động nhảy vào tab **DonHang**.
- **Gửi tin nhắn liên hệ**: Dữ liệu sẽ nhảy vào tab **LienHe**.
- **Đăng ký nhận bản tin**: Dữ liệu sẽ nhảy vào tab **BanTin**.

*(Lưu ý: Nếu chưa dán link Webhook, website vẫn tự động lưu toàn bộ dữ liệu an toàn vào bộ nhớ `localStorage` của trình duyệt nên bạn hoàn toàn yên tâm test thử).*
