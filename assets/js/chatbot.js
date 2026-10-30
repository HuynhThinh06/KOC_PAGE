/**
 * CHATBOT.JS - HỆ THỐNG TRỢ LÝ TRÍ TUỆ DỮ LIỆU WEBSITE NẾP TÓC THORAKAO
 * Kiến trúc Hybrid:
 * 1. Website Knowledge Base (Bao phủ 100% nội dung trang chủ, sản phẩm, Quiz, 11 câu FAQ, 3 Chính sách & DOM trực tiếp)
 * 2. Smart Calculator (Tự động tính tiền sản phẩm + phí vận chuyển theo số lượng bất kỳ người dùng nhập)
 * 3. Multi-Intent Vietnamese Semantic Engine (Hiểu câu hỏi ghép nhiều ý, có dấu/không dấu, viết tắt, tư vấn tình trạng tóc)
 * 4. Optional AI Proxy (Kết nối Gemini AI qua Google Apps Script hoặc API Key nếu được cấu hình)
 * 5. Direct Lead Capture về Google Sheets & Đặt hàng nhanh ngay trong khung chat
 */

const THORAKAO_WEBSITE_TEXT_CONTEXT = `
THÔNG TIN CHÍNH THỨC WEBSITE CHIẾN DỊCH "NẾP TÓC THORAKAO - GIỮ NẾP XƯA, TỎ NẾP MÌNH":
1. Sản phẩm chính:
- Tên sản phẩm: Dầu Gội Bồ Kết Thorakao 750ml (Mã sản phẩm: THO-BOKET-750).
- Giá bán niêm yết chính hãng: 113.000₫ / chai lớn 750ml. Tình trạng: Còn hàng.
- Thương hiệu: Thorakao Việt Nam (Công ty TNHH Sản xuất Mỹ phẩm Lan Hảo - thương hiệu mỹ phẩm truyền thống lâu đời gắn liền với nhiều thế hệ gia đình Việt từ năm 1961).
- Đặc điểm nổi bật: Đưa trái bồ kết dân gian vào công thức dầu gội thành phẩm hiện đại, giúp gội đầu tiện lợi hằng ngày mà không cần mất thời gian nướng, nấu cầu kỳ như ngày xưa.

2. Thành phần & Công dụng:
- Thành phần chính: Chiết xuất trái bồ kết thiên nhiên nguyên chất kết hợp các dưỡng chất làm sạch và làm mềm lành tính.
  + Saponin tự nhiên trong bồ kết: Tạo bọt mịn, kháng khuẩn tự nhiên, làm sạch sâu gàu, nấm ngứa và bã nhờn trên da đầu một cách dịu nhẹ mà không bào mòn lớp màng ẩm tự nhiên.
  + Flavonoid & Tanin (chất chống oxy hóa): Bảo vệ sợi tóc trước khói bụi, ô nhiễm và nhiệt độ; kích thích lưu thông tuần hoàn dưới da đầu giúp nang tóc bám chắc, giảm gãy rụng rõ rệt.
  + Dưỡng chất cấp ẩm làm mềm: Giúp thân và ngọn tóc suôn mượt, dễ chải, hạn chế xơ rối, duy trì mái tóc đen bóng óng ả tự nhiên cùng hương thơm thảo mộc bồ kết thư giãn.
- Độ an toàn: Lành tính từ thảo dược thiên nhiên, phù hợp cho cả gia đình, người có da đầu nhạy cảm, phụ nữ mang thai (mẹ bầu) và mẹ sau sinh bị rụng tóc.

3. Tư vấn theo loại tóc & Kết quả Mini Quiz "Nếp tóc - Nếp riêng?" (5 câu hỏi):
- Nhóm A - "Nếp tóc thích thoáng nhẹ" (Tóc dầu, dễ bết phần chân tóc sau 1 ngày, mất độ bồng bềnh):
  + Lời khuyên: Dầu gội bồ kết Thorakao rất hợp vì Saponin làm sạch dầu thừa dịu nhẹ giúp chân tóc tơi phồng, sạch thoáng lâu bết. Có thể gội hằng ngày hoặc cách 1 ngày, hạn chế thoa dầu xả/dưỡng trực tiếp vào da đầu.
- Nhóm B - "Nếp tóc cần nâng niu" (Tóc khô xơ, dễ rối, chẻ ngọn, thiếu độ mềm mại hoặc có uốn, nhuộm, tạo kiểu nhiệt):
  + Lời khuyên: Gội khoảng 2-3 lần/tuần bằng nước mát hoặc ấm nhẹ, không chà xát mạnh bằng móng tay, kết hợp thêm dầu xả ở phần thân và ngọn tóc để tăng độ ẩm mềm mượt.
- Nhóm C - "Nếp tóc theo gu riêng" (Tóc tương đối ổn định, ít gặp vấn đề, quan tâm thành phần thảo mộc, mùi hương bồ kết và mức giá tiết kiệm):
  + Lời khuyên: Duy trì thói quen chăm sóc dịu nhẹ với bồ kết Thorakao 750ml, bảo vệ tóc trước nắng gắt và khói bụi.

4. Hướng dẫn sử dụng chuẩn nếp:
- Bước 1: Làm ướt toàn bộ tóc và da đầu bằng nước mát hoặc nước ấm vừa phải (tránh nước quá nóng làm khô da đầu).
- Bước 2: Lấy lượng dầu gội vừa đủ (khoảng 10-15ml), tạo bọt và thoa đều lên tóc.
- Bước 3: Dùng đầu ngón tay massage nhẹ nhàng khắp da đầu và chân tóc trong 2-3 phút để dưỡng chất bồ kết thẩm thấu.
- Bước 4: Xả sạch lại bằng nhiều nước. Có thể kết hợp dầu xả ở phần ngọn tóc nếu tóc khô.
- Lưu ý: Chỉ dùng ngoài da, tránh dính vào mắt (nếu dính rửa kỹ bằng nước sạch), bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.

5. Chiến dịch KOC "Giữ nếp xưa - Tỏ nếp mình" & Series "Thử món mẹ từng dùng":
- Chiến dịch kết nối thế hệ trẻ hiện đại với bí quyết chăm sóc tóc bằng trái bồ kết truyền thống của bà và mẹ.
- Thông qua Series video trải nghiệm thực tế của các KOC ("Thử món mẹ từng dùng"), người dùng có cái nhìn chân thực, khách quan về mùi hương, kết cấu, độ tạo bọt và cảm giác tóc sau khi gội.

6. Chính sách Vận chuyển & Giao hàng:
- Phạm vi: Giao hàng toàn quốc.
- Phí vận chuyển:
  + MIỄN PHÍ VẬN CHUYỂN (Freeship 0₫): Cho mọi đơn hàng từ 200.000 VNĐ trở lên (tức là mua từ 2 chai Dầu Gội Bồ Kết 750ml trở lên: 2 chai = 226.000₫ được Freeship).
  + Đơn hàng dưới 200.000 VNĐ (mua 1 chai = 113.000₫): Phí vận chuyển đồng giá toàn quốc là 25.000 VNĐ/đơn (Tổng thanh toán 1 chai gồm ship là 138.000₫).
- Thời gian giao hàng dự kiến:
  + Nội thành TP. Hồ Chí Minh & Hà Nội: 1 - 2 ngày làm việc.
  + Các tỉnh thành khác: 2 - 4 ngày làm việc.
- Đồng kiểm (Kiểm tra hàng): Khách hàng ĐƯỢC QUYỀN kiểm tra tình trạng niêm phong thùng hàng và ngoại quan chai dầu gội trước khi thanh toán (COD).
- Hình thức thanh toán: Thanh toán tiền mặt khi nhận hàng (COD) hoặc Chuyển khoản ngân hàng / Ví điện tử.

7. Chính sách Đổi trả & Hoàn tiền:
- Thorakao cam kết giao hàng nguyên vẹn, đúng sản phẩm, đúng số lượng chính hãng.
- Hỗ trợ 1 đổi 1 hoặc hoàn tiền nếu sản phẩm bị hư hỏng, móp vỡ, rò rỉ do vận chuyển, lỗi bao bì từ nhà sản xuất hoặc giao sai sản phẩm.
- Điều kiện: Quý khách giữ nguyên hiện trạng sản phẩm (không tự ý can thiệp hay sử dụng tiếp), chụp ảnh/quay video tình trạng kiện hàng và liên hệ ngay bộ phận hỗ trợ qua Hotline 028 8887 3241 hoặc Email info@thorakao.com.
- Không áp dụng đổi trả nếu sử dụng sai hướng dẫn, bảo quản nơi nhiệt độ cao/ẩm mốc hoặc hư hỏng do tác động ngoại lực sau khi đã ký nhận nguyên vẹn.

8. Chính sách Quyền riêng tư & Tài khoản:
- Chỉ thu thập Họ tên, SĐT, Địa chỉ, Email để giao hàng, tư vấn kết quả Quiz và gửi bản tin chiến dịch (nếu đăng ký).
- Cam kết bảo mật 100%, tuyệt đối không bán hoặc chia sẻ dữ liệu cho bên thứ ba vì mục đích thương mại.
- Hỗ trợ đăng nhập/đăng ký bằng Email, Google, Facebook và hỗ trợ yêu cầu xóa dữ liệu cá nhân bất cứ lúc nào.

9. Thông tin Liên hệ chính thức:
- Địa chỉ: 241 bis Cách Mạng Tháng Tám, Phường Bàn Cờ, TP. Hồ Chí Minh.
- Hotline CSKH: 028 8887 3241.
- Email: info@thorakao.com.
- Website thương hiệu: https://thorakao.com | Trang chiến dịch: https://www.neptocthorakao.com
- Mạng xã hội: Facebook (https://www.facebook.com/neptocthorakao/), TikTok (@neptoc.thorakao), Threads (@neptoc.thorakao).
`;

