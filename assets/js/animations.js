/**
 * ANIMATIONS.JS - HỆ THỐNG NGHỆ THUẬT & TRẢI NGHIỆM 3D NẾP TÓC THORAKAO
 * 1. Cánh hoa đào rơi tại SECTION "THÔNG TIN CHIẾN DỊCH" (#comp-mvq57pzq)
 * 2. Bụi nắng ấm & Đốm sáng hổ phách tại SẢN PHẨM (#comp-mpbn2o2z)
 * 3. Lá bồ kết rơi tại THÀNH PHẦN & CÔNG DỤNG (#comp-mvq65b7f)
 * 4. Đom đóm vàng làng quê tại CÂU CHUYỆN THƯƠNG HIỆU (#comp-mpbn2o51)
 * 5. Kết cấu giấy dó truyền thống (Paper Grain Texture)
 * 6. Cuộn trang mở êm dịu (Scroll Reveal)
 * 7. Khối Showcase 3D Tương tác 360° Chai Dầu Gội Thorakao 750ml
 */

(function () {
  // Cờ cấu hình bật/tắt độc lập cho từng tính năng
  const FX = {
    sakura: true,
    sunlight: true,
    leaves: true,
    fireflies: true,
    grain: true,
    reveal: true,
    showcase3D: true
  };

  function bootAnimations() {
    if (FX.sakura) initCampaignSakuraPetals();
    if (FX.sunlight) initSunlightDust();
    if (FX.leaves) initFallingHerbalLeaves();
    if (FX.fireflies) initFireflies();
    if (FX.grain) initPaperGrain();
    if (FX.reveal) initScrollReveal();
    if (FX.showcase3D) init3DProductShowcase();
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

        // Tông màu lá bồ kết xanh non và xanh olive truyền thống
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

        // Vẽ lá chét bồ kết hình bầu dục thuôn dài
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width, this.length, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();

        // Gân lá chính ở giữa
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
        if (glow < -0.1) return; // Lúc đom đóm tắt sáng tạm thời
        const alpha = Math.max(0, glow * this.pulseMax);

        ctx.save();
        ctx.translate(this.x, this.y);

        // Hào quang vàng đom đóm
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 3.5);
        grad.addColorStop(0, `rgba(255, 238, 140, ${alpha})`);
        grad.addColorStop(0.35, `rgba(255, 200, 50, ${alpha * 0.6})`);
        grad.addColorStop(1, 'rgba(255, 200, 50, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, this.r * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Nhân đom đóm sáng trắng
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

    const targets = document.querySelectorAll('section, .koc-3d-showcase-section, #SITE_FOOTER, footer');
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

  // ==========================================================================
  // 7. KHỐI SHOWCASE 3D TƯƠNG TÁC XOAY 360° CHAI DẦU GỘI THORAKAO 750ML
  // ==========================================================================
  function init3DProductShowcase() {
    const canvas = document.getElementById('kocBottle3DCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const stage = document.querySelector('.koc-3d-stage-wrapper');

    // Tải ảnh chai trong suốt
    const bottleImg = new Image();
    bottleImg.src = 'assets/images/bottle-transparent.png';

    let currentAngle = 0; // 0 đến 360 độ
    let isDragging = false;
    let startX = 0;
    let startAngle = 0;
    let autoRotate = true;
    let lastInteraction = performance.now();

    // Lắng nghe sự kiện kéo chuột / cảm ứng
    function onPointerDown(e) {
      isDragging = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      startAngle = currentAngle;
      autoRotate = false;
      lastInteraction = performance.now();
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const deltaX = clientX - startX;
      // Kéo 300px tương đương xoay 360 độ
      currentAngle = (startAngle + (deltaX / 300) * 360) % 360;
      if (currentAngle < 0) currentAngle += 360;
      lastInteraction = performance.now();
    }

    function onPointerUp() {
      isDragging = false;
    }

    if (stage) {
      stage.addEventListener('mousedown', onPointerDown);
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);

      stage.addEventListener('touchstart', onPointerDown, { passive: true });
      window.addEventListener('touchmove', onPointerMove, { passive: true });
      window.addEventListener('touchend', onPointerUp, { passive: true });
    }

    // Các điểm Hotspot tương tác
    const hsCap = document.querySelector('.hs-cap');
    const hsLabel = document.querySelector('.hs-label');
    const hsBase = document.querySelector('.hs-base');

    function updateHotspots(rad) {
      // Hotspot chỉ hiện rõ khi mặt trước chai hướng về phía người dùng (-80 đến +80 độ)
      const cosAngle = Math.cos(rad);
      const isFacingFront = cosAngle > 0.15;
      const opacity = isFacingFront ? Math.min(1, (cosAngle - 0.15) / 0.5) : 0;

      [hsCap, hsLabel, hsBase].forEach(hs => {
        if (hs) {
          hs.style.opacity = opacity.toFixed(2);
          hs.style.pointerEvents = opacity > 0.4 ? 'auto' : 'none';
        }
      });
    }

    function render3DBottle(now) {
      // Tự động xoay chậm sau 2.5 giây người dùng không chạm
      if (!isDragging && (now - lastInteraction) > 2500) {
        currentAngle = (currentAngle + 0.45) % 360;
      }

      const rad = (currentAngle * Math.PI) / 180;
      updateHotspots(rad);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cw = canvas.width;
      const ch = canvas.height;
      const centerX = cw * 0.5;
      const centerY = ch * 0.52;

      // 1. VẼ BỤC GỖ TRÒN ĐỔ BÓNG 3D PHÍA DƯỚI
      const pedestalY = centerY + 245;
      ctx.save();
      // Bóng đổ của chai xuống bục gỗ (co giãn theo góc xoay)
      const shadowScaleX = 1 + Math.abs(Math.sin(rad)) * 0.25;
      ctx.beginPath();
      ctx.ellipse(centerX, pedestalY, 130 * shadowScaleX, 32, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(40, 20, 10, 0.35)';
      ctx.filter = 'blur(8px)';
      ctx.fill();
      ctx.filter = 'none';

      // Mặt bục gỗ
      ctx.beginPath();
      ctx.ellipse(centerX, pedestalY + 8, 145, 36, 0, 0, Math.PI * 2);
      const pedGrad = ctx.createLinearGradient(centerX - 145, 0, centerX + 145, 0);
      pedGrad.addColorStop(0, '#8c593b');
      pedGrad.addColorStop(0.5, '#d4a373');
      pedGrad.addColorStop(1, '#6b4226');
      ctx.fillStyle = pedGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 230, 180, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // 2. VẼ CHAI DẦU GỘI VỚI HIỆU ỨNG XOAY 3D VÀ ÁNH SÁNG
      if (bottleImg.complete && bottleImg.naturalWidth > 0) {
        ctx.save();
        ctx.translate(centerX, centerY);

        // Chiều rộng chiếu của chai khi xoay quanh trục Y: cos(rad)
        // Khi nhìn nghiêng (90 deg hoặc 270 deg), chai có độ dày bề ngang ~0.55
        const aspect = Math.abs(Math.cos(rad)) * 0.55 + 0.45;
        const sign = Math.cos(rad) >= 0 ? 1 : -1;

        const targetH = 475;
        const targetW = (bottleImg.naturalWidth / bottleImg.naturalHeight) * targetH;

        ctx.scale(aspect * sign, 1);

        // Vẽ thân chai
        ctx.drawImage(bottleImg, -targetW * 0.5, -targetH * 0.5, targetW, targetH);

        // Khi xoay ra mặt sau (sign < 0): phủ một lớp đổ bóng mờ tạo cảm giác mặt lưng chai
        if (sign < 0) {
          ctx.beginPath();
          ctx.rect(-targetW * 0.5, -targetH * 0.5, targetW, targetH);
          ctx.fillStyle = 'rgba(15, 10, 8, 0.62)';
          ctx.fill();
        }

        // 3. VỆT ÁNH SÁNG KIM LOẠI 3D (SPECULAR SHINE) TRƯỢT THEO GÓC XOAY
        const lightOffset = Math.sin(rad) * (targetW * 0.4);
        const shineGrad = ctx.createLinearGradient(lightOffset - 35, 0, lightOffset + 35, 0);
        shineGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        shineGrad.addColorStop(0.5, 'rgba(255, 245, 210, 0.38)');
        shineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = shineGrad;
        ctx.fillRect(-targetW * 0.45, -targetH * 0.48, targetW * 0.9, targetH * 0.95);

        ctx.restore();
      }

      requestAnimationFrame(render3DBottle);
    }

    requestAnimationFrame(render3DBottle);
  }
})();
