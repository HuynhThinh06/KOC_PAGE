/**
 * MAIN.JS - CÁC TƯƠNG TÁC GỐC CHUẨN WIX CỦA NẾP TÓC THORAKAO
 * Xử lý: Navigation Smooth Scroll, FAQ Accordion, Member Auth (cshoamaist2025@gmail.com),
 * Wix AI Chat, Quiz Modal, Video Hero, Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initWixFAQ();
  initWixForms();
  initHeroVideo();
  initMarqueeBanners();
  checkAuthState();
  initWixChat();
  updateHeaderCartCount();
});

// 1. SMOOTH SCROLLING CHO CÁC LIÊN KẾT ANCHOR MENU
function initSmoothScroll() {
  document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href) return;
      
      let targetSelector = '';
      if (href.startsWith('#')) {
        targetSelector = href;
      } else if (href.includes('#')) {
        targetSelector = '#' + href.split('#')[1];
      }

      if (!targetSelector || targetSelector === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Map alias anchors sang Section ID tương ứng nếu cần
      let target = document.querySelector(targetSelector) || document.querySelector(`[name="${targetSelector.slice(1)}"]`);
      if (!target) {
        if (targetSelector === '#featured-categories' || targetSelector === '#quizz') {
          target = document.getElementById('comp-mvqu69vk');
        } else if (targetSelector === '#phan-11' || targetSelector === '#faq') {
          target = document.getElementById('comp-mvq8wnvx');
        } else if (targetSelector === '#phan-12' || targetSelector === '#contact') {
          target = document.getElementById('comp-mvqw008w');
        }
      }

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

      // Đóng các câu khác
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
      tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
      tab.setAttribute('aria-selected', 'true');

      const items = sec10.querySelectorAll('li, div.sEjwD5F');
      if (index === 0) {
        items.forEach((item, idx) => {
          item.style.display = idx < 7 ? 'block' : 'none';
        });
      } else {
        items.forEach((item, idx) => {
          item.style.display = idx >= 7 ? 'block' : 'none';
        });
      }
    });
  });
}

// 3. TỰ ĐỘNG PHÁT VIDEO HERO VÀ MARQUEE BANNERS
function initHeroVideo() {
  const vid = document.getElementById('comp-mpbn2nv6_video');
  if (vid) {
    vid.muted = true;
    vid.defaultMuted = true;
    vid.setAttribute('muted', '');
    vid.setAttribute('playsinline', '');
    vid.setAttribute('autoplay', '');
    vid.setAttribute('loop', '');

    const tryPlay = () => {
      const p = vid.play();
      if (p !== undefined) {
        p.catch(err => console.log('Autoplay deferred:', err));
      }
    };
    tryPlay();
    window.addEventListener('scroll', tryPlay, { once: true, passive: true });
    document.addEventListener('click', tryPlay, { once: true, passive: true });
    document.addEventListener('touchstart', tryPlay, { once: true, passive: true });

    const playPauseBtn = document.querySelector('.background-video-play-pause-button');
    if (playPauseBtn) {
      playPauseBtn.onclick = (e) => {
        e.preventDefault();
        if (vid.paused) {
          vid.play();
        } else {
          vid.pause();
        }
      };
    }
  }
}

function initMarqueeBanners() {
  const marquees = document.querySelectorAll('._marqueeUnitContainer_z4m05_32, [data-marquee-animation]');
  marquees.forEach(m => {
    m.setAttribute('data-marquee-animation', 'left');
    m.style.setProperty('--marquee-animation-state', 'running');
    m.style.setProperty('--marquee-duration', '25s');
    m.style.animation = '_left_z4m05_1 25s linear infinite';
    m.style.animationPlayState = 'running';
  });
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
          firstName,
          lastName,
          email,
          message,
          createdAt: new Date().toISOString()
        };

        try {
          const list = JSON.parse(localStorage.getItem('thorakao_inquiries') || '[]');
          list.push(formData);
          localStorage.setItem('thorakao_inquiries', JSON.stringify(list));
        } catch (err) {}

        if (typeof CONFIG !== 'undefined' && CONFIG.GOOGLE_SHEET_WEBHOOK_URL) {
          try {
            await fetch(CONFIG.GOOGLE_SHEET_WEBHOOK_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(formData)
            });
          } catch (err) {}
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
          email,
          createdAt: new Date().toISOString()
        };

        try {
          const subs = JSON.parse(localStorage.getItem('thorakao_subscribers') || '[]');
          if (!subs.includes(email)) subs.push(email);
          localStorage.setItem('thorakao_subscribers', JSON.stringify(subs));
        } catch (err) {}

        showToast('Chúc mừng! Bạn đã đăng ký nhận thông tin chiến dịch thành công.');
        if (emailInput) emailInput.value = '';
        subBtn.disabled = false;
        subBtn.innerText = origText;
      });
    }
  }
}

// 5. QUẢN LÝ ĐĂNG NHẬP THÀNH VIÊN WIX (cshoamaist2025@gmail.com / 123456)
function checkAuthState() {
  const auth = JSON.parse(localStorage.getItem('thorakao_auth') || 'null');
  const label = document.getElementById('loginHeaderLabel');
  const avatarWrap = document.getElementById('loginAvatarIconWrap');

  if (auth && auth.email) {
    if (label) label.innerText = auth.name || auth.email.split('@')[0];
    if (avatarWrap) {
      avatarWrap.innerHTML = `
        <div style="width: 24px; height: 24px; border-radius: 50%; background: #781816; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700;">
          ${(auth.initial || auth.email[0]).toUpperCase()}
        </div>
      `;
    }
    const nameEl = document.getElementById('memberDropdownName');
    const emailEl = document.getElementById('memberDropdownEmail');
    const avatarEl = document.getElementById('memberDropdownAvatar');
    if (nameEl) nameEl.innerText = auth.name || auth.email.split('@')[0];
    if (emailEl) emailEl.innerText = auth.email;
    if (avatarEl) avatarEl.innerText = (auth.initial || auth.email[0]).toUpperCase();
  } else {
    if (label) label.innerText = 'Đăng nhập';
    if (avatarWrap) {
      avatarWrap.innerHTML = `
        <div id="defaultAvatar-comp-mb7ogqrp_r_comp-mpbn4c1x" class="_avatarPlaceholder_amy81_32 wixui-vector-image">
          <div data-testid="svgRoot-defaultAvatar-comp-mb7ogqrp_r_comp-mpbn4c1x" class="_svgRoot_zlqkq_19 _nonScalingStroke_zlqkq_55 _avatarPlaceholder_amy81_32">
            <svg data-bbox="0 0 50 50" data-type="shape" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
              <path d="M25 48.077c-5.924 0-11.31-2.252-15.396-5.921 2.254-5.362 7.492-8.267 15.373-8.267 7.889 0 13.139 3.044 15.408 8.418-4.084 3.659-9.471 5.77-15.385 5.77m.278-35.3c4.927 0 8.611 3.812 8.611 8.878 0 5.21-3.875 9.456-8.611 9.456s-8.611-4.246-8.611-9.456c0-5.066 3.684-8.878 8.611-8.878M25 0C11.193 0 0 11.193 0 25c0 .915.056 1.816.152 2.705.032.295.091.581.133.873.085.589.173 1.176.298 1.751.073.338.169.665.256.997.135.515.273 1.027.439 1.529.114.342.243.675.37 1.01.18.476.369.945.577 1.406.149.331.308.657.472.98.225.446.463.883.714 1.313.182.312.365.619.56.922.272.423.56.832.856 1.237.207.284.41.568.629.841.325.408.671.796 1.02 1.182.22.244.432.494.662.728.405.415.833.801 1.265 1.186.173.154.329.325.507.475l.004-.011A24.886 24.886 0 0 0 25 50a24.881 24.881 0 0 0 16.069-5.861.126.126 0 0 1 .003.01c.172-.144.324-.309.49-.458.442-.392.88-.787 1.293-1.209.228-.232.437-.479.655-.72.352-.389.701-.78 1.028-1.191.218-.272.421-.556.627-.838.297-.405.587-.816.859-1.24a26.104 26.104 0 0 0 1.748-3.216c.208-.461.398-.93.579-1.406.127-.336.256-.669.369-1.012.167-.502.305-1.014.44-1.53.087-.332.183-.659.256-.996.126-.576.214-1.164.299-1.754.042-.292.101-.577.133-.872.095-.89.152-1.791.152-2.707C50 11.193 38.807 0 25 0"></path>
            </svg>
          </div>
        </div>
      `;
    }
  }
}

function handleLoginHeaderClick(e) {
  if (e) e.preventDefault();
  const auth = JSON.parse(localStorage.getItem('thorakao_auth') || 'null');
  if (auth && auth.email) {
    const dropdown = document.getElementById('wixMemberDropdown');
    if (dropdown) {
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
  } else {
    openWixLoginModal();
  }
}

function closeMemberDropdown() {
  const dropdown = document.getElementById('wixMemberDropdown');
  if (dropdown) dropdown.style.display = 'none';
}

function openWixLoginModal() {
  const modal = document.getElementById('wixLoginModal');
  if (modal) modal.style.display = 'flex';
}

function closeWixLoginModal() {
  const modal = document.getElementById('wixLoginModal');
  if (modal) modal.style.display = 'none';
}

function handleMemberSubmit(e) {
  e.preventDefault();
  const emailInput = document.getElementById('wixLoginEmail');
  const email = emailInput ? emailInput.value.trim() : '';

  if (!email) {
    showToast('Vui lòng nhập Email!', true);
    return;
  }

  let displayName = email.split('@')[0];
  let initial = email[0].toUpperCase();

  if (email.toLowerCase() === 'cshoamaist2025@gmail.com') {
    displayName = 'cshoamaist2025';
    initial = 'C';
  }

  const authData = {
    email,
    name: displayName,
    initial,
    loggedInAt: new Date().toISOString()
  };

  localStorage.setItem('thorakao_auth', JSON.stringify(authData));
  checkAuthState();
  closeWixLoginModal();
  showToast(`Đăng nhập thành công! Chào mừng ${displayName}.`);
}

function handleMemberLogout() {
  localStorage.removeItem('thorakao_auth');
  closeMemberDropdown();
  checkAuthState();
  showToast('Bạn đã đăng xuất tài khoản.');
}

// 6. TƯƠNG TÁC WIX AI SITE CHAT (Nút vàng nguyên bản góc phải)
function initWixChat() {
  const chatBtn = document.querySelector('.minimizedButtonV2');
  if (chatBtn) {
    chatBtn.style.cursor = 'pointer';
    chatBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleWixChat();
    });
  }

  // Đóng tooltip vàng khi bấm nút x của tooltip
  const closeTooltipBtn = document.querySelector('button[aria-label="Đóng thông báo"]');
  if (closeTooltipBtn) {
    closeTooltipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const popover = document.querySelector('[data-hook="popover-content"]');
      if (popover) popover.style.display = 'none';
    });
  }
}

function toggleWixChat() {
  const popup = document.getElementById('wixChatPopup');
  if (!popup) return;
  popup.classList.toggle('open');
  if (popup.classList.contains('open')) {
    const input = document.getElementById('wixChatInput');
    if (input) setTimeout(() => input.focus(), 150);
  }
}

function closeWixChat() {
  const popup = document.getElementById('wixChatPopup');
  if (popup) popup.classList.remove('open');
}

function openWixChat() {
  const popup = document.getElementById('wixChatPopup');
  if (popup) {
    popup.classList.add('open');
    const input = document.getElementById('wixChatInput');
    if (input) setTimeout(() => input.focus(), 150);
  }
}

function sendWixChatMessage(predefinedText = null) {
  const input = document.getElementById('wixChatInput');
  const msg = predefinedText || (input ? input.value.trim() : '');
  if (!msg) return;

  const container = document.getElementById('wixChatMessages');
  if (!container) return;

  // Tin nhắn người dùng
  const userMsg = document.createElement('div');
  userMsg.className = 'wix-chat-msg user';
  userMsg.innerText = msg;
  container.appendChild(userMsg);

  if (input) input.value = '';
  container.scrollTop = container.scrollHeight;

  // Phản hồi tự động
  setTimeout(() => {
    const reply = analyzeWixQuery(msg);
    const botMsg = document.createElement('div');
    botMsg.className = 'wix-chat-msg bot';
    botMsg.innerHTML = reply;
    container.appendChild(botMsg);
    container.scrollTop = container.scrollHeight;
  }, 350);
}

function analyzeWixQuery(text) {
  const t = text.toLowerCase();
  if (t.includes('giá') || t.includes('bao nhiêu') || t.includes('mua') || t.includes('tiền')) {
    return `Dầu gội bồ kết Thorakao chính hãng <strong>750ml</strong> có giá niêm yết <strong>113.000₫/chai</strong>.<br><br>Đặc biệt: Khi mua từ 2 chai (từ 200.000₫), Thorakao áp dụng chính sách <strong>MIỄN PHÍ VẬN CHUYỂN</strong> toàn quốc! Bạn có thể vào <a href="product.html" style="color:#781816;font-weight:700;">trang sản phẩm</a> để đặt hàng ngay nhé!`;
  }
  if (t.includes('ship') || t.includes('giao hàng') || t.includes('vận chuyển')) {
    return `Chính sách giao hàng:<br>• <strong>Miễn phí vận chuyển</strong> cho đơn hàng từ <strong>200.000₫</strong> trở lên.<br>• Đơn dưới 200.000₫ có phí ship đồng giá toàn quốc chỉ <strong>25.000₫</strong>!`;
  }
  if (t.includes('bết') || t.includes('dầu') || t.includes('nhờn')) {
    return `Với mái tóc dễ bết dầu chân tóc, saponin và flavonoid tự nhiên trong bồ kết Thorakao sẽ làm sạch bã nhờn dịu nhẹ, giúp tóc tơi xốp, bồng bềnh lâu bết hơn.<br><br>👉 Bạn có thể làm ngay <a href="#featured-categories" onclick="toggleWixChat(); openQuizModal();" style="color:#781816;font-weight:700;">Mini Quiz Nếp Tóc</a> để nhận hướng dẫn chuẩn nhé!`;
  }
  if (t.includes('khô') || t.includes('xơ') || t.includes('rụng')) {
    return `Bồ kết chứa nhiều hợp chất chống oxy hóa giúp nang tóc chắc khỏe, giảm gãy rụng và nuôi dưỡng sợi tóc đen mượt óng ả. Bạn nên kết hợp dầu xả ở phần ngọn tóc để duy trì độ mềm mại tối ưu!`;
  }
  if (t.includes('quiz') || t.includes('trắc nghiệm') || t.includes('nếp tóc')) {
    return `Mời bạn tham gia bài <a href="#featured-categories" onclick="toggleWixChat(); openQuizModal();" style="color:#781816;font-weight:700;">Mini Quiz 5 câu "Nếp Tóc"</a> để khám phá nếp tóc của mình nhé!`;
  }
  return `Cảm ơn bạn đã nhắn tin cho Thorakao! Bạn có thể xem thêm mục <strong>FAQ (Câu hỏi thường gặp)</strong> hoặc để lại tin nhắn ở <strong>Form Liên Hệ</strong> để chuyên viên tư vấn hỗ trợ chi tiết nhất nhé!`;
}

// 7. QUIZ SECTION NAVIGATION
function openQuizModal() {
  const section = document.getElementById('comp-mvqu69vk') || document.getElementById('quizz');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (typeof restartQuiz === 'function') {
      restartQuiz();
    }
  }
}

function closeQuizModal() {
  // For backwards compatibility
}

// 8. ĐÓNG CÁC POPUP KHI BẤM PHÍM ESCAPE HOẶC CLICK NGOÀI
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeWixLoginModal();
    closeWixChat();
    closeMemberDropdown();
  }
});

document.addEventListener('click', (e) => {
  const chatPopup = document.getElementById('wixChatPopup');
  const chatBtn = document.querySelector('.minimizedButtonV2');
  if (chatPopup && chatPopup.classList.contains('open')) {
    if (!chatPopup.contains(e.target) && (!chatBtn || !chatBtn.contains(e.target))) {
      closeWixChat();
    }
  }
});

document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('wixMemberDropdown');
  const loginBar = document.getElementById('comp-mb7ogqrp_r_comp-mpbn4c1x');
  if (dropdown && loginBar && !loginBar.contains(e.target)) {
    dropdown.style.display = 'none';
  }
});

// 9. CẬP NHẬT SỐ LƯỢNG GIỎ HÀNG
function updateHeaderCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem('thorakao_cart') || '[]');
    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const badge = document.querySelector('#open-header-cart [data-hook="items-count"], #open-header-cart text');
    if (badge) badge.textContent = totalQty;
  } catch (e) {}
}

// 10. TOAST NOTIFICATION UTILITY
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
