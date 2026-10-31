/**
 * ANIMATIONS.JS - HỆ THỐNG HIỆU ỨNG NGHỆ THUẬT NẾP TÓC THORAKAO
 * "Giữ nếp xưa, Tỏ nếp mình"
 * 1. Cánh hoa đào rơi tại SECTION "THÔNG TIN CHIẾN DỊCH" (#comp-mvq57pzq)
 * 2. Bụi nắng ấm & Đốm sáng hổ phách tại SẢN PHẨM (#comp-mpbn2o2z)
 * 3. Thanh tiến trình "Sợi chỉ đỏ thêu hoa" (Silk Thread Scroll Progress)
 * 4. Gợn sóng nước giọt thảo mộc khi Click (Herbal Water Droplet Ripple)
 */

(function () {
  function bootAnimations() {
    initCampaignSakuraPetals();
    initSunlightDust();
    initScrollProgressBar();
    initClickWaterRipple();
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
  // 2. BỤI NẮNG ẤM & ĐỐM SÁNG HỔ PHÁCH TẠI SẢN PHẨM (#comp-mpbn2o2z)
  // ==========================================================================
  function initSunlightDust() {
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
        this.vy = -(Math.random() * 0.45 + 0.2);
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

  // ==========================================================================
  // 3. THANH TIẾN TRÌNH "SỢI CHỈ ĐỎ THÊU HOA" (SILK THREAD SCROLL PROGRESS)
  // ==========================================================================
  function initScrollProgressBar() {
    let bar = document.getElementById('kocScrollProgressBar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'kocScrollProgressBar';
      bar.className = 'koc-scroll-progress-bar';

      // Nụ hoa đào nở rực rỡ có nhụy vàng óng ánh ở đầu sợi chỉ đỏ
      const flower = document.createElement('div');
      flower.className = 'koc-scroll-flower-tip';
      flower.innerHTML = `
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <circle cx="12" cy="12" r="3.5" fill="#ffeaa7"/>
          <path d="M12 2 C13.5 7 17.5 8 17.5 12 C17.5 16 13.5 17 12 22 C10.5 17 6.5 16 6.5 12 C6.5 8 10.5 7 12 2 Z" fill="#f48f96" opacity="0.95"/>
          <path d="M2 12 C7 10.5 8 6.5 12 6.5 C16 6.5 17 10.5 22 12 C17 13.5 16 17.5 12 17.5 C8 17.5 7 13.5 2 12 Z" fill="#eb7882" opacity="0.9"/>
          <circle cx="12" cy="12" r="1.8" fill="#ff7675"/>
        </svg>
      `;
      bar.appendChild(flower);
      document.body.appendChild(bar);
    }

    function syncTopPosition() {
      // Tự động căn khớp thanh tiến trình ngay dưới đáy của header bất kể màn hình nào
      const header = document.getElementById('comp-mb7ogqrp') || document.querySelector('header');
      if (header) {
        const rect = header.getBoundingClientRect();
        const headerBottom = Math.max(0, rect.bottom);
        bar.style.top = headerBottom + 'px';
      }
    }

    function updateProgress() {
      syncTopPosition();
      const doc = document.documentElement;
      const body = document.body;
      const scrollTop = window.pageYOffset || window.scrollY || doc.scrollTop || body.scrollTop || 0;
      const scrollHeight = Math.max(
        body.scrollHeight, doc.scrollHeight,
        body.offsetHeight, doc.offsetHeight,
        body.clientHeight, doc.clientHeight
      ) - window.innerHeight;

      const progress = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0;
      bar.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    document.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }

  // ==========================================================================
  // 4. GỢN SÓNG NƯỚC GIỌT THẢO MỘC KHI CLICK CHUỘT (HERBAL WATER RIPPLE)
  // Bắt sự kiện ở tầng Window với CAPTURE = TRUE để không bị bất kỳ element nào chặn
  // ==========================================================================
  function initClickWaterRipple() {
    function handleRipple(e) {
      // Lấy tọa độ click chính xác trên Viewport
      const x = e.clientX;
      const y = e.clientY;
      if (x === undefined || y === undefined) return;

      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      const container = document.createElement('div');
      container.className = 'koc-ripple-container';
      container.style.left = x + 'px';
      container.style.top = y + 'px';

      container.innerHTML = `
        <div class="koc-ripple-drop"></div>
        <div class="koc-ripple-wave-1"></div>
        <div class="koc-ripple-wave-2"></div>
      `;

      document.body.appendChild(container);

      // Tự động dọn dẹp sau 950ms
      setTimeout(() => {
        container.remove();
      }, 950);
    }

    window.addEventListener('pointerdown', handleRipple, true);
  }
})();
