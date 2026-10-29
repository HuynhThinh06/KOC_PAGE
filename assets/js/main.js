/**
 * MAIN.JS - CÁC TƯƠNG TÁC CHÍNH CỦA WEBSITE NẾP TÓC THORAKAO
 * Xử lý: Header Smooth Scroll, FAQ Accordion, Forms, Login Modal, Hero Video, Cart Counter, Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initWixFAQ();
  initWixForms();
  initHeroVideo();
  initHeaderCartTrigger();
  updateHeaderCartCount();
});

// 1. SMOOTH SCROLLING CHO ANCHOR LINKS (#quizz, #faq, #contact)
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const hash = this.getAttribute('href');
      if (!hash || hash === '#') return;
      
      const target = document.querySelector(hash) || document.querySelector(`[name="${hash.slice(1)}"]`);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// 2. TƯƠNG TÁC FAQ ACCORDION GỐC CỦA WIX
function initWixFAQ() {
  const sec10 = document.getElementById('comp-mvq8wnvx');
  if (!sec10) return;

  const accordionButtons = sec10.querySelectorAll('button[data-hook="accordion-item-header"]');
  
  accordionButtons.forEach(btn => {
    btn.style.cursor = 'pointer';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const nextContainer = btn.nextElementSibling; // div.rah-static
      const expandIcon = btn.querySelector('[data-hook="expandIcon"]');

      // Đóng tất cả các câu hỏi khác
      accordionButtons.forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          const otherNext = otherBtn.nextElementSibling;
          if (otherNext) {
            otherNext.style.height = '0';
            otherNext.style.overflow = 'hidden';
            otherNext.classList.add('rah-static--height-zero');
            const inner = otherNext.firstElementChild;
            if (inner) inner.style.opacity = '0';
          }
          const otherIcon = otherBtn.querySelector('[data-hook="expandIcon"]');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
      });

      // Bật/tắt câu hiện tại
      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        if (nextContainer) {
          nextContainer.style.height = '0';
          nextContainer.style.overflow = 'hidden';
          nextContainer.classList.add('rah-static--height-zero');
          const inner = nextContainer.firstElementChild;
          if (inner) inner.style.opacity = '0';
        }
        if (expandIcon) expandIcon.style.transform = 'rotate(0deg)';
      } else {
        btn.setAttribute('aria-expanded', 'true');
        if (nextContainer) {
          nextContainer.classList.remove('rah-static--height-zero');
          nextContainer.style.height = 'auto';
          nextContainer.style.overflow = 'visible';
          const inner = nextContainer.firstElementChild;
          if (inner) inner.style.opacity = '1';
        }
        if (expandIcon) expandIcon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // Tương tác các Tabs ("Sản phẩm", "Mua hàng")
  const tabs = sec10.querySelectorAll('[role="tab"], [data-hook="tab-item-0"], [data-hook="tab-item-1"]');
  tabs.forEach((tab, index) => {
    tab.style.cursor = 'pointer';
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.setAttribute('aria-selected', 'false');
      });
      tab.setAttribute('aria-selected', 'true');

      // Lấy danh sách câu hỏi
      const items = sec10.querySelectorAll('li, div.sEjwD5F');
      if (index === 0) {
        // Tab 0: Sản phẩm (7 câu đầu)
        items.forEach((item, idx) => {
          item.style.display = idx < 7 ? 'block' : 'none';
        });
      } else {
        // Tab 1: Mua hàng (câu thứ 8)
        items.forEach((item, idx) => {
          item.style.display = idx >= 7 ? 'block' : 'none';
        });
      }
    });
  });
}

// 3. TỰ ĐỘNG CHẠY VIDEO HERO
function initHeroVideo() {
  const vid = document.getElementById('comp-mpbn2nv6_video');
  if (vid) {
    vid.muted = true;
    vid.playsInline = true;
    vid.play().catch(e => {
      console.log('Video autoplay deferred:', e);
    });
  }
}

// 4. TƯƠNG TÁC FORMS (LIÊN HỆ & NEWSLETTER)
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

        try {
          const inquiries = JSON.parse(localStorage.getItem('thorakao_inquiries') || '[]');
          inquiries.push(formData);
          localStorage.setItem('thorakao_inquiries', JSON.stringify(inquiries));
        } catch (err) {
          console.error(err);
        }

        if (typeof CONFIG !== 'undefined' && CONFIG.GOOGLE_SHEET_WEBHOOK_URL) {
          try {
            await fetch(CONFIG.GOOGLE_SHEET_WEBHOOK_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(formData)
            });
          } catch (err) {
            console.warn('Webhook error:', err);
          }
        }

        showToast('Cảm ơn bạn! Lời nhắn của bạn đã được gửi thành công đến Thorakao.');
        
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

// 5. MODAL ĐĂNG NHẬP THÀNH VIÊN & TRA CỨU ĐƠN HÀNG
function openLoginModal(tab = 'login') {
  const modal = document.getElementById('loginModalBackdrop');
  if (modal) {
    modal.style.display = 'flex';
    switchLoginTab(tab);
  }
}

function closeLoginModal() {
  const modal = document.getElementById('loginModalBackdrop');
  if (modal) modal.style.display = 'none';
}

function switchLoginTab(tab) {
  const loginForm = document.getElementById('memberLoginForm');
  const lookupForm = document.getElementById('orderLookupForm');
  const tabLogin = document.getElementById('tabBtnLogin');
  const tabLookup = document.getElementById('tabBtnLookup');

  if (tab === 'login') {
    if (loginForm) loginForm.style.display = 'block';
    if (lookupForm) lookupForm.style.display = 'none';
    if (tabLogin) tabLogin.classList.add('active');
    if (tabLookup) tabLookup.classList.remove('active');
  } else {
    if (loginForm) loginForm.style.display = 'none';
    if (lookupForm) lookupForm.style.display = 'block';
    if (tabLogin) tabLogin.classList.remove('active');
    if (tabLookup) tabLookup.classList.add('active');
  }
}

function handleMemberLogin(e) {
  e.preventDefault();
  const acc = document.getElementById('loginAccount').value.trim();
  const pass = document.getElementById('loginPassword').value.trim();
  if (!acc || !pass) {
    showToast('Vui lòng nhập đầy đủ tài khoản và mật khẩu!', true);
    return;
  }
  localStorage.setItem('thorakao_user', JSON.stringify({ account: acc, loggedInAt: new Date().toISOString() }));
  showToast(`Xin chào thành viên ${acc}! Bạn đã đăng nhập thành công.`);
  closeLoginModal();

  const loginText = document.querySelector('#btn-login-header ._logOutText_1j3j6_12, #btn-login-header span');
  if (loginText) loginText.innerText = 'Tài khoản';
}

function handleOrderLookup(e) {
  e.preventDefault();
  const phone = document.getElementById('lookupPhone').value.trim();
  const resArea = document.getElementById('lookupResultArea');
  if (!phone) {
    showToast('Vui lòng nhập số điện thoại để tra cứu!', true);
    return;
  }

  let orders = [];
  try {
    orders = JSON.parse(localStorage.getItem('thorakao_orders') || '[]');
  } catch(err) {}

  const userOrders = orders.filter(o => o.phone === phone || o.customerPhone === phone);

  if (userOrders.length > 0) {
    const latest = userOrders[userOrders.length - 1];
    resArea.innerHTML = `
      <div style="background:#eaf7ee;border:1px solid #68d391;padding:12px;border-radius:8px;margin-top:10px;">
        <strong style="color:#22543d;">Đơn hàng #${latest.orderId || latest.id || 'TK-2026'}:</strong><br>
        • Trạng thái: <span style="color:#2f855a;font-weight:700;">Đang xử lý giao hàng</span><br>
        • Sản phẩm: ${latest.items ? latest.items.map(i => i.name).join(', ') : 'Dầu gội bồ kết Thorakao'}<br>
        • Tổng tiền: <strong>${(latest.total || 113000).toLocaleString('vi-VN')}₫</strong>
      </div>
    `;
  } else {
    resArea.innerHTML = `
      <div style="background:#fffaf0;border:1px solid #f6ad55;padding:12px;border-radius:8px;margin-top:10px;">
        <strong style="color:#c05621;">Không tìm thấy đơn hàng cho SĐT ${phone}!</strong><br>
        <span style="font-size:0.85rem;color:#7b341e;">Nếu bạn vừa đặt hàng qua Form hoặc Webhook, đơn hàng đang được hệ thống đồng bộ. Bạn cũng có thể liên hệ hotline <strong>028 8887 3241</strong> để được kiểm tra trực tiếp.</span>
      </div>
    `;
  }
}

// 6. TƯƠNG TÁC GIỎ HÀNG HEADER
function initHeaderCartTrigger() {
  const cartBtn = document.getElementById('open-header-cart');
  if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
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
    const badge = document.querySelector('#open-header-cart [data-hook="items-count"], #open-header-cart span, .header-cart-badge');
    if (badge) {
      badge.textContent = totalQty;
    }
  } catch (e) {
    console.error(e);
  }
}

// 7. TOAST NOTIFICATION UTILITY
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
