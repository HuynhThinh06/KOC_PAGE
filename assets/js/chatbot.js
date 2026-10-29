/**
 * CHATBOT.JS - TRỢ LÝ TƯ VẤN NẾP TÓC THORAKAO
 * Tương thích 100% với giao diện Wix AI Site Chat và Widget Trợ lý Thorakao
 */

const CHATBOT_KNOWLEDGE = [
  {
    keywords: ['giá', 'nhiêu', 'tiền', 'cost', 'bao nhieu', 'mua', 'đặt hàng'],
    reply: `Dầu Gội Bồ Kết Thorakao có dung tích <strong>750ml</strong> với mức giá niêm yết chính hãng chỉ <strong>113.000₫/chai</strong>.<br><br>Đặc biệt: Khi bạn mua từ <strong>2 chai trở lên (từ 200.000₫)</strong>, Thorakao hỗ trợ <strong>MIỄN PHÍ VẬN CHUYỂN</strong> toàn quốc! Bạn có thể nhấn <a href="product.html" style="color:#781816;font-weight:700;text-decoration:underline;">vào đây</a> để đặt hàng ngay nhé!`
  },
  {
    keywords: ['ship', 'vận chuyển', 'giao hàng', 'free ship', 'freeship', 'phí ship'],
    reply: `Chính sách vận chuyển của Thorakao rất ưu đãi:<br>• <strong>Miễn phí vận chuyển</strong> cho đơn hàng từ <strong>200.000 VNĐ</strong> trở lên.<br>• Đơn hàng dưới 200.000 VNĐ áp dụng phí vận chuyển đồng giá <strong>25.000 VNĐ/đơn</strong> trên toàn quốc!`
  },
  {
    keywords: ['bết', 'dầu', 'bết dầu', 'da dầu', 'nhờn', 'chân tóc'],
    reply: `Nếu tóc bạn dễ bết dầu ở chân tóc, bạn thuộc nhóm <strong>"Nếp tóc thích thoáng nhẹ"</strong>. Dầu gội bồ kết Thorakao chứa saponin và flavonoid tự nhiên giúp làm sạch sâu bã nhờn, trả lại độ bồng bềnh và tơi xốp cho chân tóc mà không gây khô rít.<br><br>👉 Bạn hãy thử ngay bài <a href="#quizz" onclick="closeChatbot()" style="color:#781816;font-weight:700;text-decoration:underline;">Mini Quiz "Nếp Tóc"</a> để nhận gợi ý chăm sóc chuẩn nhé!`
  },
  {
    keywords: ['khô', 'xơ', 'rối', 'rụng', 'gãy', 'yếu', 'nâng niu'],
    reply: `Với mái tóc khô xơ hoặc dễ gãy rụng, bồ kết Thorakao cung cấp chất chống oxy hóa tự nhiên giúp chân tóc chắc khỏe, giảm gãy rụng và nuôi dưỡng sợi tóc đen mượt óng ả. Bạn nên kết hợp thêm dầu xả ở phần ngọn tóc để mái tóc thêm phần mềm mại!`
  },
  {
    keywords: ['quiz', 'trắc nghiệm', 'nếp tóc', 'test', 'chẩn đoán', 'câu hỏi'],
    reply: `Chiến dịch đang có Mini Quiz 5 câu <strong>"Nếp tóc - Nếp riêng?"</strong> giúp bạn phân tích chất tóc (Thoáng nhẹ, Cần nâng niu, Theo gu riêng) và nhận bí quyết chăm tóc chuẩn KOC.<br><br>👉 Bạn có thể <a href="#quizz" onclick="closeChatbot()" style="color:#781816;font-weight:700;text-decoration:underline;">nhấn vào đây để làm bài Quiz ngay</a> nhé!`
  },
  {
    keywords: ['thành phần', 'công dụng', 'bồ kết', 'tác dụng', 'chất lượng'],
    reply: `Sản phẩm có thành phần chính từ <strong>chiết xuất bồ kết thiên nhiên</strong> giàu Flavonoid & Saponin, kết hợp các dưỡng chất làm sạch lành tính giúp:<br>1. Làm sạch gàu và bã nhờn da đầu nhẹ dịu.<br>2. Nuôi dưỡng chân tóc chắc khỏe, giảm gãy rụng.<br>3. Giúp sợi tóc đen bóng, mượt mà và óng ả tự nhiên.<br>4. Lưu giữ hương thơm thảo mộc truyền thống thư giãn.`
  },
  {
    keywords: ['cách dùng', 'sử dụng', 'gội', 'hướng dẫn', 'mỗi ngày'],
    reply: `Quy trình gội đầu chuẩn hiệu quả:<br><strong>Bước 1:</strong> Làm ướt đều tóc bằng nước ấm hoặc mát.<br><strong>Bước 2:</strong> Lấy một lượng dầu gội vừa đủ, massage nhẹ nhàng trên da đầu trong 2-3 phút để dưỡng chất bồ kết thẩm thấu.<br><strong>Bước 3:</strong> Xả lại thật kỹ bằng nước sạch.`
  },
  {
    keywords: ['địa chỉ', 'cửa hàng', 'ở đâu', 'hotline', 'liên hệ', 'sđt', 'phone', 'email'],
    reply: `Bạn có thể liên hệ Thorakao qua:<br>• <strong>Địa chỉ:</strong> 241 bis Cách Mạng Tháng Tám, Phường Bàn Cờ, TP. Hồ Chí Minh.<br>• <strong>Hotline:</strong> 028 8887 3241.<br>• <strong>Email:</strong> info@thorakao.com.`
  },
  {
    keywords: ['đổi trả', 'hoàn tiền', 'bảo hành', 'lỗi', 'chính sách'],
    reply: `Thorakao cam kết hỗ trợ đổi mới hoặc hoàn tiền nếu sản phẩm bị hư hỏng trong quá trình vận chuyển hoặc có lỗi từ nhà sản xuất. Quý khách vui lòng giữ nguyên hiện trạng sản phẩm và liên hệ hotline 028 8887 3241 để được giải quyết nhanh nhất!`
  }
];

