/**
 * MAIN.JS - CÁC TƯƠNG TÁC CHÍNH CỦA WEBSITE NẾP TÓC THORAKAO
 * Xử lý Menu, FAQ Accordion gốc Wix, Form Liên Hệ & Newsletter, Toast, Cart Drawer
 */

document.addEventListener('DOMContentLoaded', () => {
  initWixFAQ();
  initWixForms();
  initHeaderCartTrigger();
  updateHeaderCartCount();
});

// 1. TƯƠNG TÁC FAQ ACCORDION GỐC CỦA WIX
function initWixFAQ() {
  const sec10 = document.getElementById('comp-mvq8wnvx');
  if (!sec10) return;

  // Lấy tất cả các mục FAQ accordion
  const accordionRows = sec10.querySelectorAll('[data-hook="accordion-item-header-content"]');
  
  accordionRows.forEach(header => {
    // Tìm phần tử cha chứa trạng thái aria-expanded
    const parentItem = header.closest('[aria-expanded]') || header.closest('li') || header.parentElement;
    
    // Tìm khung câu trả lời bên trong
    const answerContainer = parentItem ? parentItem.querySelector('[data-id="content-viewer"], [data-hook="accordion-item-content"]') : null;
    
    // Mặc định ẩn các câu trả lời
    if (answerContainer && parentItem.getAttribute('aria-expanded') !== 'true') {
      answerContainer.style.display = 'none';
      answerContainer.style.transition = 'all 0.3s ease';
    }

    header.style.cursor = 'pointer';

    header.addEventListener('click', () => {
      const isExpanded = parentItem.getAttribute('aria-expanded') === 'true';
      
      // Đóng tất cả câu khác
      accordionRows.forEach(otherHeader => {
        const otherParent = otherHeader.closest('[aria-expanded]') || otherHeader.closest('li') || otherHeader.parentElement;
        const otherAns = otherParent ? otherParent.querySelector('[data-id="content-viewer"], [data-hook="accordion-item-content"]') : null;
        if (otherParent && otherParent !== parentItem) {
          otherParent.setAttribute('aria-expanded', 'false');
          if (otherAns) otherAns.style.display = 'none';
        }
      });

      // Bật/tắt câu hiện tại
      if (isExpanded) {
        parentItem.setAttribute('aria-expanded', 'false');
        if (answerContainer) answerContainer.style.display = 'none';
      } else {
        parentItem.setAttribute('aria-expanded', 'true');
        if (answerContainer) answerContainer.style.display = 'block';
      }
    });
  });

  // Tương tác các Tabs ("Sản phẩm", "Mua hàng")
  const tabs = sec10.querySelectorAll('[role="tab"], [data-hook="category-tab"]');
  tabs.forEach(tab => {
    tab.style.cursor = 'pointer';
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
      tab.setAttribute('aria-selected', 'true');
      showToast(`Đã chuyển danh mục: ${tab.innerText.trim()}`);
    });
  });
}