// Danh sách các Chủ đề Tri thức (Knowledge Nodes) phục vụ tìm kiếm đa ý định & chấm điểm ngữ nghĩa
const WEBSITE_KNOWLEDGE_NODES = [
  {
    id: 'price_buy',
    category: 'Giá bán & Đặt hàng',
    priority: 10,
    phrases: [
      'giá bao nhiêu', 'bao nhiêu tiền', 'giá bán', 'mấy tiền', 'bn tiền', 'gia bn', '1 chai bao nhiêu',
      'dung tích', 'bao nhiêu ml', 'chai mấy ml', '750ml', '113k', '113.000', 'mua ở đâu', 'đặt hàng',
      'mua hàng', 'chính hãng', 'còn hàng không', 'mã sản phẩm'
    ],
    keywords: ['giá', 'tiền', 'nhiêu', 'bn', 'mua', 'đặt', 'ml', 'dung tích', 'chai', '113', 'chính hãng', 'order'],
    answer: () => `<strong>🧴 Giá bán & Dung tích chính hãng:</strong><br>
• Sản phẩm: <strong>Dầu Gội Bồ Kết Thorakao</strong> dung tích lớn <strong>750ml</strong> (Mã: <code>THO-BOKET-750</code>).<br>
• Giá niêm yết chính hãng: <strong>113.000₫ / chai</strong> (Hiện đang <strong>Còn hàng</strong>).<br>
• <strong>Ưu đãi đặc biệt:</strong> Mua từ <strong>2 chai trở lên (226.000₫)</strong> được <strong>MIỄN PHÍ VẬN CHUYỂN 100%</strong> toàn quốc (Mua 1 chai phí ship 25.000₫, tổng 138.000₫).`
  },
  {
    id: 'shipping_delivery',
    category: 'Vận chuyển, Phí ship & Thời gian giao',
    priority: 9,
    phrases: [
      'phí ship', 'tiền ship', 'phí vận chuyển', 'freeship', 'free ship', 'miễn phí vận chuyển',
      'giao hàng bao lâu', 'mấy ngày nhận được', 'thời gian giao hàng', 'ship cod', 'kiểm tra hàng',
      'đồng kiểm', 'đơn vị vận chuyển', 'giao chậm', 'đổi địa chỉ', 'ship toàn quốc', 'hà nội', 'tphcm', 'tỉnh'
    ],
    keywords: ['ship', 'vận chuyển', 'giao', 'freeship', 'cước', 'ngày', 'bao lâu', 'kiểm tra', 'đồng kiểm', 'chậm', 'tỉnh'],
    answer: () => `<strong>🚚 Chính sách Vận chuyển & Giao hàng:</strong><br>
• <strong>Miễn phí vận chuyển (0₫):</strong> Áp dụng cho đơn hàng từ <strong>200.000₫ trở lên</strong> (tương đương từ <strong>2 chai</strong>).<br>
• <strong>Đơn dưới 200.000₫ (1 chai):</strong> Phí ship đồng giá toàn quốc <strong>25.000₫/đơn</strong>.<br>
• <strong>Thời gian nhận hàng:</strong> TP.HCM & Hà Nội từ <strong>1 – 2 ngày</strong> làm việc; các tỉnh thành khác từ <strong>2 – 4 ngày</strong> làm việc.<br>
• <strong>Đồng kiểm:</strong> Bạn được <strong>kiểm tra ngoại quan & niêm phong sản phẩm</strong> trước khi thanh toán (COD). Nếu cần đổi địa chỉ hoặc kiểm tra vận đơn giao chậm, bạn liên hệ ngay Hotline <strong>028 8887 3241</strong> nhé!`
  },
  {
    id: 'payment_methods',
    category: 'Phương thức thanh toán',
    priority: 8,
    phrases: [
      'thanh toán thế nào', 'trả tiền sao', 'hình thức thanh toán', 'chuyển khoản', 'ship cod',
      'thanh toán khi nhận hàng', 'ví điện tử', 'trả trước hay trả sau'
    ],
    keywords: ['thanh toán', 'cod', 'chuyển khoản', 'trả tiền', 'ngân hàng', 'nhận hàng'],
    answer: () => `<strong>💳 Phương thức Thanh toán trên Website:</strong><br>
• <strong>1. Thanh toán khi nhận hàng (COD):</strong> Bạn nhận hàng, kiểm tra nguyên vẹn rồi mới thanh toán tiền mặt cho shipper.<br>
• <strong>2. Chuyển khoản ngân hàng / Ví điện tử:</strong> Tiện lợi, nhanh chóng ngay khi xác nhận đơn hàng tại trang Giỏ hàng.`
  },
  {
    id: 'ingredients_benefits',
    category: 'Thành phần, Công dụng & So sánh bồ kết nấu',
    priority: 9,
    phrases: [
      'thành phần', 'công dụng', 'tác dụng', 'có gì khác với nước bồ kết nấu', 'bồ kết nấu truyền thống',
      'saponin', 'flavonoid', 'mùi hương', 'mùi thế nào', 'thơm không', 'có bọt không', 'tạo bọt',
      'silicon', 'paraben', 'hóa chất', 'lành tính', 'mẹ bầu', 'bà bầu', 'sau sinh', 'da đầu nhạy cảm'
    ],
    keywords: ['thành phần', 'công dụng', 'tác dụng', 'bồ kết', 'saponin', 'flavonoid', 'mùi', 'hương', 'nấu', 'bầu', 'sinh', 'nhạy cảm', 'an toàn'],
    answer: () => `<strong>🌿 Thành phần & Công dụng Dầu Gội Bồ Kết Thorakao:</strong><br>
• <strong>Chiết xuất trái bồ kết thiên nhiên:</strong> Giàu <em>Saponin</em> (tạo bọt mịn, kháng khuẩn, sạch gàu và bã nhờn dịu nhẹ) cùng <em>Flavonoid & Tanin</em> (chống oxy hóa, nuôi dưỡng chân tóc chắc khỏe, giảm gãy rụng, giữ tóc đen bóng tự nhiên).<br>
• <strong>Khác biệt với bồ kết nấu xưa:</strong> Đưa bồ kết vào công thức dầu gội thành phẩm hiện đại giúp bạn dùng tiện lợi mỗi ngày mà không tốn công nướng, đun nấu.<br>
• <strong>Mùi hương & Độ lành tính:</strong> Hương bồ kết thảo mộc dịu nhẹ, mộc mạc; lành tính cho cả gia đình, người có da đầu nhạy cảm, mẹ bầu và sau sinh.`
  },
  {
    id: 'hair_oily_dandruff',
    category: 'Tư vấn Tóc bết dầu, Gàu & Ngứa da đầu (Nhóm A)',
    priority: 9,
    phrases: [
      'tóc bết', 'bết dầu', 'da đầu dầu', 'nhanh bết', 'nhờn', 'tóc dầu', 'bị gàu', 'ngứa da đầu',
      'trị gàu', 'nếp tóc thích thoáng nhẹ', 'chân tóc bết', 'mất độ bồng bềnh'
    ],
    keywords: ['bết', 'dầu', 'nhờn', 'gàu', 'ngứa', 'thoáng nhẹ', 'bồng bềnh'],
    answer: () => `<strong>✨ Tư vấn cho Mái tóc dễ bết dầu / Gàu ngứa (Nhóm A - Nếp tóc thích thoáng nhẹ):</strong><br>
• <strong>Mức độ phù hợp:</strong> Rất phù hợp! Hoạt chất <em>Saponin</em> tự nhiên trong quả bồ kết giúp làm sạch sâu dầu thừa và vảy gàu ở chân tóc mà không gây kích ứng tiết dầu ngược, giúp tóc tơi phồng và sạch thoáng lâu hơn.<br>
• <strong>Lời khuyên chăm sóc:</strong> Bạn có thể gội hằng ngày hoặc cách 1 ngày, massage nhẹ da đầu 2–3 phút và <strong>hạn chế thoa dầu xả/dưỡng sát phần chân tóc</strong>.`
  },
  {
    id: 'hair_dry_hairloss',
    category: 'Tư vấn Tóc khô xơ, Rối, Rụng tóc, Uốn nhuộm (Nhóm B)',
    priority: 9,
    phrases: [
      'tóc khô', 'khô xơ', 'bị rít', 'khô hoặc rít', 'dễ rối', 'rụng tóc', 'gãy rụng', 'tóc yếu',
      'chẻ ngọn', 'uốn nhuộm', 'tạo kiểu', 'nếp tóc cần nâng niu', 'mềm mượt'
    ],
    keywords: ['khô', 'xơ', 'rít', 'rối', 'rụng', 'gãy', 'yếu', 'nhuộm', 'uốn', 'nâng niu', 'mềm'],
    answer: () => `<strong>💆‍♀️ Tư vấn cho Mái tóc khô xơ, dễ rối hoặc gãy rụng (Nhóm B - Nếp tóc cần nâng niu):</strong><br>
• <strong>Giảm gãy rụng & Nuôi dưỡng:</strong> <em>Flavonoid</em> trong bồ kết kết hợp dưỡng chất làm mềm giúp củng cố nang tóc chắc khỏe, giảm gãy rụng và phục hồi độ bóng mượt tự nhiên.<br>
• <strong>Có gây khô rít không?</strong> Công thức thành phẩm của Thorakao đã bổ sung chất dưỡng ẩm giúp tóc mềm dễ chải hơn nước bồ kết nấu thuần túy. Nếu tóc bạn quá khô hoặc đã qua uốn/nhuộm, hãy <strong>gội 2–3 lần/tuần bằng nước mát và kết hợp thêm dầu xả ở phần thân & ngọn tóc</strong> nhé!`
  },
  {
    id: 'usage_frequency',
    category: 'Hướng dẫn sử dụng & Tần suất gội đầu',
    priority: 8,
    phrases: [
      'cách dùng', 'hướng dẫn sử dụng', 'dùng như thế nào', 'gội hằng ngày', 'gội mỗi ngày',
      'tần suất gội', 'mấy lần 1 tuần', 'bảo quản', 'hạn sử dụng'
    ],
    keywords: ['cách dùng', 'sử dụng', 'hướng dẫn', 'hằng ngày', 'mỗi ngày', 'tần suất', 'tuần', 'bảo quản'],
    answer: () => `<strong>🚿 Hướng dẫn sử dụng & Tần suất gội chuẩn:</strong><br>
1. Làm ướt toàn bộ tóc bằng nước mát hoặc ấm nhẹ.<br>
2. Lấy khoảng <strong>10–15ml</strong> dầu gội, tạo bọt và massage nhẹ nhàng khắp da đầu trong <strong>2–3 phút</strong>.<br>
3. Xả sạch lại bằng nhiều nước (kết hợp dầu xả ở ngọn tóc nếu tóc khô).<br>
• <strong>Có gội hằng ngày được không?</strong> Hoàn toàn được nếu bạn thuộc nhóm da đầu dầu hoặc vận động nhiều; nếu tóc khô thì nên gội <strong>2–3 lần/tuần</strong>.`
  },
  {
    id: 'quiz_campaign_koc',
    category: 'Mini Quiz Nếp Tóc & Chiến dịch KOC Thử Món Mẹ Từng Dùng',
    priority: 8,
    phrases: [
      'mini quiz', 'trắc nghiệm', 'nếp tóc nếp riêng', 'tìm nếp tóc', 'chiến dịch', 'giữ nếp xưa tỏ nếp mình',
      'thử món mẹ từng dùng', 'koc', 'review', 'đánh giá', 'nếp tóc theo gu riêng'
    ],
    keywords: ['quiz', 'quizz', 'trắc nghiệm', 'nếp tóc', 'chiến dịch', 'koc', 'mẹ từng dùng', 'nếp xưa', 'review'],
    answer: () => `<strong>🎯 Chiến dịch "Giữ Nếp Xưa - Tỏ Nếp Mình" & Mini Quiz Nếp Tóc:</strong><br>
• <strong>Series KOC "Thử món mẹ từng dùng":</strong> Hành trình các KOC trẻ trực tiếp trải nghiệm dầu gội bồ kết gắn liền với ký ức của mẹ và bà, đánh giá khách quan về mùi hương, khả năng làm sạch và độ tơi mượt.<br>
• <strong>Mini Quiz 5 câu "Nếp tóc - Nếp riêng?":</strong> Giúp bạn khám phá mình thuộc nhóm <em>A (Nếp tóc thích thoáng nhẹ)</em>, <em>B (Nếp tóc cần nâng niu)</em> hay <em>C (Nếp tóc theo gu riêng)</em> để có bí quyết chăm sóc chuẩn nhất!`
  },
  {
    id: 'return_policy',
    category: 'Chính sách Đổi trả, Hoàn tiền & Xử lý lỗi',
    priority: 8,
    phrases: [
      'đổi trả', 'hoàn tiền', 'bảo hành', 'bị vỡ', 'hư hỏng', 'rò rỉ', 'giao sai', 'lỗi bao bì',
      'chính sách đổi trả', 'không được đổi trả'
    ],
    keywords: ['đổi trả', 'hoàn tiền', 'lỗi', 'vỡ', 'hỏng', 'rò rỉ', 'sai', 'bảo hành', 'khiếu nại'],
    answer: () => `<strong>🔄 Chính sách Đổi trả & Đảm bảo chất lượng:</strong><br>
• <strong>Cam kết 1 đổi 1 / Hoàn tiền:</strong> Khi sản phẩm nhận được có dấu hiệu hư hỏng, móp vỡ, rò rỉ do vận chuyển, lỗi bao bì hoặc giao không đúng đơn hàng.<br>
• <strong>Cách xử lý:</strong> Quý khách vui lòng <strong>giữ nguyên hiện trạng sản phẩm</strong>, chụp ảnh tình trạng kiện hàng và liên hệ ngay Hotline <strong>028 8887 3241</strong> hoặc Email <strong>info@thorakao.com</strong> để được đổi mới nhanh nhất.`
  },
  {
    id: 'privacy_account',
    category: 'Chính sách Quyền riêng tư & Tài khoản thành viên',
    priority: 7,
    phrases: [
      'quyền riêng tư', 'bảo mật thông tin', 'xóa dữ liệu', 'tài khoản', 'đăng nhập', 'đăng ký', 'quên mật khẩu'
    ],
    keywords: ['riêng tư', 'bảo mật', 'dữ liệu', 'tài khoản', 'đăng nhập', 'đăng ký'],
    answer: () => `<strong>🔒 Chính sách Quyền riêng tư & Tài khoản:</strong><br>
• Thorakao cam kết <strong>bảo mật 100% thông tin cá nhân</strong> (Họ tên, SĐT, Địa chỉ, Email), chỉ sử dụng để giao đơn hàng và chăm sóc khách hàng, tuyệt đối không chia sẻ cho bên thứ ba.<br>
• Bạn có thể bấm vào biểu tượng tài khoản trên thanh Header để <strong>Đăng nhập / Đăng ký</strong> theo dõi đơn hàng dễ dàng.`
  },
  {
    id: 'contact_info',
    category: 'Địa chỉ, Hotline, Email & Kênh liên hệ',
    priority: 8,
    phrases: [
      'địa chỉ', 'ở đâu', 'cửa hàng', 'công ty ở đâu', 'số điện thoại', 'hotline', 'tổng đài',
      'email', 'liên hệ', 'facebook', 'fanpage', 'tiktok', 'threads', 'website chính thức'
    ],
    keywords: ['địa chỉ', 'ở đâu', 'hotline', 'sđt', 'điện thoại', 'phone', 'email', 'liên hệ', 'facebook', 'fanpage', 'tiktok'],
    answer: () => `<strong>📍 Thông tin Liên hệ Chính thức của Thorakao:</strong><br>
• <strong>Địa chỉ:</strong> 241 bis Cách Mạng Tháng Tám, Phường Bàn Cờ, TP. Hồ Chí Minh.<br>
• <strong>Hotline CSKH:</strong> <a href="tel:02888873241">028 8887 3241</a><br>
• <strong>Email:</strong> <a href="mailto:info@thorakao.com">info@thorakao.com</a><br>
• <strong>Kênh chính thức:</strong> <a href="https://thorakao.com" target="_blank" rel="noopener">Website Thorakao.com</a> | <a href="https://www.facebook.com/neptocthorakao/" target="_blank" rel="noopener">Fanpage Facebook</a> | <a href="https://www.tiktok.com/@neptoc.thorakao" target="_blank" rel="noopener">TikTok</a>`
  }
];