function toggleChatbot() {
  const win = document.getElementById('chatbot-window') || document.getElementById('chatPopupBox');
  const bubble = document.getElementById('chatbot-tooltip-bubble') || document.getElementById('chatTooltipBubble');
  if (win) {
    const isOpen = win.classList.contains('open') || win.style.display === 'flex';
    if (isOpen) {
      closeChatbot();
    } else {
      win.classList.add('open');
      win.style.display = 'flex';
      if (bubble) bubble.style.display = 'none';
      const input = document.getElementById('chatbot-input-field') || document.getElementById('chatInputText');
      if (input) setTimeout(() => input.focus(), 150);
    }
  }
}

function closeChatbot() {
  const win = document.getElementById('chatbot-window') || document.getElementById('chatPopupBox');
  if (win) {
    win.classList.remove('open');
    win.style.display = 'none';
  }
}

function closeChatbotTooltip(e) {
  if (e) e.stopPropagation();
  const bubble = document.getElementById('chatbot-tooltip-bubble') || document.getElementById('chatTooltipBubble');
  if (bubble) bubble.style.display = 'none';
}

function sendChatMessage(text = null) {
  const input = document.getElementById('chatbot-input-field') || document.getElementById('chatInputText');
  const msg = text || (input ? input.value.trim() : '');
  if (!msg) return;

  const messagesContainer = document.getElementById('chatbot-messages-body') || document.getElementById('chatMessages');
  if (!messagesContainer) return;

  // 1. Render tin nhắn User
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.innerText = msg;
  messagesContainer.appendChild(userBubble);

  if (input) input.value = '';
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // 2. Phân tích câu hỏi và trả lời tự động sau 350ms
  setTimeout(() => {
    const reply = analyzeQuery(msg);
    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot';
    botBubble.innerHTML = reply;
    messagesContainer.appendChild(botBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 350);
}

function analyzeQuery(text) {
  const lower = text.toLowerCase();
  for (const item of CHATBOT_KNOWLEDGE) {
    if (item.keywords.some(k => lower.includes(k))) {
      return item.reply;
    }
  }

  return `Cảm ơn câu hỏi của bạn! Với thắc mắc này, bạn có thể tham khảo mục <strong>FAQ (Câu hỏi thường gặp)</strong> hoặc gửi tin nhắn qua <strong>Form Liên Hệ</strong> để chuyên viên Thorakao hỗ trợ bạn chi tiết nhất nhé!<br><br>Gợi ý các câu hỏi nhanh:
  <div class="chat-chips-wrap" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
    <button type="button" class="chat-chip" onclick="sendChatMessage('Dầu gội bồ kết giá bao nhiêu?')">🧴 Giá bao nhiêu?</button>
    <button type="button" class="chat-chip" onclick="sendChatMessage('Chính sách freeship thế nào?')">🚚 Phí ship thế nào?</button>
    <button type="button" class="chat-chip" onclick="sendChatMessage('Mini quiz nếp tóc')">🎯 Làm bài Quiz nếp tóc</button>
  </div>`;
}

// Lắng nghe sự kiện click trên các nút Chat (Cả nút Wix lẫn nút Thorakao)
document.addEventListener('DOMContentLoaded', () => {
  // Gắn sự kiện cho nút chat gốc của Wix nếu có
  const wixChatTriggers = document.querySelectorAll('.minimizedButtonV2, [data-hook="ai-site-chat-root"], [data-hook="popover-element"]');
  wixChatTriggers.forEach(btn => {
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleChatbot();
    });
  });

  // Lắng nghe sự kiện Enter trên ô input
  const input = document.getElementById('chatbot-input-field') || document.getElementById('chatInputText');
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendChatMessage();
      }
    });
  }

  // Lắng nghe submit form nếu có
  const chatForm = document.getElementById('chatInputForm');
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sendChatMessage();
    });
  }
});
