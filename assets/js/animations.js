/**
 * ANIMATIONS.JS - HỆ THỐNG NGHỆ THUẬT NẾP TÓC THORAKAO
 * 1. Cánh hoa đào rơi tại SECTION "THÔNG TIN CHIẾN DỊCH" (#comp-mvq57pzq)
 * 2. Bụi nắng ấm & Đốm sáng hổ phách tại SẢN PHẨM (#comp-mpbn2o2z)
 * 3. Lá bồ kết rơi tại THÀNH PHẦN & CÔNG DỤNG (#comp-mvq65b7f)
 * 4. Đom đóm vàng làng quê tại CÂU CHUYỆN THƯƠNG HIỆU (#comp-mpbn2o51)
 * 5. Kết cấu giấy dó truyền thống (Paper Grain Texture)
 * 6. Cuộn trang mở êm dịu (Scroll Reveal)
 */

(function () {
  // Cờ cấu hình bật/tắt độc lập cho từng tính năng
  const FX = {
    sakura: true,
    sunlight: true,
    leaves: true,
    fireflies: true,
    grain: true,
    reveal: true
  };

  function bootAnimations() {
    if (FX.sakura) initCampaignSakuraPetals();
    if (FX.sunlight) initSunlightDust();
    if (FX.leaves) initFallingHerbalLeaves();
    if (FX.fireflies) initFireflies();
    if (FX.grain) initPaperGrain();
    if (FX.reveal) initScrollReveal();
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
  // 3. LÁ BỒ KẾT RƠI TẠI THÀNH PHẦN & CÔNG DỤNG (#comp-mvq65b7f)
  // ==========================================================================
  function initFallingHerbalLeaves() {
    const section = document.getElementById('comp-mvq65b7f');
    if (!section) return;

    section.style.position = 'relative';

    let canvas = document.getElementById('herbalLeavesCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'herbalLeavesCanvas';
      canvas.className = 'koc-leaves-canvas';
      section.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = 1200, height = 675;

    function resize() {
      width = canvas.width = section.clientWidth || 1200;
      height = canvas.height = section.clientHeight || 675;
    }
    resize();
    window.addEventListener('resize', resize);

    class HerbalLeaf {
      constructor(initial = false) {
        this.reset(initial);
      }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -20;
        this.length = Math.random() * 12 + 10;
        this.width = this.length * 0.48;
        this.speedY = Math.random() * 1.1 + 0.65;
        this.speedX = Math.random() * 0.8 + 0.2;
        this.rotation = Math.random() * 360;
        this.rotSpeed = (Math.random() - 0.5) * 2.0;
        this.flip = Math.random() * Math.PI * 2;
        this.flipSpeed = Math.random() * 0.03 + 0.015;
        this.opacity = Math.random() * 0.35 + 0.55;

        const leafGreens = [
          'rgba(91, 115, 72, ',
          'rgba(77, 98, 60, ',
          'rgba(110, 139, 84, ',
          'rgba(66, 85, 51, '
        ];
        this.color = leafGreens[Math.floor(Math.random() * leafGreens.length)];
      }
      update() {
        this.x += this.speedX + Math.sin(this.flip) * 0.7;
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
        ctx.ellipse(0, 0, this.width, this.length, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, -this.length * 0.85);
        ctx.lineTo(0, this.length * 0.85);
        ctx.strokeStyle = 'rgba(255, 255, 255, ' + (this.opacity * 0.35) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      }
    }

    const leaves = Array.from({ length: 22 }, () => new HerbalLeaf(true));

    function loopLeaves() {
      if (canvas.width !== section.clientWidth || canvas.height !== section.clientHeight) {
        resize();
      }
      ctx.clearRect(0, 0, width, height);
      for (let l of leaves) {
        l.update();
        l.draw();
      }
      requestAnimationFrame(loopLeaves);
    }
    requestAnimationFrame(loopLeaves);
  }

  // ==========================================================================
  // 4. ĐOM ĐÓM VÀNG LÀNG QUÊ TẠI CÂU CHUYỆN THƯƠNG HIỆU (#comp-mpbn2o51)
  // ==========================================================================
  function initFireflies() {
    const section = document.getElementById('comp-mpbn2o51');
    if (!section) return;

    section.style.position = 'relative';

    let canvas = document.getElementById('firefliesCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'firefliesCanvas';
      canvas.className = 'koc-fireflies-canvas';
      section.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = 1200, height = 800;

    function resize() {
      width = canvas.width = section.clientWidth || 1200;
      height = canvas.height = section.clientHeight || 800;
    }
    resize();
    window.addEventListener('resize', resize);

    class Firefly {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.r = Math.random() * 2.8 + 1.8;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.phase = Math.random() * Math.PI * 2;
        this.phaseSpeed = Math.random() * 0.04 + 0.02;
        this.pulseMax = Math.random() * 0.45 + 0.45;
      }
      update() {
        this.x += this.vx + Math.sin(this.phase) * 0.35;
        this.y += this.vy + Math.cos(this.phase * 0.7) * 0.35;
        this.phase += this.phaseSpeed;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }
      draw() {
        const glow = Math.sin(this.phase);
        if (glow < -0.1) return;
        const alpha = Math.max(0, glow * this.pulseMax);

        ctx.save();
        ctx.translate(this.x, this.y);

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 3.5);
        grad.addColorStop(0, `rgba(255, 238, 140, ${alpha})`);
        grad.addColorStop(0.35, `rgba(255, 200, 50, ${alpha * 0.6})`);
        grad.addColorStop(1, 'rgba(255, 200, 50, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, this.r * 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 220, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(0, 0, this.r * 0.7, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    const fireflies = Array.from({ length: 26 }, () => new Firefly());

    function loopFireflies() {
      if (canvas.width !== section.clientWidth || canvas.height !== section.clientHeight) {
        resize();
      }
      ctx.clearRect(0, 0, width, height);
      for (let f of fireflies) {
        f.update();
        f.draw();
      }
      requestAnimationFrame(loopFireflies);
    }
    requestAnimationFrame(loopFireflies);
  }

  // ==========================================================================
  // 5. KẾT CẤU GIẤY DÓ TRUYỀN THỐNG (SUBTLE PAPER GRAIN)
  // ==========================================================================
  function initPaperGrain() {
    let overlay = document.getElementById('kocPaperGrain');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'kocPaperGrain';
      overlay.className = 'koc-paper-grain-overlay';
      document.body.appendChild(overlay);
    }
  }

  // ==========================================================================
  // 6. HIỆU ỨNG CUỘN TRANG MỞ TỰ NHIÊN (SCROLL REVEAL)
  // ==========================================================================
  function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const targets = document.querySelectorAll('section, #SITE_FOOTER, footer');
    if (!targets.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('koc-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.05
    });

    targets.forEach(el => {
      el.classList.add('koc-reveal-target');
      observer.observe(el);
    });
  }
})();