// Lưu trữ các câu hỏi FAQ quét trực tiếp từ DOM trang hiện tại
let DYNAMIC_DOM_FAQS = [];

// Chuẩn hóa tiếng Việt không dấu để so khớp chính xác mọi kiểu gõ của người dùng
function normalizeVietnamese(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Mở rộng từ viết tắt phổ biến trong tiếng Việt khi chat
function expandAbbreviations(text) {
  let s = ' ' + text.toLowerCase() + ' ';
  const abbrMap = {
    ' bn ': ' bao nhiêu ',
    ' bnh ': ' bao nhiêu ',
    ' bnhieu ': ' bao nhiêu ',
    ' k ': ' không ',
    ' ko ': ' không ',
    ' kh ': ' không ',
    ' hok ': ' không ',
    ' dc ': ' được ',
    ' đc ': ' được ',
    ' đk ': ' được ',
    ' sp ': ' sản phẩm ',
    ' đ/c ': ' địa chỉ ',
    ' dc ': ' được ',
    ' sdt ': ' số điện thoại ',
    ' sđt ': ' số điện thoại ',
    ' hsd ': ' hạn sử dụng ',
    ' tphcm ': ' thành phố hồ chí minh ',
    ' hcm ': ' hồ chí minh ',
    ' hn ': ' hà nội ',
    ' fs ': ' freeship miễn phí vận chuyển '
  };
  Object.keys(abbrMap).forEach(k => {
    s = s.split(k).join(abbrMap[k]);
  });
  return s.trim();
}

// Tự động quét thêm nội dung FAQ và các phần tử trên trang hiện tại
function harvestPageDOMKnowledge() {
  DYNAMIC_DOM_FAQS = [];
  // 1. Quét FAQ kiểu Wix trên index.html
  const wixFaqItems = document.querySelectorAll('#comp-mvq8wnvx .spqBk3x');
  wixFaqItems.forEach(item => {
    const qEl = item.querySelector('[data-hook="title"]');
    const aEl = item.querySelector('.sIwn0eJ');
    if (qEl && aEl) {
      const qText = qEl.textContent.trim();
      const aText = aEl.textContent.trim();
      if (qText && aText) {
        DYNAMIC_DOM_FAQS.push({ question: qText, answer: aText });
      }
    }
  });

  // 2. Quét FAQ chuẩn nếu có
  const stdFaqItems = document.querySelectorAll('.faq-item');
  stdFaqItems.forEach(item => {
    const qEl = item.querySelector('.faq-question-btn');
    const aEl = item.querySelector('.faq-answer-panel');
    if (qEl && aEl) {
      const qText = qEl.textContent.trim();
      const aText = aEl.textContent.trim();
      if (qText && aText) {
        DYNAMIC_DOM_FAQS.push({ question: qText, answer: aText });
      }
    }
  });
}

// Tính toán đơn hàng tự động nếu người dùng hỏi mua N chai (VD: "mua 2 chai bao nhiêu", "3 chai hết bn tiền")
function detectAndCalculateQuantityOrder(rawText) {
  const expanded = expandAbbreviations(rawText);
  const norm = normalizeVietnamese(expanded);

  // Tìm số lượng đi kèm từ "chai" hoặc "lo"
  const wordToNum = {
    'mot': 1, 'hai': 2, 'ba': 3, 'bon': 4, 'nam': 5,
    'sau': 6, 'bay': 7, 'tam': 8, 'chin': 9, 'muoi': 10
  };

  let qty = null;
  const regexDigit = /(\d+)\s*(chai|lo|san pham|sp)/i;
  const mDigit = norm.match(regexDigit);
  if (mDigit) {
    qty = parseInt(mDigit[1], 10);
  } else {
    for (const [word, num] of Object.entries(wordToNum)) {
      const rWord = new RegExp(`\\b${word}\\s+(chai|lo)\\b`, 'i');
      if (rWord.test(norm)) {
        qty = num;
        break;
      }
    }
  }

  if (!qty || qty <= 0 || qty > 500) return null;

  const unitPrice = (typeof THORAKAO_CONFIG !== 'undefined' && THORAKAO_CONFIG.PRODUCT) ? THORAKAO_CONFIG.PRODUCT.price : 113000;
  const freeThreshold = (typeof THORAKAO_CONFIG !== 'undefined' && THORAKAO_CONFIG.PRODUCT) ? THORAKAO_CONFIG.PRODUCT.freeShippingThreshold : 200000;
  const stdShip = (typeof THORAKAO_CONFIG !== 'undefined' && THORAKAO_CONFIG.PRODUCT) ? THORAKAO_CONFIG.PRODUCT.standardShippingFee : 25000;

  const subtotal = qty * unitPrice;
  const shipFee = subtotal >= freeThreshold ? 0 : stdShip;
  const total = subtotal + shipFee;
  const fmt = (n) => n.toLocaleString('vi-VN') + '₫';

  return `<strong>🧮 Bảng tính chi phí cho ${qty} chai Dầu Gội Bồ Kết Thorakao 750ml:</strong><br>
• Tiền hàng (${qty} chai × 113.000₫): <strong>${fmt(subtotal)}</strong><br>
• Phí vận chuyển toàn quốc: <strong>${shipFee === 0 ? '0₫ (Được MIỄN PHÍ VẬN CHUYỂN 🎉)' : fmt(shipFee) + ' (Mua từ 2 chai để được Freeship!)'}</strong><br>
• 👉 <strong>Tổng thanh toán khi nhận hàng: <span style="color:#8c2415;font-size:15px;">${fmt(total)}</span></strong>`;
}

// Tạo các nút hành động thông minh đính kèm cuối câu trả lời
function buildContextualActions(matchedIds = [], detectedQty = null) {
  const qtyToAdd = detectedQty && detectedQty > 0 && detectedQty <= 20 ? detectedQty : 1;
  let html = `<div class="wix-chat-action-row">`;

  if (matchedIds.includes('price_buy') || matchedIds.includes('shipping_delivery') || matchedIds.includes('payment_methods') || detectedQty) {
    html += `<button type="button" class="wix-chat-action-btn primary" onclick="handleChatQuickAddToCart(${qtyToAdd})">🛒 Thêm ${qtyToAdd} chai vào giỏ</button>`;
    html += `<a href="product.html" class="wix-chat-action-btn secondary">🧴 Xem chi tiết SP</a>`;
  }

  if (matchedIds.includes('hair_oily_dandruff') || matchedIds.includes('hair_dry_hairloss') || matchedIds.includes('quiz_campaign_koc')) {
    html += `<button type="button" class="wix-chat-action-btn primary" onclick="closeWixChat(); openQuizModal();">🎯 Làm Mini Quiz Nếp Tóc</button>`;
  }

  if (matchedIds.includes('contact_info') || matchedIds.includes('return_policy')) {
    html += `<a href="https://www.facebook.com/neptocthorakao/" target="_blank" rel="noopener" class="wix-chat-action-btn secondary">💬 Nhắn Fanpage</a>`;
  }

  html += `</div>`;
  return html;
}

// Bộ máy phân tích & trả lời dựa trên 100% dữ liệu Website
function generateGroundedWebsiteReply(userText) {
  const expanded = expandAbbreviations(userText);
  const lower = expanded.toLowerCase();
  const norm = normalizeVietnamese(expanded);

  // 1. Kiểm tra chào hỏi xã giao
  if (/^(xin chao|chao|hi|hello|shop oi|alo|ad oi|ban oi|chao shop)$/.test(norm)) {
    return `Chào bạn! 👋 Mình là <strong>Trợ lý Nếp Tóc Thorakao</strong>.<br>
Mình nắm rõ toàn bộ thông tin trên trang web về <strong>Dầu Gội Bồ Kết Thorakao 750ml (113.000₫)</strong>, thành phần, cách chăm sóc từng nếp tóc, chính sách Freeship từ 2 chai và đổi trả.<br><br>
Bạn đang quan tâm đến điều gì hoặc mái tóc của bạn đang gặp tình trạng như thế nào, cứ nhập câu hỏi tự nhiên nhé!`;
  }

  const sections = [];
  const matchedNodeIds = [];

  // 2. Nếu câu hỏi có chứa số lượng chai cụ thể -> Tính tiền tự động ngay
  const calcHtml = detectAndCalculateQuantityOrder(userText);
  let detectedQty = null;
  const mQty = norm.match(/(\d+)\s*(chai|lo)/);
  if (mQty) detectedQty = parseInt(mQty[1], 10);
  if (calcHtml) {
    sections.push(calcHtml);
    matchedNodeIds.push('price_buy');
  }

  // 3. So khớp trực tiếp với các câu hỏi FAQ trên DOM trang web (nếu người dùng hỏi sát câu FAQ)
  for (const faq of DYNAMIC_DOM_FAQS) {
    const normQ = normalizeVietnamese(faq.question);
    // Tính tỷ lệ từ trùng nhau
    const qWords = normQ.split(' ').filter(w => w.length > 2);
    const uWords = norm.split(' ').filter(w => w.length > 2);
    if (uWords.length >= 3) {
      const overlap = uWords.filter(w => qWords.includes(w)).length;
      if (overlap / Math.max(qWords.length, 1) >= 0.65 || norm.includes(normQ) || (normQ.includes(norm) && norm.length > 14)) {
        sections.push(`<strong>📌 Giải đáp từ mục FAQ trên trang web:</strong><br><em>"${faq.question}"</em><br>👉 ${faq.answer}`);
        break;
      }
    }
  }

  // 4. Chấm điểm Ngữ nghĩa Đa Ý Định (Multi-Intent Scoring) trên toàn bộ 10 Knowledge Nodes
  const scoredNodes = [];
  for (const node of WEBSITE_KNOWLEDGE_NODES) {
    let score = 0;

    // Kiểm tra cụm từ chính xác (có dấu & không dấu)
    for (const phrase of node.phrases) {
      const normPhrase = normalizeVietnamese(phrase);
      if (lower.includes(phrase.toLowerCase())) {
        score += 6;
      } else if (normPhrase && norm.includes(normPhrase)) {
        score += 5;
      }
    }

    // Kiểm tra từ khóa đơn lẻ
    for (const kw of node.keywords) {
      const normKw = normalizeVietnamese(kw);
      const regexWord = new RegExp(`(^|\\s)${normKw}(\\s|$)`, 'i');
      if (lower.includes(kw.toLowerCase())) {
        score += 2.5;
      } else if (normKw && regexWord.test(norm)) {
        score += 2;
      }
    }

    if (score >= 2.5) {
      scoredNodes.push({ node, score: score + (node.priority * 0.05) });
    }
  }

  // Sắp xếp theo điểm giảm dần và lấy tối đa 2-3 chủ đề liên quan nhất (giúp trả lời trọn vẹn câu hỏi ghép nhiều ý!)
  scoredNodes.sort((a, b) => b.score - a.score);
  const topNodes = scoredNodes.slice(0, 3).filter((item, idx) => idx === 0 || item.score >= 4);

  for (const item of topNodes) {
    // Nếu đã có bảng tính tiền cụ thể và người dùng chỉ hỏi tiền thì không lặp lại toàn bộ mục price_buy trừ khi cần
    if (item.node.id === 'price_buy' && calcHtml && topNodes.length > 1) continue;
    sections.push(item.node.answer());
    matchedNodeIds.push(item.node.id);
  }

  // 5. Nếu tìm thấy câu trả lời khớp từ dữ liệu Website -> Kết hợp mạch lạc và hiển thị
  if (sections.length > 0) {
    return sections.join('<br><br>') + buildContextualActions(matchedNodeIds, detectedQty);
  }

  // 6. Nếu câu hỏi hoàn toàn mới / ngoài từ khóa thông thường -> Tóm tắt thông tin cốt lõi từ Website + Form gửi câu hỏi về Google Sheets
  return `Dựa trên dữ liệu chính thức của website <strong>Nếp Tóc Thorakao</strong>, hiện tại chiến dịch tập trung vào sản phẩm duy nhất là:<br>
• <strong>Dầu Gội Bồ Kết Thorakao 750ml</strong> – Giá chính hãng <strong>113.000₫/chai</strong> (Chiết xuất bồ kết giàu Saponin & Flavonoid giúp sạch gàu, giảm bết dầu, giảm gãy rụng và nuôi dưỡng tóc đen mượt).<br>
• <strong>Ưu đãi vận chuyển:</strong> Freeship toàn quốc cho đơn từ <strong>200.000₫ (từ 2 chai)</strong>; đơn 1 chai phí ship 25.000₫.<br><br>
Để được chuyên viên Thorakao giải đáp riêng cho câu hỏi <em>"${escapeChatHtml(userText)}"</em> của bạn, bạn có thể để lại SĐT/Email ngay dưới đây (lưu trực tiếp về hệ thống CSKH Thorakao):
<div class="wix-chat-lead-box">
  <input type="text" id="wixChatLeadContact" placeholder="Nhập SĐT hoặc Email của bạn...">
  <button type="button" class="wix-chat-action-btn primary" style="justify-content:center;width:100%;" onclick="submitChatLeadToSheet('${escapeChatAttr(userText)}')">📨 Gửi câu hỏi cho CSKH Thorakao</button>
</div>` + buildContextualActions(['price_buy', 'quiz_campaign_koc', 'contact_info']);
}

function escapeChatHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeChatAttr(str) {
  return String(str || '').replace(/['"\\]/g, ' ').trim();
}

// Tùy chọn gọi AI qua Google Apps Script hoặc Gemini API nếu được cấu hình
async function queryOptionalAIProxy(userMessage) {
  const cfg = typeof THORAKAO_CONFIG !== 'undefined' ? THORAKAO_CONFIG : {};
  // Nếu có cấu hình GEMINI_API_KEY trong THORAKAO_CONFIG
  if (cfg.GEMINI_API_KEY) {
    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${cfg.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: `Bạn là Trợ lý tư vấn chính thức của website "Nếp Tóc Thorakao". Hãy trả lời ngắn gọn, thân thiện bằng tiếng Việt, CHỈ DỰA TRÊN DỮ LIỆU WEBSITE DƯỚI ĐÂY. Không tự bịa thông tin ngoài dữ liệu. Định dạng bằng thẻ HTML đơn giản (<strong>, <br>, •).\n\n${THORAKAO_WEBSITE_TEXT_CONTEXT}`
            }]
          },
          contents: [{ role: 'user', parts: [{ text: userMessage }] }]
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText) {
          return aiText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>') + buildContextualActions(['price_buy', 'quiz_campaign_koc']);
        }
      }
    } catch (e) {
      // Fallback mượt về bộ máy dữ liệu nội bộ
    }
  }
  return null;
}

