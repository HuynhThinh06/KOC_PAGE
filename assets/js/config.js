/**
 * CẤU HÌNH HỆ THỐNG WEBSITE NẾP TÓC THORAKAO
 */
const THORAKAO_CONFIG = {
  // Đường link Webhook Google Sheets (Nếu có thì dán vào đây theo hướng dẫn trong HUONG-DAN-GOOGLE-SHEET.md)
  GOOGLE_SHEET_WEBHOOK_URL: "https://script.google.com/macros/s/AKfycbxViboZmAXEGUAGrx7flJI75uaPRM6tOxf-Xatohe0oqEf_pd9INPNtiqJXoX2v7PVK/exec",

  // Thông tin sản phẩm chính
  PRODUCT: {
    id: "dau-goi-bo-ket-750ml",
    name: "Dầu Gội Bồ Kết Thorakao 750ml",
    price: 113000,
    formattedPrice: "113.000₫",
    unit: "chai",
    capacity: "750ml",
    image: "assets/images/product-bottle.png",
    inStock: true,
    freeShippingThreshold: 200000, // Miễn phí vận chuyển từ 200.000đ trở lên
    standardShippingFee: 25000,    // Phí ship tiêu chuẩn dưới 200k là 25.000đ
  },

  // Thông tin liên hệ
  CONTACT: {
    brand: "Thorakao Việt Nam",
    hotline: "028 8887 3241",
    email: "info@thorakao.com",
    address: "241 bis Cách Mạng Tháng Tám, Phường Bàn Cờ, TP. Hồ Chí Minh",
    officialWebsite: "https://thorakao.com",
    facebook: "https://www.facebook.com/neptocthorakao/",
    tiktok: "https://www.tiktok.com/@neptoc.thorakao?_r=1&_t=ZS-9AsfZet6sB4",
    threads: "https://www.threads.com/@neptoc.thorakao"
  }
};
