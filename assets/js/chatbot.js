/**
 * CHATBOT.JS - TRỢ LÝ TƯ VẤN NẾP TÓC THORAKAO
 * Mô phỏng chuẩn Wix AI Site Chat với cơ sở tri thức chuyên sâu về chiến dịch.
 */

const CHATBOT_KNOWLEDGE = [
  {
    keywords: ['giá', 'nhiêu', 'tiền', 'cost', 'bao nhieu', 'mua'],
    reply: `Dầu Gội Bồ Kết Thorakao có dung tích <strong>750ml</strong> với mức giá niêm yết chính hãng chỉ <strong>113.000₫/chai</strong>.<br><br>Đặc biệt: Khi bạn mua từ <strong>2 chai trở lên (từ 200.000₫)</strong>, Thorakao hỗ trợ <strong>MIỄN PHÍ VẬN CHUYỂN</strong> toàn quốc! Bạn có thể nhấn <a href="product.html" style="color:var(--color-primary);font-weight:700;text-decoration:underline;">vào đây</a> để đặt hàng ngay nhé!`
  },
  {
    keywords: ['ship', 'vận chuyển', 'giao hàng', 'free ship', 'freeship', 'phi ship'],
    reply: `Chính sách vận chuyển của Thorakao rất ưu đãi:<br>• <strong>Miễn phí vận chuyển</strong> cho đơn hàng từ <strong>200.000 VNĐ</strong> trở lên.<br>• Đơn hàng dưới 200.000 VNĐ áp dụng phí vận chuyển đồng giá <strong>25.000 VNĐ/đơn</strong> trên toàn quốc!`
  },
  {
    keywords: ['bết', 'dầu', 'bết dầu', 'da dầu', 'nhờn'],
    reply: `Nếu tóc bạn dễ bết dầu ở chân tóc, bạn thuộc nhóm <strong>"Nếp tóc thích thoáng nhẹ"</strong>. Dầu gội bồ kết Thorakao chứa saponin và flavonoid tự nhiên giúp làm sạch sâu bã nhờn, trả lại độ bồng bềnh và tơi xốp cho chân tóc mà không gây khô rít.<br><br>👉 Bạn hãy thử ngay bài <a href="#quizz" onclick="closeChatbot()" style="color:var(--color-primary);font-weight:700;text-decoration:underline;">Mini Quiz "Nếp Tóc"</a> để nhận gợi ý chăm sóc chuẩn nhé!`
  },
  {
    keywords: ['khô', 'xơ', 'rối', 'rụng', 'gãy', 'yếu'],
    reply: `Với mái tóc khô xơ hoặc dễ gãy rụng, bồ kết Thorakao cung cấp chất chống oxy hóa tự nhiên giúp chân tóc chắc khỏe, giảm gãy rụng và nuôi dưỡng sợi tóc đen mượt óng ả. Bạn nên kết hợp thêm dầu xả ở phần ngọn tóc để mái tóc thêm phần mềm mại!`
  },
  {
    keywords: ['quiz', 'trắc nghiệm', 'nếp tóc', 'test', 'chẩn đoán'],
    reply: `Chiến dịch đang có Mini Quiz 5 câu <strong>"Nếp tóc - Nếp riêng?"</strong> giúp bạn phân tích chất tóc (Thoáng nhẹ, Cần nâng niu, Theo gu riêng) và nhận bí quyết chăm tóc chuẩn KOC.<br><br>👉 Bạn có thể <a href="#quizz" onclick="closeChatbot()" style="color:var(--color-primary);font-weight:700;text-decoration:underline;">nhấn vào đây để làm bài Quiz ngay</a> nhé!`
  },
  {
    keywords: ['thành phần', 'công dụng', 'bồ kết', 'tác dụng'],
    reply: `Sản phẩm có thành phần chính từ <strong>chiết xuất bồ kết thiên nhiên</strong> giàu Flavonoid & Tanin, kết hợp các hợp chất làm sạch lành tính giúp:<br>1. Làm sạch gàu và bã nhờn da đầu.<br>2. Giúp tóc đen bóng, mượt mà và óng ả tự nhiên.<br>3. Kích thích mọc tóc và nuôi dưỡng nang tóc chắc khỏe.<br>4. Lưu hương thơm thảo mộc truyền thống thư giãn.`
  },
  {
    keywords: ['cách dùng', 'sử dụng', 'gội', 'hướng dẫn'],
    reply: `Quy trình gội đầu chuẩn hiệu quả:<br><strong>Bước 1:</strong> Làm ướt đều tóc.<br><strong>Bước 2:</strong> Lấy lượng dầu gội vừa đủ, massage nhẹ nhàng trên da đầu trong 2-3 phút để dưỡng chất bồ kết thẩm thấu.<br><strong>Bước 3:</strong> Xả lại thật kỹ bằng nước sạch.`
  },
  {
    keywords: ['địa chỉ', 'cửa hàng', 'ở đâu', 'hotline', 'liên hệ', 'sđt', 'phone'],
    reply: `Bạn có thể liên hệ Thorakao qua:<br>• <strong>Địa chỉ:</strong> 241 bis Cách Mạng Tháng Tám, Phường Bàn Cờ, TP. Hồ Chí Minh.<br>• <strong>Hotline:</strong> 028 8887 3241.<br>• <strong>Email:</strong> info@thorakao.com.`
  },
  {
    keywords: ['đổi trả', 'hoàn tiền', 'bảo hành', 'lỗi'],
    reply: `Thorakao cam kết đổi trả sản phẩm nếu có lỗi bao bì hoặc hư hỏng trong quá trình vận chuyển. Quý khách vui lòng giữ nguyên hiện trạng sản phẩm và liên hệ hotline 028 8887 3241 để được hỗ trợ nhanh nhất ạ!`
  }
];