// Gửi thông tin câu hỏi + SĐT của khách về Google Sheets (Tab LienHe)
async function submitChatLeadToSheet(questionText) {
  const inputEl = document.getElementById('wixChatLeadContact');
  const contactVal = inputEl ? inputEl.value.trim() : '';
  if (!contactVal) {
    if (typeof showToast === 'function') {
      showToast('Vui lòng nhập Số điện thoại hoặc Email của bạn!', true);
    }
    if (inputEl) inputEl.focus();
    return;
  }

  const webhookUrl = (typeof THORAKAO_CONFIG !== 'undefined' && THORAKAO_CONFIG.GOOGLE_SHEET_WEBHOOK_URL)
    ? THORAKAO_CONFIG.GOOGLE_SHEET_WEBHOOK_URL
    : '';

  if (webhookUrl) {
    try {
      fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'CONTACT',
          lastName: 'Khách Chat',
          firstName: contactVal,
          email: contactVal,
          subject: 'Câu hỏi từ Chatbot Website',
          message: questionText
        })
      });
    } catch (err) {}
  }

  const container = getChatMessagesContainer();
  if (container) {
    const botMsg = document.createElement('div');
    botMsg.className = 'wix-chat-msg bot';
    botMsg.innerHTML = `✅ Cảm ơn bạn! Hệ thống đã ghi nhận thông tin liên hệ <strong>${escapeChatHtml(contactVal)}</strong> cùng câu hỏi của bạn. Chuyên viên Thorakao sẽ phản hồi bạn sớm nhất nhé!`;
    container.appendChild(botMsg);
    container.scrollTop = container.scrollHeight;
    saveChatHistoryToSession();
  }
}

