# Hướng dẫn cấu hình Đăng nhập (Firebase Authentication)

Website hỗ trợ đăng ký/đăng nhập bằng **Google, Facebook, Email/mật khẩu**. Khách **không cần đăng nhập để đặt hàng**. Đăng nhập chỉ giúp tự điền thông tin và xem lịch sử đơn. Nếu chưa cấu hình, nút "Đăng nhập" sẽ tự ẩn.

> Firebase Auth chỉ chạy trên `http://` / `https://`, không chạy khi mở file trực tiếp (`file://`). Khi thử ở máy, chạy: `python -m http.server 8000` rồi mở http://localhost:8000.

## 1. Tạo project Firebase
1. Vào https://console.firebase.google.com → **Add project** (gói Spark miễn phí).
2. **Project settings (⚙) → General → Your apps → Web (`</>`)**, đăng ký app và copy đối tượng `firebaseConfig`.
3. Dán `apiKey`, `authDomain`, `projectId`, `appId` vào `FIREBASE` trong `assets/js/config.js`.

## 2. Bật các cách đăng nhập
**Build → Authentication → Get started → Sign-in method:**
- **Email/Password**: Enable.
- **Google**: Enable, chọn email hỗ trợ, Save.
- **Facebook**: Enable, cần App ID và App Secret (mục 3). Copy **OAuth redirect URI** Firebase hiển thị.

## 3. Tạo Facebook App
1. https://developers.facebook.com → **My Apps → Create App** → loại *Authenticate and request data from users with Facebook Login*.
2. **App settings → Basic**: copy **App ID** và **App Secret** dán vào Firebase. Điền **Privacy Policy URL** (dùng trang `chinh-sach-quyen-rieng-tu.html` sau khi deploy).
3. **Facebook Login → Settings → Valid OAuth Redirect URIs**: dán OAuth redirect URI từ Firebase.
4. Chuyển app sang chế độ **Live** để người ngoài đăng nhập được (khi còn Development thì chỉ admin/tester dùng được).

## 4. Domain được phép
**Authentication → Settings → Authorized domains**: thêm domain website khi deploy (`localhost` có sẵn).

## 5. Firestore (lưu hồ sơ và lịch sử đơn)
1. **Build → Firestore Database → Create database** (production mode).
2. Tab **Rules**, dán rồi Publish:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```
Mỗi người chỉ đọc/ghi được dữ liệu của chính mình.

## 6. Google Sheet đơn hàng
`google-apps-script.js` đã thêm 2 cột cuối **Email Tài Khoản** và **UID Tài Khoản**. Hãy dán lại script và **Deploy → Manage deployments → New version**. Với sheet `DonHang` đã tồn tại, tự thêm 2 tiêu đề cột M, N (các cột cũ giữ nguyên).

## Lưu ý
- Một email chỉ có một tài khoản: nếu email đã dùng với cách đăng nhập khác, site sẽ báo lỗi bằng tiếng Việt.
- `apiKey` của Firebase là public theo thiết kế, bảo mật dựa vào Firestore Rules và Authorized domains.