// 2. TƯƠNG TÁC FORMS (LIÊN HỆ & NEWSLETTER)
function initWixForms() {
  // A. Contact Form ở Section 11 (comp-mvqw008w)
  const sec11 = document.getElementById('comp-mvqw008w');
  if (sec11) {
    const submitBtn = sec11.querySelector('button[data-hook="submit-button"]');
    if (submitBtn) {
      submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const inputs = sec11.querySelectorAll('input');
        const textarea = sec11.querySelector('textarea');

        const firstName = inputs[0] ? inputs[0].value.trim() : '';
        const lastName = inputs[1] ? inputs[1].value.trim() : '';
        const email = inputs[2] ? inputs[2].value.trim() : '';
        const message = textarea ? textarea.value.trim() : '';

        if (!email) {
          showToast('Vui lòng nhập địa chỉ Email của bạn!', true);
          if (inputs[2]) inputs[2].focus();
          return;
        }

        if (!message) {
          showToast('Vui lòng nhập nội dung bạn muốn gửi tới Thorakao!', true);
          if (textarea) textarea.focus();
          return;
        }

        const originalText = submitBtn.innerText;
        submitBtn.disabled = true;
        submitBtn.innerText = 'Đang gửi...';

        const formData = {
          type: 'CONTACT',
          firstName: firstName,
          lastName: lastName,
          email: email,
          message: message,
          createdAt: new Date().toISOString()
        };

        // Lưu LocalStorage backup
        try {
          const inquiries = JSON.parse(localStorage.getItem('thorakao_inquiries') || '[]');
          inquiries.push(formData);
          localStorage.setItem('thorakao_inquiries', JSON.stringify(inquiries));
        } catch (err) {
          console.error(err);
        }

        // Gửi tới Google Sheet Webhook nếu có cấu hình
        if (typeof CONFIG !== 'undefined' && CONFIG.GOOGLE_SHEET_WEBHOOK_URL) {
          try {
            await fetch(CONFIG.GOOGLE_SHEET_WEBHOOK_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(formData)
            });
          } catch (err) {
            console.warn('Google Sheet Webhook not responded, saved locally:', err);
          }
        }

        showToast('Cảm ơn bạn! Lời nhắn của bạn đã được gửi thành công đến Thorakao.');
        
        // Reset inputs
        inputs.forEach(inp => inp.value = '');
        if (textarea) textarea.value = '';
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
      });
    }
  }

  // B. Newsletter Form ở Section 12 (comp-kbgakxmn_r_comp-kbgakgyt)
  const sec12 = document.getElementById('comp-kbgakxmn_r_comp-kbgakgyt');
  if (sec12) {
    const subBtn = sec12.querySelector('button[data-hook="submit-button"]');
    if (subBtn) {
      subBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const emailInput = sec12.querySelector('input[type="email"], input');
        const email = emailInput ? emailInput.value.trim() : '';

        if (!email || !email.includes('@')) {
          showToast('Vui lòng nhập email hợp lệ để nhận bản tin!', true);
          if (emailInput) emailInput.focus();
          return;
        }

        const origText = subBtn.innerText;
        subBtn.disabled = true;
        subBtn.innerText = 'Đang đăng ký...';

        const data = {
          type: 'NEWSLETTER',
          email: email,
          createdAt: new Date().toISOString()
        };

        try {
          const subs = JSON.parse(localStorage.getItem('thorakao_subscribers') || '[]');
          if (!subs.includes(email)) subs.push(email);
          localStorage.setItem('thorakao_subscribers', JSON.stringify(subs));
        } catch (err) {
          console.error(err);
        }

        if (typeof CONFIG !== 'undefined' && CONFIG.GOOGLE_SHEET_WEBHOOK_URL) {
          try {
            await fetch(CONFIG.GOOGLE_SHEET_WEBHOOK_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(data)
            });
          } catch (err) {
            console.warn('Webhook error:', err);
          }
        }

        showToast('Chúc mừng! Bạn đã đăng ký nhận thông tin chiến dịch thành công.');
        if (emailInput) emailInput.value = '';
        subBtn.disabled = false;
        subBtn.innerText = origText;
      });
    }
  }
}

// 3. TƯƠNG TÁC GIỎ HÀNG HEADER
function initHeaderCartTrigger() {
  const cartBtn = document.getElementById('open-header-cart') || document.querySelector('a[href*="cart"]');
  if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
      // Nếu có cart drawer, mở drawer thay vì chuyển trang
      if (typeof openCartDrawer === 'function') {
        e.preventDefault();
        openCartDrawer();
      }
    });
  }
}

function updateHeaderCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem('thorakao_cart') || '[]');
    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    // Cập nhật thẻ hiển thị số lượng giỏ hàng trên Header nếu có
    const badge = document.querySelector('#open-header-cart [data-part="item-count"], #open-header-cart span, .header-cart-badge');
    if (badge) {
      badge.innerText = totalQty;
    }
  } catch (e) {
    console.error(e);
  }
}

// 4. TOAST NOTIFICATION UTILITY
function showToast(message, isError = false) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-msg ${isError ? 'toast-error' : 'toast-success'}`;
  toast.innerHTML = `
    <span class="toast-icon">${isError ? '⚠️' : '🌿'}</span>
    <span class="toast-text">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOutToast 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