// Thêm nhanh sản phẩm vào giỏ ngay từ trong Chatbot
function handleChatQuickAddToCart(qty = 1) {
  try {
    let cart = JSON.parse(localStorage.getItem('thorakao_cart') || '[]');
    const existing = cart.find(i => i.id === 'dau-goi-bo-ket-750ml');
    if (existing) {
      existing.quantity = (existing.quantity || 1) + qty;
    } else {
      cart.push({
        id: 'dau-goi-bo-ket-750ml',
        name: 'Dầu Gội Bồ Kết Thorakao 750ml',
        title: 'Dầu Gội Bồ Kết Thorakao 750ml',
        price: 113000,
        quantity: qty,
        image: 'assets/images/product-bottle.png'
      });
    }
    localStorage.setItem('thorakao_cart', JSON.stringify(cart));

    if (typeof updateHeaderCartCount === 'function') updateHeaderCartCount();
    if (typeof updateCartUI === 'function') updateCartUI();
    if (typeof showToast === 'function') {
      showToast(`Đã thêm ${qty} chai Dầu Gội Bồ Kết 750ml vào giỏ hàng!`);
    }

    // Mở giỏ hàng slide-out nếu có
    if (typeof openWixCart === 'function') {
      closeWixChat();
      openWixCart();
    } else if (typeof openCartDrawer === 'function') {
      closeWixChat();
      openCartDrawer();
    }
  } catch (e) {
    window.location.href = 'product.html';
  }
}

