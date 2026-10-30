/**
 * MAIN.JS - CÁC TƯƠNG TÁC GỐC CHUẨN WIX CỦA NẾP TÓC THORAKAO
 * Xử lý: Navigation Smooth Scroll, FAQ Accordion, Member Auth (cshoamaist2025@gmail.com),
 * Wix AI Chat, Quiz Modal, Video Hero, Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroVideo();
  initSmoothScroll();
  initWixFAQ();
  initWixChat();
  initWixCartDrawer();
  initNotificationTooltip();
  updateHeaderCartCount();
});

// 0. KHỞI TẠO VIDEO CÂY BỒ KẾT HERO (TĂNG TỐC 2X THEO YÊU CẦU NGƯỜI DÙNG)
function initHeroVideo() {
  const video = document.getElementById('comp-mpbn2nv6_video') || document.querySelector('video');
  if (video) {
    video.playbackRate = 2.0; // Tăng tốc 2x
    video.defaultPlaybackRate = 2.0;

    // Đảm bảo video tự động phát mượt mà
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy fallback: click anywhere to play
        document.addEventListener('click', () => {
          video.play();
        }, { once: true });
      });
    }

    // Luôn giữ playbackRate 2x ngay cả khi video loop lại
    video.addEventListener('ratechange', () => {
      if (video.playbackRate !== 2.0) {
        video.playbackRate = 2.0;
      }
    });

    video.addEventListener('ended', () => {
      video.playbackRate = 2.0;
      video.play();
    });
  }
}

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

// 2. TƯƠNG TÁC FAQ ACCORDION GỐC CỦA WIX & TAB SWITCHING (SẢN PHẨM & MUA HÀNG)
// 5. TƯƠNG TÁC SECTION 10: FAQ ACCORDION & TABS (CHUẨN 100% GIAO DIỆN GỐC)
function initWixFAQ() {
  const sec10 = document.getElementById('comp-mvq8wnvx');
  if (!sec10) return;

  const tabSanPham = sec10.querySelector('[data-hook="tab-item-0"]');
  const tabMuaHang = sec10.querySelector('[data-hook="tab-item-1"]');
  const indicator = sec10.querySelector('.s__2by1lR');
  const groupSanPham = document.getElementById('faqAccordionSanPham');
  const groupMuaHang = document.getElementById('faqAccordionMuaHang');

  function updateIndicator(activeTab) {
    if (!indicator || !activeTab) return;
    const left = activeTab.offsetLeft || 0;
    const width = activeTab.offsetWidth || 165;
    indicator.style.left = left + 'px';
    indicator.style.width = width + 'px';
  }

  function switchFAQTab(tabIndex) {
    if (tabIndex === 0) {
      if (tabSanPham) {
        tabSanPham.setAttribute('aria-selected', 'true');
        tabSanPham.setAttribute('data-tab-active', 'true');
        tabSanPham.classList.add('oW7Yi2b--isActive');
      }
      if (tabMuaHang) {
        tabMuaHang.setAttribute('aria-selected', 'false');
        tabMuaHang.setAttribute('data-tab-active', 'false');
        tabMuaHang.classList.remove('oW7Yi2b--isActive');
      }
      if (groupSanPham) {
        groupSanPham.classList.remove('is-hidden');
        groupSanPham.classList.add('is-visible');
        groupSanPham.style.setProperty('display', 'block', 'important');
      }
      if (groupMuaHang) {
        groupMuaHang.classList.remove('is-visible');
        groupMuaHang.classList.add('is-hidden');
        groupMuaHang.style.setProperty('display', 'none', 'important');
      }
      updateIndicator(tabSanPham);
    } else {
      if (tabMuaHang) {
        tabMuaHang.setAttribute('aria-selected', 'true');
        tabMuaHang.setAttribute('data-tab-active', 'true');
        tabMuaHang.classList.add('oW7Yi2b--isActive');
      }
      if (tabSanPham) {
        tabSanPham.setAttribute('aria-selected', 'false');
        tabSanPham.setAttribute('data-tab-active', 'false');
        tabSanPham.classList.remove('oW7Yi2b--isActive');
      }
      if (groupSanPham) {
        groupSanPham.classList.remove('is-visible');
        groupSanPham.classList.add('is-hidden');
        groupSanPham.style.setProperty('display', 'none', 'important');
      }
      if (groupMuaHang) {
        groupMuaHang.classList.remove('is-hidden');
        groupMuaHang.classList.add('is-visible');
        groupMuaHang.style.setProperty('display', 'block', 'important');
      }
      updateIndicator(tabMuaHang);
    }
  }

  if (tabSanPham) {
    tabSanPham.style.cursor = 'pointer';
    tabSanPham.addEventListener('click', (e) => {
      e.preventDefault();
      switchFAQTab(0);
    });
  }

  if (tabMuaHang) {
    tabMuaHang.style.cursor = 'pointer';
    tabMuaHang.addEventListener('click', (e) => {
      e.preventDefault();
      switchFAQTab(1);
    });
  }

  // Khởi tạo vị trí gạch dưới ban đầu
  setTimeout(() => updateIndicator(tabSanPham), 250);
  window.addEventListener('resize', () => {
    const isMuaHangActive = tabMuaHang && tabMuaHang.getAttribute('aria-selected') === 'true';
    updateIndicator(isMuaHangActive ? tabMuaHang : tabSanPham);
  });

  // Tương tác mở/đóng từng câu hỏi cho toàn bộ câu hỏi (cả 2 tab)
  const accordionButtons = sec10.querySelectorAll('button[data-hook="accordion-item-header"]');
  
  accordionButtons.forEach(btn => {
    btn.style.cursor = 'pointer';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const nextContainer = btn.nextElementSibling; // div.rah-static
      const expandIcon = btn.querySelector('[data-hook="expandIcon"]');
      const currentGroup = btn.closest('.srTu8ol') || sec10;

      // Đóng các câu khác trong cùng nhóm
      const groupButtons = currentGroup.querySelectorAll('button[data-hook="accordion-item-header"]');
      groupButtons.forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          const otherNext = otherBtn.nextElementSibling;
          if (otherNext) {
            otherNext.style.height = '0';
            otherNext.style.overflow = 'hidden';
            otherNext.classList.add('rah-static--height-zero');
            const inner = otherNext.firstElementChild;
            if (inner) {
              inner.style.opacity = '0';
              inner.style.display = 'none';
            }
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
          if (inner) {
            inner.style.opacity = '0';
            inner.style.display = 'none';
          }
        }
        if (expandIcon) expandIcon.style.transform = 'rotate(0deg)';
      } else {
        btn.setAttribute('aria-expanded', 'true');
        if (nextContainer) {
          nextContainer.classList.remove('rah-static--height-zero');
          nextContainer.style.height = 'auto';
          nextContainer.style.overflow = 'visible';
          const inner = nextContainer.firstElementChild;
          if (inner) {
            inner.style.display = 'block';
            inner.style.opacity = '1';
          }
        }
        if (expandIcon) expandIcon.style.transform = 'rotate(180deg)';
      }
    });
  });
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
  if (popup.classList.contains('open') && popup.style.display !== 'none') {
    closeWixChat();
  } else {
    openWixChat();
  }
}

function closeWixChat() {
  const popup = document.getElementById('wixChatPopup');
  if (popup) {
    popup.classList.remove('open');
    popup.style.display = 'none';
  }
}

function openWixChat() {
  const popup = document.getElementById('wixChatPopup');
  if (popup) {
    popup.style.display = 'flex';
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

// ==========================================
// 11. QUIZ TRẮC NGHIỆM NẾP TÓC - LOGIC HOÀN CHỈNH
// ==========================================
const thorakaoQuizData = [
  {
    question: "Q1: Mái tóc của bạn thường gặp tình trạng nào nhất?",
    options: [
      { key: 'A', text: "A. Dễ bết dầu, nhất là phần chân tóc." },
      { key: 'B', text: "B. Khô, dễ rối hoặc thiếu độ mềm mại." },
      { key: 'C', text: "C. Tương đối ổn định, ít gặp vấn đề." }
    ]
  },
  {
    question: "Q2: Bạn thường gội đầu với tần suất như thế nào?",
    options: [
      { key: 'A', text: "A. Hằng ngày hoặc cách 1 ngày vì tóc nhanh bết." },
      { key: 'B', text: "B. 2 - 3 ngày một lần, ngọn tóc có dấu hiệu khô." },
      { key: 'C', text: "C. Tùy theo lịch sinh hoạt hoặc khi vận động nhiều." }
    ]
  },
  {
    question: "Q3: Cảm giác da đầu sau khi gội khiến bạn hài lòng nhất là gì?",
    options: [
      { key: 'A', text: "A. Thật sạch thoáng, nhẹ tênh và tơi bồng chân tóc." },
      { key: 'B', text: "B. Mềm mượt, không bị rít hay khô xơ ngọn tóc." },
      { key: 'C', text: "C. Thoải mái tự nhiên cùng hương thảo mộc mộc mạc." }
    ]
  },
  {
    question: "Q4: Mái tóc của bạn có thường tiếp xúc với hóa chất hay tạo kiểu không?",
    options: [
      { key: 'A', text: "A. Hầu như không, ưu tiên giữ mái tóc mộc tự nhiên." },
      { key: 'B', text: "B. Có uốn, nhuộm hoặc tạo kiểu nhiệt định kỳ." },
      { key: 'C', text: "C. Thỉnh thoảng sấy nhẹ hoặc tạo kiểu khi ra ngoài." }
    ]
  },
  {
    question: "Q5: Kỳ vọng lớn nhất của bạn khi chọn dầu gội bồ kết truyền thống là gì?",
    options: [
      { key: 'A', text: "A. Làm sạch dầu thừa dịu nhẹ, giữ tóc bồng bềnh sạch lâu." },
      { key: 'B', text: "B. Phục hồi và dưỡng sợi tóc đen mượt, chắc khỏe tự nhiên." },
      { key: 'C', text: "C. Nuôi dưỡng da đầu an toàn từ thảo dược Việt Nam." }
    ]
  }
];

const thorakaoQuizResults = {
  A: {
    pill: "Nếp tóc thích thoáng nhẹ",
    trait: "Bạn thường quan tâm đến tình trạng tóc nhanh bết và mong muốn duy trì cảm giác sạch thoáng, dễ chịu sau mỗi lần gội.",
    advice: "Ưu tiên làm sạch da đầu nhẹ nhàng, lựa chọn tần suất gội phù hợp với mức độ tiết dầu và hạn chế sử dụng quá nhiều sản phẩm dưỡng ở chân tóc.",
    explore: "Hãy tìm hiểu dầu gội bồ kết Thorakao và tham khảo trải nghiệm của các KOC về khả năng làm sạch, cảm giác da đầu sau gội để cân nhắc mức độ phù hợp với bản thân."
  },
  B: {
    pill: "Nếp tóc ưa dưỡng ẩm phục hồi",
    trait: "Mái tóc của bạn dễ bị khô ráp hoặc thiếu độ mềm mại ở phần thân và ngọn tóc, đặc biệt sau các lần tiếp xúc hóa chất hay tạo kiểu.",
    advice: "Nên sử dụng nước mát hoặc ấm nhẹ khi gội, kết hợp dầu xả bồ kết cho phần ngọn tóc và bổ sung dưỡng chất tự nhiên bảo vệ sợi tóc.",
    explore: "Dầu gội bồ kết Thorakao chứa dưỡng chất thảo mộc tự nhiên giúp cấp ẩm dịu nhẹ và giữ sợi tóc suôn mượt óng ả."
  },
  C: {
    pill: "Nếp tóc cân bằng thanh lịch",
    trait: "Bạn sở hữu mái tóc tương đối khỏe khoắn, ổn định và yêu thích cảm giác thư thái tự nhiên từ hương bồ kết mộc mạc.",
    advice: "Duy trì chế độ chăm sóc tóc dịu nhẹ với thảo mộc thiên nhiên, giữ da đầu luôn thông thoáng và bảo vệ tóc trước ánh nắng mặt trời.",
    explore: "Dầu gội bồ kết Thorakao 750ml là người bạn đồng hành lý tưởng cho cả gia đình, lưu giữ nét đẹp truyền thống của mái tóc Việt."
  }
};

let currentQuizIndex = 0;
let userQuizAnswers = [];

function renderQuizQuestion() {
  const qData = thorakaoQuizData[currentQuizIndex];
  if (!qData) return;

  const titleEl = document.getElementById('quizQuestionTitle');
  const listEl = document.getElementById('quizOptionsList');
  const progressFill = document.getElementById('quizProgressFill');
  const navRow = document.getElementById('quizNavRow');
  const qView = document.getElementById('quizQuestionView');
  const resView = document.getElementById('quizResultView');

  if (qView) qView.style.display = 'block';
  if (resView) resView.style.display = 'none';

  if (titleEl) titleEl.textContent = qData.question;

  if (listEl) {
    listEl.innerHTML = qData.options.map(opt => `
      <button type="button" class="quiz-opt-btn" onclick="selectQuizOption('${opt.key}', this)">
        ${opt.text}
      </button>
    `).join('');
  }

  // Cập nhật thanh tiến độ theo câu hỏi
  const percent = Math.round(((currentQuizIndex + 1) / thorakaoQuizData.length) * 100);
  if (progressFill) {
    progressFill.style.width = percent + '%';
  }

  if (navRow) {
    navRow.style.display = currentQuizIndex > 0 ? 'block' : 'none';
  }
}

function selectQuizOption(choiceKey, btnEl) {
  // Highlight nút được chọn
  if (btnEl) {
    const parent = btnEl.parentElement;
    if (parent) {
      parent.querySelectorAll('.quiz-opt-btn').forEach(b => b.classList.remove('active'));
    }
    btnEl.classList.add('active');
  }

  userQuizAnswers[currentQuizIndex] = choiceKey;

  setTimeout(() => {
    if (currentQuizIndex < thorakaoQuizData.length - 1) {
      currentQuizIndex++;
      renderQuizQuestion();
    } else {
      showQuizResult();
    }
  }, 250);
}

function prevQuizQuestion() {
  if (currentQuizIndex > 0) {
    currentQuizIndex--;
    renderQuizQuestion();
  }
}

function showQuizResult() {
  // Đếm câu trả lời nhiều nhất
  const counts = { A: 0, B: 0, C: 0 };
  userQuizAnswers.forEach(ans => {
    if (counts[ans] !== undefined) counts[ans]++;
  });

  let topKey = 'A';
  if (counts.B > counts.A && counts.B >= counts.C) topKey = 'B';
  else if (counts.C > counts.A && counts.C > counts.B) topKey = 'C';

  const res = thorakaoQuizResults[topKey] || thorakaoQuizResults.A;

  const qView = document.getElementById('quizQuestionView');
  const resView = document.getElementById('quizResultView');
  const pill = document.getElementById('quizResultPill');
  const trait = document.getElementById('quizResTrait');
  const advice = document.getElementById('quizResAdvice');
  const explore = document.getElementById('quizResExplore');

  if (pill) pill.textContent = res.pill;
  if (trait) trait.textContent = res.trait;
  if (advice) advice.textContent = res.advice;
  if (explore) explore.textContent = res.explore;

  if (qView) qView.style.display = 'none';
  if (resView) {
    resView.style.display = 'block';
    resView.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function restartQuiz() {
  currentQuizIndex = 0;
  userQuizAnswers = [];
  renderQuizQuestion();
  const qSection = document.getElementById('comp-mvqu69vk') || document.getElementById('quizz');
  if (qSection) {
    qSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Khởi chạy Quiz khi tải trang
document.addEventListener('DOMContentLoaded', () => {
  renderQuizQuestion();
  initWixCartDrawer();
  initNotificationTooltip();
});


// ==========================================
// 12. GIỎ HÀNG SLIDE-OUT DRAWER 100% GIAO DIỆN GỐC
// ==========================================
function initWixCartDrawer() {
  // Bắt sự kiện click vào nút giỏ hàng trên header
  const cartBtn = document.getElementById('open-header-cart') || document.querySelector('[data-hook="cart-icon-button"]');
  if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openWixCart();
    });
  }
}

function openWixCart() {
  let drawer = document.getElementById('wixCartDrawer');
  let overlay = document.getElementById('wixCartOverlay');

  if (!drawer) {
    // Tạo overlay và drawer
    overlay = document.createElement('div');
    overlay.id = 'wixCartOverlay';
    overlay.className = 'wix-cart-overlay';
    overlay.onclick = closeWixCart;
    document.body.appendChild(overlay);

    drawer = document.createElement('div');
    drawer.id = 'wixCartDrawer';
    drawer.className = 'wix-cart-drawer';
    document.body.appendChild(drawer);
  }

  renderWixCart();
  overlay.classList.add('open');
  drawer.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeWixCart() {
  const drawer = document.getElementById('wixCartDrawer');
  const overlay = document.getElementById('wixCartOverlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function renderWixCart() {
  const drawer = document.getElementById('wixCartDrawer');
  if (!drawer) return;

  const cart = JSON.parse(localStorage.getItem('thorakao_cart') || '[]');
  const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = cart.reduce((sum, item) => sum + ((item.price || 113000) * (item.quantity || 1)), 0);

  const formatVND = (num) => new Intl.NumberFormat('vi-VN').format(num) + 'đ';

  if (cart.length === 0) {
    drawer.innerHTML = `
      <div class="wix-cart-header">
        <h3 class="wix-cart-title">Giỏ hàng của bạn</h3>
        <button type="button" class="wix-cart-close" onclick="closeWixCart()" aria-label="Đóng giỏ hàng">&times;</button>
      </div>
      <div class="wix-cart-body wix-cart-empty">
        <div class="wix-cart-empty-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="22" y="12" width="20" height="8" rx="2" fill="#E8929A"/>
            <rect x="28" y="6" width="8" height="6" rx="1" fill="#E8929A"/>
            <rect x="18" y="20" width="28" height="38" rx="14" fill="#F8B4BA"/>
            <path d="M32 28C32 28 36 33 36 36C36 38.2 34.2 40 32 40C29.8 40 28 38.2 28 36C28 33 32 28 32 28Z" fill="#FFF"/>
          </svg>
        </div>
        <p class="wix-cart-empty-title">Giỏ hàng của bạn đang trống</p>
        <p class="wix-cart-empty-sub">Hãy chọn thêm dầu gội bồ kết để trải nghiệm nhé!</p>
        <a href="#featured-categories" class="wix-cart-empty-link" onclick="closeWixCart()">Xem sản phẩm</a>
      </div>
      <div class="wix-cart-footer">
        <div class="wix-cart-subtotal-row">
          <span class="wix-cart-subtotal-label">Tạm tính:</span>
          <span class="wix-cart-subtotal-value">0đ</span>
        </div>
        <button type="button" class="wix-cart-btn-primary" onclick="window.location.href='cart.html'">Tiến hành đặt hàng</button>
        <button type="button" class="wix-cart-btn-secondary" onclick="closeWixCart()">Tiếp tục xem trang</button>
      </div>
    `;
  } else {
    drawer.innerHTML = `
      <div class="wix-cart-header">
        <h3 class="wix-cart-title">Giỏ hàng của bạn (${totalQty})</h3>
        <button type="button" class="wix-cart-close" onclick="closeWixCart()" aria-label="Đóng giỏ hàng">&times;</button>
      </div>
      <div class="wix-cart-body wix-cart-items">
        ${cart.map((item, idx) => `
          <div class="wix-cart-item-row">
            <img src="${item.image || 'assets/images/product-bottle.png'}" alt="${item.title}" class="wix-cart-item-img">
            <div class="wix-cart-item-info">
              <h4 class="wix-cart-item-title">${item.title}</h4>
              <div class="wix-cart-item-price">${formatVND(item.price)}</div>
              <div class="wix-cart-item-qty-row">
                <button type="button" class="wix-cart-qty-btn" onclick="updateWixCartQty(${idx}, -1)">-</button>
                <span class="wix-cart-qty-val">${item.quantity || 1}</span>
                <button type="button" class="wix-cart-qty-btn" onclick="updateWixCartQty(${idx}, 1)">+</button>
              </div>
            </div>
            <button type="button" class="wix-cart-item-remove" onclick="removeWixCartItem(${idx})" title="Xóa">✕</button>
          </div>
        `).join('')}
      </div>
      <div class="wix-cart-footer">
        <div class="wix-cart-subtotal-row">
          <span class="wix-cart-subtotal-label">Tạm tính:</span>
          <span class="wix-cart-subtotal-value">${formatVND(subtotal)}</span>
        </div>
        <button type="button" class="wix-cart-btn-primary" onclick="window.location.href='cart.html'">Tiến hành đặt hàng</button>
        <button type="button" class="wix-cart-btn-secondary" onclick="closeWixCart()">Tiếp tục xem trang</button>
      </div>
    `;
  }

  updateHeaderCartCount();
}

function updateWixCartQty(index, delta) {
  let cart = JSON.parse(localStorage.getItem('thorakao_cart') || '[]');
  if (cart[index]) {
    cart[index].quantity = (cart[index].quantity || 1) + delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  }
  localStorage.setItem('thorakao_cart', JSON.stringify(cart));
  renderWixCart();
}

function removeWixCartItem(index) {
  let cart = JSON.parse(localStorage.getItem('thorakao_cart') || '[]');
  cart.splice(index, 1);
  localStorage.setItem('thorakao_cart', JSON.stringify(cart));
  renderWixCart();
}

function initNotificationTooltip() {
  const closeBtn = document.querySelector('._closeButton_1h9p7_89');
  const bubble = document.querySelector('.notificationBubbleV2');
  if (closeBtn && bubble) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      bubble.style.display = 'none';
    });
  }
}


// ==========================================
// 11. WIX MEMBER AUTH (LOGIN / REGISTER MODAL)
// ==========================================

function getLoggedInUser() {
  try {
    const raw = localStorage.getItem('thorakao_user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user && user.loggedIn ? user : null;
  } catch (e) {
    return null;
  }
}

function checkAuthState() {
  const user = getLoggedInUser();
  const label = document.getElementById('loginHeaderLabel');
  const avatarWrap = document.getElementById('loginAvatarIconWrap');
  const dropdownName = document.getElementById('memberDropdownName');
  const dropdownEmail = document.getElementById('memberDropdownEmail');
  const dropdownAvatar = document.getElementById('memberDropdownAvatar');

  if (user) {
    const displayName = user.name || (user.email ? user.email.split('@')[0] : 'Thành viên');
    if (label) label.textContent = displayName;
    if (dropdownName) dropdownName.textContent = displayName;
    if (dropdownEmail) dropdownEmail.textContent = user.email || '';
    
    const initial = (displayName.charAt(0) || 'U').toUpperCase();
    if (dropdownAvatar) dropdownAvatar.textContent = initial;

    if (avatarWrap) {
      avatarWrap.innerHTML = `
        <div style="width: 24px; height: 24px; border-radius: 50%; background: #781816; color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
          ${initial}
        </div>
      `;
    }
  } else {
    if (label) label.textContent = 'Đăng nhập';
    if (avatarWrap) {
      avatarWrap.innerHTML = `
        <div id="defaultAvatar-comp-mb7ogqrp_r_comp-mpbn4c1x" class="_avatarPlaceholder_amy81_32 wixui-vector-image">
          <div data-testid="svgRoot-defaultAvatar-comp-mb7ogqrp_r_comp-mpbn4c1x" class="_svgRoot_zlqkq_19 _nonScalingStroke_zlqkq_55 _avatarPlaceholder_amy81_32">
            <svg data-bbox="0 0 50 50" data-type="shape" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
              <g><path d="M25 48.077c-5.924 0-11.31-2.252-15.396-5.921 2.254-5.362 7.492-8.267 15.373-8.267 7.889 0 13.139 3.044 15.408 8.418-4.084 3.659-9.471 5.77-15.385 5.77m.278-35.3c4.927 0 8.611 3.812 8.611 8.878 0 5.21-3.875 9.456-8.611 9.456s-8.611-4.246-8.611-9.456c0-5.066 3.684-8.878 8.611-8.878M25 0C11.193 0 0 11.193 0 25c0 .915.056 1.816.152 2.705.032.295.091.581.133.873.085.589.173 1.176.298 1.751.073.338.169.665.256.997.135.515.273 1.027.439 1.529.114.342.243.675.37 1.01.18.476.369.945.577 1.406.149.331.308.657.472.98.225.446.463.883.714 1.313.182.312.365.619.56.922.272.423.56.832.856 1.237.207.284.41.568.629.841.325.408.671.796 1.02 1.182.22.244.432.494.662.728.405.415.833.801 1.265 1.186.173.154.329.325.507.475l.004-.011A24.886 24.886 0 0 0 25 50a24.881 24.881 0 0 0 16.069-5.861.126.126 0 0 1 .003.01c.172-.144.324-.309.49-.458.442-.392.88-.787 1.293-1.209.228-.232.437-.479.655-.72.352-.389.701-.78 1.028-1.191.218-.272.421-.556.627-.838.297-.405.587-.816.859-1.24a26.104 26.104 0 0 0 1.748-3.216c.208-.461.398-.93.579-1.406.127-.336.256-.669.369-1.012.167-.502.305-1.014.44-1.53.087-.332.183-.659.256-.996.126-.576.214-1.164.299-1.754.042-.292.101-.577.133-.872.095-.89.152-1.791.152-2.707C50 11.193 38.807 0 25 0"></path></g>
            </svg>
          </div>
        </div>
      `;
    }
  }
}

function handleLoginHeaderClick(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const user = getLoggedInUser();
  if (user) {
    const dropdown = document.getElementById('wixMemberDropdown');
    if (dropdown) {
      const isVisible = dropdown.style.display === 'flex' || dropdown.classList.contains('open');
      dropdown.style.display = isVisible ? 'none' : 'flex';
      dropdown.classList.toggle('open', !isVisible);
    }
  } else {
    openWixLoginModal('login');
  }
}

function openWixLoginModal(tab = 'login') {
  const modal = document.getElementById('wixLoginModal');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('open');
    switchWixAuthTab(tab);
    document.body.style.overflow = 'hidden';
  }
}

function closeWixLoginModal() {
  const modal = document.getElementById('wixLoginModal');
  if (modal) {
    modal.classList.remove('open');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function switchWixAuthTab(tab) {
  const tabLogin = document.getElementById('tabBtnLogin');
  const tabReg = document.getElementById('tabBtnRegister');
  const formLogin = document.getElementById('wixLoginForm');
  const formReg = document.getElementById('wixRegisterForm');
  const title = document.getElementById('wixAuthTitle');
  const subtitle = document.getElementById('wixAuthSubtitle');

  if (tab === 'register') {
    if (tabReg) tabReg.classList.add('active');
    if (tabLogin) tabLogin.classList.remove('active');
    if (formReg) formReg.style.display = 'block';
    if (formLogin) formLogin.style.display = 'none';
    if (title) title.textContent = 'Tạo tài khoản mới';
    if (subtitle) subtitle.textContent = 'Tham gia cùng Thorakao để nhận nhiều ưu đãi độc quyền';
  } else {
    if (tabLogin) tabLogin.classList.add('active');
    if (tabReg) tabReg.classList.remove('active');
    if (formLogin) formLogin.style.display = 'block';
    if (formReg) formReg.style.display = 'none';
    if (title) title.textContent = 'Đăng nhập tài khoản';
    if (subtitle) subtitle.textContent = 'Chào mừng bạn đến với Thorakao - Giữ nếp tóc Việt';
  }
}

function handleMemberSubmit(e) {
  if (e) e.preventDefault();
  const emailInput = document.getElementById('wixLoginEmail');
  const passInput = document.getElementById('wixLoginPass');
  const email = emailInput ? emailInput.value.trim() : '';
  const pass = passInput ? passInput.value : '';

  if (!email) {
    showToast('Vui lòng nhập địa chỉ email!', true);
    return;
  }
  if (!pass) {
    showToast('Vui lòng nhập mật khẩu!', true);
    return;
  }

  const name = email.split('@')[0];
  const user = {
    email: email,
    name: name,
    loggedIn: true,
    loginTime: new Date().toISOString()
  };

  localStorage.setItem('thorakao_user', JSON.stringify(user));
  checkAuthState();
  closeWixLoginModal();
  showToast(`Chào mừng bạn ${name} đã đăng nhập thành công!`);
}

function handleMemberRegister(e) {
  if (e) e.preventDefault();
  const nameInput = document.getElementById('wixRegName');
  const emailInput = document.getElementById('wixRegEmail');
  const phoneInput = document.getElementById('wixRegPhone');
  const passInput = document.getElementById('wixRegPass');

  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const pass = passInput ? passInput.value : '';

  if (!name) {
    showToast('Vui lòng nhập họ và tên!', true);
    return;
  }
  if (!email) {
    showToast('Vui lòng nhập email!', true);
    return;
  }
  if (!pass || pass.length < 6) {
    showToast('Mật khẩu tối thiểu 6 ký tự!', true);
    return;
  }

  const user = {
    email: email,
    name: name,
    phone: phone,
    loggedIn: true,
    loginTime: new Date().toISOString()
  };

  localStorage.setItem('thorakao_user', JSON.stringify(user));
  checkAuthState();
  closeWixLoginModal();
  showToast(`Đăng ký tài khoản thành công! Chào mừng ${name}!`);
}

function handleSocialLogin(provider) {
  const mockUser = {
    email: provider.toLowerCase() + '_user@thorakao.vn',
    name: `Khách hàng ${provider}`,
    loggedIn: true,
    provider: provider,
    loginTime: new Date().toISOString()
  };
  localStorage.setItem('thorakao_user', JSON.stringify(mockUser));
  checkAuthState();
  closeWixLoginModal();
  showToast(`Đăng nhập thành công qua ${provider}!`);
}

function handleForgotPassword(e) {
  if (e) e.preventDefault();
  const email = prompt('Vui lòng nhập email đã đăng ký để nhận mã xác nhận đổi mật khẩu:', 'cshoamaist2025@gmail.com');
  if (email) {
    showToast(`Đã gửi liên kết đặt lại mật khẩu đến ${email}! Vui lòng kiểm tra hộp thư.`);
  }
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (btn) btn.textContent = '🙈';
  } else {
    input.type = 'password';
    if (btn) btn.textContent = '👁️';
  }
}

function handleMemberLogout() {
  localStorage.removeItem('thorakao_user');
  checkAuthState();
  closeMemberDropdown();
  showToast('Đã đăng xuất tài khoản thành công!');
}

function closeMemberDropdown() {
  const dropdown = document.getElementById('wixMemberDropdown');
  if (dropdown) {
    dropdown.style.display = 'none';
    dropdown.classList.remove('open');
  }
}

// Gán toàn cục window
window.handleLoginHeaderClick = handleLoginHeaderClick;
window.openWixLoginModal = openWixLoginModal;
window.closeWixLoginModal = closeWixLoginModal;
window.switchWixAuthTab = switchWixAuthTab;
window.handleMemberSubmit = handleMemberSubmit;
window.handleMemberRegister = handleMemberRegister;
window.handleSocialLogin = handleSocialLogin;
window.handleForgotPassword = handleForgotPassword;
window.togglePasswordVisibility = togglePasswordVisibility;
window.handleMemberLogout = handleMemberLogout;
window.closeMemberDropdown = closeMemberDropdown;
window.checkAuthState = checkAuthState;
window.getLoggedInUser = getLoggedInUser;

// Gọi checkAuthState khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  checkAuthState();
});
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  checkAuthState();
}
