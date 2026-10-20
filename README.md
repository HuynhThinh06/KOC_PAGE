# Hướng Dẫn Deploy Landing Page Lên Vercel & Gắn Tên Miền Riêng

Dự án Landing Page: **Dầu Gội Bồ Kết Thorakao (KOC Series: "Thử Món Mẹ Từng Dùng")**
Được tích hợp sẵn:
- Thông tin sản phẩm & liên kết gian hàng chính hãng.
- 8 Câu hỏi & câu trả lời FAQ có thanh tìm kiếm nhanh.
- Mini Quiz 5 câu "Nếp tóc của bạn là gì?" với thuật toán tính điểm & phân định hòa chính xác theo yêu cầu.
- Trợ lý Chatbot tự động tư vấn, giải đáp thắc mắc và chỉ dẫn mua hàng.
- Showcase video KOC review.

---

## 1. Có thể dùng Vercel để host trang này không?

**HOÀN TOÀN ĐƯỢC VÀ ĐÂY LÀ LỰA CHỌN TỐI ƯU NHẤT HIỆN NAY!**
- **Chi phí**: 100% MIỄN PHÍ (Gói Hobby của Vercel đủ tải hàng trăm nghìn lượt truy cập/tháng).
- **Tốc độ**: Mạng lưới CDN toàn cầu, tải trang cực nhanh tại Việt Nam.
- **Bảo mật**: Tự động cấp chứng chỉ bảo mật HTTPS (SSL) miễn phí vĩnh viễn.
- **Tên miền riêng**: Hỗ trợ gắn tên miền bạn đã mua cực kỳ đơn giản.

---

## 2. Các bước Deploy lên Vercel (Cách nhanh nhất - Kéo thả)

### Cách A: Kéo thả trực tiếp (Không cần cài đặt gì, chỉ mất 1 phút)
1. Đăng ký/Đăng nhập tài khoản tại [https://vercel.com](https://vercel.com) (có thể đăng nhập bằng GitHub hoặc Email/Google).
2. Sau khi vào Dashboard, truy cập đường dẫn: **[https://vercel.com/new](https://vercel.com/new)**.
3. Kéo toàn bộ thư mục `d:\KOC` (hoặc nén thư mục lại rồi tải lên) vào vùng kéo thả trên Vercel.
4. Bấm **Deploy**. Sau khoảng 10 - 20 giây, bạn sẽ nhận được một đường link miễn phí dạng `ten-du-an.vercel.app` để truy cập ngay lập tức!

---

### Cách B: Qua GitHub (Khuyên dùng nếu muốn cập nhật thường xuyên)
1. Đẩy code trong thư mục `d:\KOC` lên một kho lưu trữ GitHub (Repository).
2. Vào [Vercel Dashboard](https://vercel.com) -> Chọn **Add New...** -> **Project**.
3. Chọn Repository vừa tạo trên GitHub -> Nhấn **Deploy**.
4. Mỗi khi bạn thay đổi code và push lên GitHub, Vercel sẽ tự động cập nhật web mới trong vài giây.

---

## 3. Cách gắn Tên Miền Riêng bạn đã mua vào Vercel

Sau khi website đã deploy thành công trên Vercel:

### Bước 1: Thêm tên miền vào Vercel
1. Vào dự án của bạn trên Vercel -> Chọn tab **Settings** -> Mục **Domains**.
2. Nhập tên miền của bạn vào ô (Ví dụ: `thorakaokoc.vn` hoặc `tenmiencuaban.com`) -> Bấm **Add**.
3. Vercel sẽ gợi ý bạn thêm cả 2 dạng:
   - Dạng gốc: `tenmiencuaban.com`
   - Dạng www: `www.tenmiencuaban.com` (chuyển hướng về dạng gốc). Bạn bấm đồng ý.

### Bước 2: Cài đặt bản ghi DNS tại nơi bạn đã mua tên miền
Đăng nhập vào trang quản trị tên miền của bạn (ví dụ: Mắt Bão, PA Việt Nam, TENTEN, GoDaddy, Namecheap, Cloudflare...):
Tìm đến mục **Quản lý DNS (DNS Management)** và thêm/sửa 2 bản ghi sau:

| Loại bản ghi (Type) | Tên / Host / Name | Giá trị (Value / Points to) | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` (hoặc để trống) | `76.76.21.21` | 3600 (hoặc tự động) |
| **CNAME** | `www` | `cname.vercel-dns.com` | 3600 (hoặc tự động) |

### Bước 3: Đợi kiểm tra xác thực
- Vercel sẽ tự động kiểm tra bản ghi DNS (thường mất từ 1 - 15 phút tùy nhà cung cấp mạng).
- Khi trạng thái chuyển sang màu xanh lá **Valid Configuration**, Vercel sẽ tự động cấp chứng chỉ HTTPS (khóa bảo mật xanh).
- Giờ đây mọi người truy cập vào tên miền của bạn sẽ thấy ngay Landing page!

---

## 4. Cách chạy thử trên máy tính của bạn ngay bây giờ
Bạn có thể mở file `index.html` trong thư mục `d:\KOC` bằng bất kỳ trình duyệt nào (Chrome, Edge, Cốc Cốc, Firefox) bằng cách click đúp vào file để trải nghiệm toàn bộ Quiz, Chatbot, FAQ và giao diện responsive mobile.
# KOC_PAGE