// Lấy phần tử khung cửa sổ Chat và vùng chứa tin nhắn
function getChatPopupElement() {
  return document.getElementById('wixChatPopup') || document.getElementById('chatbot-window');
}

function getChatMessagesContainer() {
  return document.getElementById('wixChatMessages') || document.getElementById('chatbot-messages-body');
}

function getChatInputElement() {
  return document.getElementById('wixChatInput') || document.getElementById('chatbot-input-field');
}

// Lưu & khôi phục lịch sử chat trong phiên làm việc (sessionStorage)
function saveChatHistoryToSession() {
  try {
    const container = getChatMessagesContainer();
    if (container) {
      sessionStorage.setItem('thorakao_chat_html', container.innerHTML);
    }
  } catch (e) {}
}

function restoreChatHistoryFromSession() {
  try {
    const saved = sessionStorage.getItem('thorakao_chat_html');
    const container = getChatMessagesContainer();
    if (saved && container && saved.includes('wix-chat-msg')) {
      container.innerHTML = saved;
    }
  } catch (e) {}
}

// Điều khiển Đóng / Mở cửa sổ Chat
function openWixChat() {
  const popup = getChatPopupElement();
  if (!popup) return;
  popup.style.display = 'flex';
  popup.classList.add('open');

  // Ẩn bong bóng thông báo vàng nếu đang hiện
  const bubble = document.querySelector('.notificationBubbleV2, [data-hook="popover-content"]');
  if (bubble) bubble.style.display = 'none';

  const container = getChatMessagesContainer();
  if (container) container.scrollTop = container.scrollHeight;

  const input = getChatInputElement();
  if (input) setTimeout(() => input.focus(), 120);
}