function toggleChatbot() {
  const win = document.getElementById('chatbot-window');
  const bubble = document.getElementById('chatbot-tooltip-bubble');
  if (win) {
    win.classList.toggle('open');
    if (bubble && win.classList.contains('open')) {
      bubble.style.display = 'none';
    }
  }
}

function closeChatbot() {
  const win = document.getElementById('chatbot-window');
  if (win) win.classList.remove('open');
}

function closeChatbotTooltip(e) {
  if (e) e.stopPropagation();
  const bubble = document.getElementById('chatbot-tooltip-bubble');
  if (bubble) bubble.style.display = 'none';
}

function sendChatMessage(text = null) {
  const input = document.getElementById('chatbot-input-field');
  const msg = text || (input ? input.value.trim() : '');
  if (!msg) return;

  const messagesContainer = document.getElementById('chatbot-messages-body');
  if (!messagesContainer) return;

  // 1. Render tin nhắn User
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.innerText = msg;
  messagesContainer.appendChild(userBubble);

  if (input) input.value = '';
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // 2. Phân tích câu hỏi và trả lời tự động sau 400ms
  setTimeout(() => {
    const reply = analyzeQuery(msg);
    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot';
    botBubble.innerHTML = reply;
    messagesContainer.appendChild(botBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 400);
}

function analyzeQuery(text) {
  const lower = text.toLowerCase();
  for (const item of CHATBOT_KNOWLEDGE) {
    if (item.keywords.some(k => lower.includes(k))) {
      return item.reply;
    }
  }

  return `Cảm ơn câu hỏi của bạn! Với thắc mắc này, bạn có thể tham khảo mục <strong>FAQ (Câu hỏi thường gặp)</strong> hoặc gửi tin nhắn qua <strong>Form Liên Hệ</strong> để chuyên viên Thorakao hỗ trợ bạn chi tiết nhất nhé!<br><br>Bạn cũng có thể thử các câu hỏi nhanh bên dưới ạ:
  <div class="chat-chips-wrap">
    <button type="button" class="chat-chip" onclick="sendChatMessage('Dầu gội bồ kết giá bao nhiêu?')">🧴 Giá bao nhiêu?</button>
    <button type="button" class="chat-chip" onclick="sendChatMessage('Chính sách freeship?')">🚚 Phí ship thế nào?</button>
    <button type="button" class="chat-chip" onclick="sendChatMessage('Mini quiz nếp tóc')">🎯 Làm bài Quiz nếp tóc</button>
  </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('chatbot-input-field');
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendChatMessage();
      }
    });
  }
});
