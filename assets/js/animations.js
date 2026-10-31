/**
 * ANIMATIONS.JS - HỆ THỐNG HIỆU ỨNG NGHỆ THUẬT NẾP TÓC THORAKAO
 * "Giữ nếp xưa, Tỏ nếp mình"
 * 1. Cánh hoa đào rơi tại SECTION "THÔNG TIN CHIẾN DỊCH" (#comp-mvq57pzq)
 * 2. Thanh tiến trình "Sợi chỉ đỏ thêu hoa" (Silk Thread Scroll Progress)
 * 3. Gợn sóng nước khi Click chuột (Herbal Water Ripple)
 * 4. Bụi nắng ấm & Đốm sáng hổ phách (Sunlight Dust & Ambient Depth)
 */

(function () {
  function bootAnimations() {
    initCampaignSakuraPetals();
    initScrollProgressBar();
    initClickWaterRipple();
    initSunlightDust();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAnimations);
  } else {
    bootAnimations();
  }

  // ==========================================================================
  // 1. CÁNH HOA ĐÀO RƠI TẠI "THÔNG TIN CHIẾN DỊCH" (#comp-mvq57pzq)
  // ==========================================================================
  function initCampaignSakuraPetals() {
    const section = document.getElementById('comp-mvq57pzq') || document.getElementById('comp-mvq57q0k');
    if (!section) return;

    section.style.position = 'relative';

    const oldCanvas = document.getElementById('sakuraCampaignCanvas');
    if (oldCanvas) oldCanvas.remove();

    const canvas = document.createElement('canvas');
    canvas.id = 'sakuraCampaignCanvas';
    canvas.className = 'sakura-canvas-campaign';
    section.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = 1200, height = 675;

    function resize() {
      width = canvas.width = section.clientWidth || 1200;
      height = canvas.height = section.clientHeight || 675;
    }
    resize();
    window.addEventListener('resize', resize);

    class SakuraPetal {
      constructor(initial = false) {
        this.reset(initial);
      }
      reset(initial = false) {
        const fromBranch = Math.random() < 0.6;
        if (initial) {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
        } else if (fromBranch) {
          this.x = Math.random() * (width * 0.45);
          this.y = Math.random() * (height * 0.2) - 20;
        } else {
          this.x = Math.random() * width * 0.85;
          this.y = -25;
        }

        this.size = Math.random() * 10 + 9;
        this.speedX = Math.random() * 1.5 + 0.6;
        this.speedY = Math.random() * 1.3 + 0.8;
        this.rotation = Math.random() * 360;
        this.rotSpeed = (Math.random() - 0.5) * 2.2;
        this.opacity = Math.random() * 0.35 + 0.65;
        this.flip = Math.random() * Math.PI * 2;
        this.flipSpeed = Math.random() * 0.03 + 0.015;

        const pinkTones = [
          'rgba(244, 143, 150, ',
          'rgba(235, 120, 130, ',
          'rgba(248, 175, 180, ',
          'rgba(220, 95, 105, '
        ];
        this.colorBase = pinkTones[Math.floor(Math.random() * pinkTones.length)];
      }
      update() {
        this.x += this.speedX + Math.sin(this.flip) * 0.6;
        this.y += this.speedY;
        this.rotation += this.rotSpeed;
        this.flip += this.flipSpeed;

        if (this.y > height + 25 || this.x > width + 25) {
          this.reset(false);
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.scale(Math.cos(this.flip), 1);

        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size / 2, this.size / 2, 0, this.size / 2);
        ctx.bezierCurveTo(-this.size / 2, this.size / 2, -this.size / 2, -this.size / 2, 0, -this.size / 2);
        ctx.fillStyle = this.colorBase + this.opacity + ')';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, -this.size / 4, this.size / 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 245, 220, ' + (this.opacity * 0.8) + ')';
        ctx.fill();

        ctx.restore();
      }
    }

    const petals = Array.from({ length: 35 }, () => new SakuraPetal(true));

    function loop() {
      if (canvas.width !== section.clientWidth || canvas.height !== section.clientHeight) {
        resize();
      }
      ctx.clearRect(0, 0, width, height);
      for (let p of petals) {
        p.update();
        p.draw();
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  // ==========================================================================
  // 2. THANH TIẾN TRÌNH "SỢI CHỈ ĐỎ THÊU HOA" (SILK THREAD SCROLL PROGRESS)
  // ==========================================================================
  function initScrollProgressBar() {
    let bar = document.getElementById('kocScrollProgressBar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'kocScrollProgressBar';
      bar.className = 'koc-scroll-progress-bar';

      // Nụ hoa đào nhỏ nhắn tinh tế di chuyển theo đầu sợi chỉ đỏ
      const flower = document.createElement('div');
      flower.className = 'koc-scroll-flower-tip';
      flower.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
          <circle cx="12" cy="12" r="3" fill="#ffeaa7"/>
          <path d="M12 2 C13 7 17 8 17 12 C17 16 13 17 12 22 C11 17 7 16 7 12 C7 8 11 7 12 2 Z" fill="#f48f96" opacity="0.95"/>
          <path d="M2 12 C7 11 8 7 12 7 C16 7 17 11 22 12 C17 13 16 17 12 17 C8 17 7 13 2 12 Z" fill="#eb7882" opacity="0.9"/>
        </svg>
      `;
      bar.appendChild(flower);
      document.body.appendChild(bar);
    }

    function updateProgress() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0;
      bar.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ==========================================================================
  // 3. GỢN SÓNG NƯỚC KHI CLICK CHUỘT (HERBAL WATER RIPPLE)
  // ==========================================================================
  function initClickWaterRipple() {
    document.addEventListener('pointerdown', (e) => {
      // Bỏ qua nếu click vào input/textarea để trải nghiệm gõ phím mượt mà
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      const ripple = document.createElement('div');
      ripple.className = 'koc-water-ripple';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      document.body.appendChild(ripple);

      // Tự động thu dọn DOM sau khi sóng tan
      setTimeout(() => {
        ripple.remove();
      }, 900);
    });
  }

  // ==========================================================================
  // 4. BỤI NẮNG ẤM & ĐỐM SÁNG HỔ PHÁCH (SUNLIGHT DUST & AMBIENT DEPTH)
  // ==========================================================================
  function initSunlightDust() {
    // Áp dụng lớp bụi nắng ấm lên Section Hero hoặc Section Giới thiệu Sản phẩm
    const targetSection = document.getElementById('comp-mpbn2o2z') || document.getElementById('comp-mpbn2nv6');
    if (!targetSection) return;

    targetSection.style.position = 'relative';

    let canvas = document.getElementById('sunlightDustCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'sunlightDustCanvas';
      canvas.className = 'koc-sunlight-dust-canvas';
      targetSection.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = 1200, height = 675;

    function resize() {
      width = canvas.width = targetSection.clientWidth || 1200;
      height = canvas.height = targetSection.clientHeight || 675;
    }
    resize();
    window.addEventListener('resize', resize);

    class DustMote {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 10;
        this.radius = Math.random() * 2.2 + 1.0;
        this.vy = -(Math.random() * 0.45 + 0.2); // Bay chậm rãi hướng lên theo luồng không khí ấm
        this.vx = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.25;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.03 + 0.015;
      }
      update() {
        this.y += this.vy;
        this.x += this.vx + Math.sin(this.pulse) * 0.25;
        this.pulse += this.pulseSpeed;

        if (this.y < -15 || this.x < -15 || this.x > width + 15) {
          this.reset(false);
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        const curAlpha = this.opacity * (0.6 + Math.sin(this.pulse) * 0.4);

        // Hào quang vàng hổ phách li ti
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 2.5);
        grad.addColorStop(0, `rgba(255, 235, 170, ${curAlpha})`);
        grad.addColorStop(0.5, `rgba(235, 185, 75, ${curAlpha * 0.45})`);
        grad.addColorStop(1, 'rgba(235, 185, 75, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    const motes = Array.from({ length: 28 }, () => new DustMote());

    function loopDust() {
      if (canvas.width !== targetSection.clientWidth || canvas.height !== targetSection.clientHeight) {
        resize();
      }
      ctx.clearRect(0, 0, width, height);
      for (let m of motes) {
        m.update();
        m.draw();
      }
      requestAnimationFrame(loopDust);
    }
    requestAnimationFrame(loopDust);
  }
})();