function closeWixChat() {
  const popup = getChatPopupElement();
  if (popup) {
    popup.classList.remove('open');
    popup.style.display = 'none';
  }
}

function toggleWixChat() {
  const popup = getChatPopupElement();
  if (!popup) return;
  const isOpen = popup.classList.contains('open') && popup.style.display !== 'none';
  if (isOpen) {
    closeWixChat();
  } else {
    openWixChat();
  }
}

// Hàm gửi tin nhắn chính
async function sendWixChatMessage(predefinedText = null) {
  const input = getChatInputElement();
  const msg = predefinedText !== null ? String(predefinedText).trim() : (input ? input.value.trim() : '');
  if (!msg) return;

  // Đảm bảo cửa sổ chat đang mở
  const popup = getChatPopupElement();
  if (popup && !popup.classList.contains('open')) {
    openWixChat();
  }

  const container = getChatMessagesContainer();
  if (!container) return;

  // 1. Hiển thị tin nhắn của người dùng
  const userMsg = document.createElement('div');
  userMsg.className = 'wix-chat-msg user';
  userMsg.textContent = msg;
  container.appendChild(userMsg);

  if (input && predefinedText === null) input.value = '';
  container.scrollTop = container.scrollHeight;

  // 2. Hiển thị hiệu ứng đang suy nghĩ / tra cứu dữ liệu trang web
  const typingEl = document.createElement('div');
  typingEl.className = 'wix-chat-msg bot wix-chat-typing';
  typingEl.innerHTML = '<span></span><span></span><span></span>';
  container.appendChild(typingEl);
  container.scrollTop = container.scrollHeight;

  // 3. Xử lý câu trả lời (AI Proxy nếu có, hoặc Bộ máy Dữ liệu Website tức thì)
  let replyHtml = await queryOptionalAIProxy(msg);
  if (!replyHtml) {
    await new Promise(r => setTimeout(r, 280));
    replyHtml = generateGroundedWebsiteReply(msg);
  }

  if (typingEl && typingEl.parentNode) {
    typingEl.parentNode.removeChild(typingEl);
  }

  const botMsg = document.createElement('div');
  botMsg.className = 'wix-chat-msg bot';
  botMsg.innerHTML = replyHtml;
  container.appendChild(botMsg);
  container.scrollTop = container.scrollHeight;

  saveChatHistoryToSession();
}

// Tương thích ngược với các tên hàm cũ
const toggleChatbot = toggleWixChat;
const closeChatbot = closeWixChat;
const sendChatMessage = sendWixChatMessage;
const analyzeQuery = generateGroundedWebsiteReply;
const analyzeWixQuery = generateGroundedWebsiteReply;

// Tự động chèn Widget Chat trên các trang phụ (product.html, cart.html) nếu chưa có
function ensureChatWidgetExistsOnPage() {
  if (document.getElementById('wixChatPopup') || document.getElementById('chatbot-window')) return;

  // Chèn CSS cơ bản nếu trang phụ không nạp wix-overrides.css
  if (!document.querySelector('link[href*="wix-overrides.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/wix-overrides.css';
    document.head.appendChild(link);
  }

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <button type="button" class="minimizedButtonV2" onclick="toggleWixChat()" style="position:fixed;bottom:24px;right:24px;z-index:99998;background:#ffc800;color:#1c1917;border:none;border-radius:30px;padding:12px 22px;font-family:'Montserrat',sans-serif;font-size:15px;font-weight:700;box-shadow:0 6px 20px rgba(0,0,0,0.2);cursor:pointer;display:flex;align-items:center;gap:8px;">
      <span>💬</span> <span>Trò chuyện với chúng tôi</span>
    </button>
    <div class="wix-chat-popup" id="wixChatPopup" style="display: none;">
      <div class="wix-chat-popup-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 18px;">✨</span>
          <div>
            <h5 style="margin: 0; font-size: 14px; font-weight: 700; color: #222;">Trợ lý Thorakao</h5>
            <span style="font-size: 11px; color: #444;">Trả lời tự động theo dữ liệu Website</span>
          </div>
        </div>
        <button type="button" class="wix-chat-close-btn" onclick="closeWixChat()" title="Đóng chat" aria-label="Đóng chat">&times;</button>
      </div>
      <div class="wix-chat-popup-body" id="wixChatMessages">
        <div class="wix-chat-msg bot">
          Xin chào bạn! 👋 Mình là Trợ lý tư vấn chiến dịch <strong>Nếp Tóc Thorakao</strong>.<br><br>
          Bạn có thể nhập bất kỳ câu hỏi nào về <strong>Dầu gội bồ kết 750ml (113.000₫)</strong>, thành phần, cách chăm sóc tóc, chính sách Freeship hay đổi trả nhé!
        </div>
        <div class="wix-chat-chips">
          <button type="button" class="wix-chip-btn" onclick="sendWixChatMessage('Dầu gội bồ kết giá bao nhiêu và mua 2 chai tính sao?')">🧴 Giá & Ưu đãi 2 chai?</button>
          <button type="button" class="wix-chip-btn" onclick="sendWixChatMessage('Thành phần và công dụng của dầu gội bồ kết Thorakao?')">🌿 Thành phần & Công dụng</button>
          <button type="button" class="wix-chip-btn" onclick="sendWixChatMessage('Tóc hay bết dầu hoặc gãy rụng dùng có hợp không?')">✨ Tư vấn theo loại tóc</button>
          <button type="button" class="wix-chip-btn" onclick="sendWixChatMessage('Chính sách vận chuyển và đổi trả thế nào?')">🚚 Vận chuyển & Đổi trả</button>
        </div>
      </div>
      <form class="wix-chat-input-bar" onsubmit="event.preventDefault(); sendWixChatMessage();">
        <input type="text" id="wixChatInput" placeholder="Nhập mọi câu hỏi của bạn..." autocomplete="off">
        <button type="submit" aria-label="Gửi">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(wrapper);
}

// Khởi tạo sự kiện Chatbot duy nhất, không bị xung đột
document.addEventListener('DOMContentLoaded', () => {
  ensureChatWidgetExistsOnPage();
  harvestPageDOMKnowledge();
  restoreChatHistoryFromSession();

  // Gắn sự kiện mở/đóng cho nút vàng "Trò chuyện với chúng tôi"
  const chatBtn = document.querySelector('.minimizedButtonV2');
  if (chatBtn && !chatBtn.dataset.chatBound) {
    chatBtn.dataset.chatBound = 'true';
    chatBtn.style.cursor = 'pointer';
    chatBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleWixChat();
    });
  }

  // Nhấn vào bong bóng thông báo "Cần trợ giúp? Hỏi tôi bất cứ điều gì." cũng mở khung chat (trừ nút X đóng)
  const bubble = document.querySelector('.notificationBubbleV2');
  if (bubble && !bubble.dataset.chatBound) {
    bubble.dataset.chatBound = 'true';
    bubble.style.cursor = 'pointer';
    bubble.addEventListener('click', (e) => {
      if (e.target.closest('._closeButton_1h9p7_89') || e.target.closest('button[aria-label="Đóng thông báo"]')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      openWixChat();
    });
  }
});

// Export toàn cục để HTML inline onclick hoạt động 100%
window.openWixChat = openWixChat;
window.closeWixChat = closeWixChat;
window.toggleWixChat = toggleWixChat;
window.sendWixChatMessage = sendWixChatMessage;
window.toggleChatbot = toggleChatbot;
window.closeChatbot = closeChatbot;
window.sendChatMessage = sendChatMessage;
window.analyzeQuery = analyzeQuery;
window.analyzeWixQuery = analyzeWixQuery;
window.handleChatQuickAddToCart = handleChatQuickAddToCart;
window.submitChatLeadToSheet = submitChatLeadToSheet;
