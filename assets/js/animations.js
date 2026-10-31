/**
 * ANIMATIONS.JS - HỆ THỐNG HIỆU ỨNG NGHỆ THUẬT ĐỘNG (REAL-TIME CANVAS WARP & 3D PARALLAX)
 * Nếp Tóc Thorakao:
 * 1. Cánh hoa đào rơi & Hoa đào nở lấp lánh tại SECTION "THÔNG TIN CHIẾN DỊCH" (#comp-mvq57pzq)
 * 2. Khung ảnh & Chai dầu gội Thorakao 3D nổi khối đa lớp tại "GIỚI THIỆU SẢN PHẨM" (#comp-mpbn2o2z)
 * 3. Suối tóc cô gái nằm gợn sóng bồng bềnh (Real-time Mesh Wave) & Sao lấp lánh tại "HƯỚNG DẪN SỬ DỤNG" (#comp-mvpfzoii)
 * 4. Cô gái chải tóc óng mượt (Real-time Combing Motion) & Tinh chất bồ kết tại FOOTER (#comp-kbgakxmn_r_comp-kbgakgyt)
 */

(function () {
  function bootAnimations() {
    initCampaignSakuraPetals();
    initProduct3DInteractive();
    initGuideHairMotion();
    initFooterLadyMotion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAnimations);
  } else {
    bootAnimations();
  }

  /**
   * Hàm tính toán ánh xạ tọa độ pixel từ ảnh gốc (1920x1080) sang tọa độ thực tế trên Section
   * Đảm bảo khớp chính xác 100% bất kể màn hình co giãn (object-fit: cover hay contain)
   */
  function getImageMapper(section, img, defaultAlignX = 0.5, defaultAlignY = 0.5) {
    const iw = (img && img.naturalWidth) ? img.naturalWidth : 1920;
    const ih = (img && img.naturalHeight) ? img.naturalHeight : 1080;
    const cw = section.clientWidth || 1200;
    const ch = section.clientHeight || 675;

    let fit = 'cover';
    if (img) {
      const style = window.getComputedStyle(img);
      if (style && style.objectFit) fit = style.objectFit;
    }

    const scale = (fit === 'contain')
      ? Math.min(cw / iw, ch / ih)
      : Math.max(cw / iw, ch / ih);

    const rw = iw * scale;
    const rh = ih * scale;
    const ox = (cw - rw) * defaultAlignX;
    const oy = (ch - rh) * defaultAlignY;

    return {
      cw,
      ch,
      iw,
      ih,
      scale,
      ox,
      oy,
      toScreen(ix, iy) {
        return {
          x: ox + ix * scale,
          y: oy + iy * scale
        };
      },
      toScreenRect(ix, iy, w, h) {
        return {
          x: ox + ix * scale,
          y: oy + iy * scale,
          w: w * scale,
          h: h * scale
        };
      }
    };
  }

  /**
   * Vẽ ngôi sao 4 cánh tỏa sáng (Twinkling Starlight Flare)
   */
  function drawSparkleStar(ctx, x, y, radius, alpha, rotRad = 0, color = '#fffbe6') {
    if (alpha <= 0.02) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotRad);
    ctx.globalAlpha = Math.min(1, Math.max(0, alpha));

    // Hào quang tỏa tròn phía dưới
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 2.2);
    grad.addColorStop(0, 'rgba(255, 250, 215, 0.95)');
    grad.addColorStop(0.35, 'rgba(255, 220, 130, 0.45)');
    grad.addColorStop(1, 'rgba(255, 210, 100, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Thân ngôi sao 4 cánh sắc nét
    ctx.fillStyle = color;
    ctx.beginPath();
    const inner = radius * 0.22;
    ctx.moveTo(0, -radius);
    ctx.quadraticCurveTo(inner, -inner, radius, 0);
    ctx.quadraticCurveTo(inner, inner, 0, radius);
    ctx.quadraticCurveTo(-inner, inner, -radius, 0);
    ctx.quadraticCurveTo(-inner, -inner, 0, -radius);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // ==========================================================================
  // 1. CÁNH HOA ĐÀO RƠI & CÀNH ĐÀO ĐUNG ĐƯA TẠI "THÔNG TIN CHIẾN DỊCH" (#comp-mvq57pzq)
  // ==========================================================================
  function initCampaignSakuraPetals() {
    const section = document.getElementById('comp-mvq57pzq') || document.getElementById('comp-mvq57q0k');
    if (!section) return;

    const img = section.querySelector('img');
    const oldCanvas = document.getElementById('sakuraCampaignCanvas');
    if (oldCanvas) oldCanvas.remove();

    const canvas = document.createElement('canvas');
    canvas.id = 'sakuraCampaignCanvas';
    canvas.className = 'koc-art-canvas';
    section.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = 1200, height = 675;

    function resize() {
      width = canvas.width = section.clientWidth || 1200;
      height = canvas.height = section.clientHeight || 675;
    }
    resize();
    window.addEventListener('resize', resize);

    // Các bông hoa đào trên cành (tọa độ trên ảnh 1920x1080)
    const branchBlossoms = [
      { ix: 295, iy: 192, r: 22, phase: 0 },
      { ix: 468, iy: 248, r: 24, phase: 1.3 },
      { ix: 185, iy: 222, r: 16, phase: 2.5 },
      { ix: 140, iy: 185, r: 15, phase: 3.7 },
      { ix: 495, iy: 118, r: 18, phase: 0.8 },
      { ix: 225, iy: 295, r: 17, phase: 1.9 }
    ];

    class SakuraPetal {
      constructor(initial = false) {
        this.reset(initial);
      }
      reset(initial = false) {
        // 65% cánh hoa xuất phát từ cụm cành đào góc trên bên trái, 35% bay ngang bầu trời
        const fromBranch = Math.random() < 0.65;
        if (initial) {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
        } else if (fromBranch) {
          this.x = Math.random() * (width * 0.35);
          this.y = Math.random() * (height * 0.25) - 15;
        } else {
          this.x = Math.random() * width * 0.75;
          this.y = -25;
        }

        this.size = Math.random() * 11 + 9;
        this.isFullFlower = Math.random() < 0.22; // 22% là bông hoa đào 5 cánh nguyên vẹn xoay tròn
        this.speedX = Math.random() * 1.4 + 0.55;
        this.speedY = Math.random() * 1.15 + 0.7;
        this.rotation = Math.random() * 360;
        this.rotSpeed = (Math.random() - 0.5) * 2.4;
        this.flip = Math.random() * Math.PI * 2;
        this.flipSpeed = Math.random() * 0.035 + 0.015;
        this.swayPhase = Math.random() * Math.PI * 2;
        this.opacity = Math.random() * 0.3 + 0.68;

        const tones = [
          [246, 142, 152],
          [238, 112, 125],
          [252, 172, 180],
          [225, 88, 102]
        ];
        this.rgb = tones[Math.floor(Math.random() * tones.length)];
      }
      update(t) {
        this.x += this.speedX + Math.sin(t * 1.6 + this.swayPhase) * 0.65;
        this.y += this.speedY + Math.cos(t * 1.2 + this.swayPhase) * 0.2;
        this.rotation += this.rotSpeed;
        this.flip += this.flipSpeed;

        if (this.y > height + 30 || this.x > width + 30) {
          this.reset(false);
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.scale(1, Math.cos(this.flip) * 0.65 + 0.35);

        const [r, g, b] = this.rgb;
        if (this.isFullFlower) {
          // Vẽ bông hoa đào 5 cánh
          for (let i = 0; i < 5; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI * 2) / 5);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size * 0.38, -this.size * 0.35, -this.size * 0.28, -this.size * 0.9, 0, -this.size * 0.78);
            ctx.bezierCurveTo(this.size * 0.28, -this.size * 0.9, this.size * 0.38, -this.size * 0.35, 0, 0);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
            ctx.fill();
            ctx.restore();
          }
          // Nhụy hoa vàng
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.18, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 230, 140, ${this.opacity})`;
          ctx.fill();
        } else {
          // Vẽ cánh hoa đào đơn có khía nhẹ ở đầu cánh
          const s = this.size;
          ctx.beginPath();
          ctx.moveTo(0, s * 0.5);
          ctx.bezierCurveTo(-s * 0.55, s * 0.2, -s * 0.5, -s * 0.45, -s * 0.12, -s * 0.5);
          ctx.lineTo(0, -s * 0.36);
          ctx.lineTo(s * 0.12, -s * 0.5);
          ctx.bezierCurveTo(s * 0.5, -s * 0.45, s * 0.55, s * 0.2, 0, s * 0.5);
          ctx.closePath();

          const grad = ctx.createLinearGradient(0, -s * 0.5, 0, s * 0.5);
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.opacity})`);
          grad.addColorStop(1, `rgba(255, 225, 230, ${this.opacity * 0.85})`);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        ctx.restore();
      }
    }

    const petals = Array.from({ length: 38 }, () => new SakuraPetal(true));
    let startTime = performance.now();

    function render(now) {
      const t = (now - startTime) * 0.001;
      if (canvas.width !== section.clientWidth || canvas.height !== section.clientHeight) {
        resize();
      }
      ctx.clearRect(0, 0, width, height);

      // Hiệu ứng cành đào đung đưa nhẹ & hoa đào trên cành nở sáng lấp lánh
      const mapper = getImageMapper(section, img, 0.5, 0.5);
      if (img && img.complete && img.naturalWidth > 0) {
        // Làm cành đào góc trên trái (x: 40..540, y: 40..310) đung đưa nhẹ theo gió
        const strips = 25;
        const x0 = 40, x1 = 550, y0 = 35, y1 = 315;
        const stripW = (x1 - x0) / strips;
        for (let i = 0; i < strips; i++) {
          const u = i / strips;
          const env = Math.sin(Math.pow(u, 0.8) * Math.PI);
          const swayY = Math.sin(t * 2.1 - u * 3.5) * 8 * env;
          const sx = x0 + i * stripW;
          const dst = mapper.toScreenRect(sx, y0 + swayY, stripW + 1, y1 - y0);
          ctx.drawImage(img, sx, y0, stripW + 1, y1 - y0, dst.x, dst.y, dst.w, dst.h);
        }
      }

      // Vẽ hào quang hồng ấm áp nở rộ trên các đóa đào của cành cây
      for (const b of branchBlossoms) {
        const pt = mapper.toScreen(b.ix, b.iy);
        const pulse = (Math.sin(t * 2.4 + b.phase) * 0.5 + 0.5);
        const rad = b.r * mapper.scale * (0.9 + pulse * 0.45);
        const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, rad);
        g.addColorStop(0, `rgba(255, 195, 200, ${0.45 * pulse})`);
        g.addColorStop(0.5, `rgba(245, 120, 135, ${0.22 * pulse})`);
        g.addColorStop(1, 'rgba(245, 120, 135, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cập nhật và vẽ 38 cánh hoa đào bay
      for (const p of petals) {
        p.update(t);
        p.draw();
      }

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  // ==========================================================================
  // 2. SẢN PHẨM DẦU GỘI THORAKAO 3D CHÂN THẬT (#comp-mpbn2o2z)
  // ==========================================================================
  function initProduct3DInteractive() {
    const section = document.getElementById('comp-mpbn2o2z');
    if (!section) return;

    const img = section.querySelector('img');
    if (!img) return;

    const oldStage = document.getElementById('product3DStage');
    if (oldStage) oldStage.remove();

    // Tạo sân khấu 3D đặt đúng lên vị trí khung ảnh Polaroid (x: 108..744, y: 144..919 trên ảnh 1920x1080)
    const stage = document.createElement('div');
    stage.id = 'product3DStage';
    stage.className = 'koc-3d-product-stage';

    const canvas = document.createElement('canvas');
    canvas.id = 'product3DCanvas';
    canvas.width = 636;
    canvas.height = 775;
    stage.appendChild(canvas);

    const badge = document.createElement('div');
    badge.className = 'koc-3d-badge';
    badge.innerHTML = '<span>✨ 3D THORAKAO</span>';
    stage.appendChild(badge);

    section.appendChild(stage);

    const ctx = canvas.getContext('2d');

    // Định vị khung 3D khớp 100% với vị trí khung Polaroid trên ảnh nền
    function syncStagePosition() {
      const mapper = getImageMapper(section, img, 0.5, 0.5);
      const rect = mapper.toScreenRect(108, 144, 636, 775);
      stage.style.left = `${rect.x}px`;
      stage.style.top = `${rect.y}px`;
      stage.style.width = `${rect.w}px`;
      stage.style.height = `${rect.h}px`;
    }
    syncStagePosition();
    window.addEventListener('resize', syncStagePosition);
    img.addEventListener('load', syncStagePosition);

    // Hạt tinh chất thảo mộc bồ kết vàng óng bay quanh chai 3D
    const auraParticles = Array.from({ length: 24 }, () => ({
      x: 140 + Math.random() * 380,
      y: 120 + Math.random() * 580,
      r: Math.random() * 3.8 + 1.8,
      vy: -(Math.random() * 0.9 + 0.4),
      vx: (Math.random() - 0.5) * 0.6,
      phase: Math.random() * Math.PI * 2
    }));

    let isHovering = false;
    let mouseRotX = 0;
    let mouseRotY = 0;
    let curRotX = 0;
    let curRotY = 0;
    let mouseX = 318;
    let mouseY = 387;

    // Lắng nghe chuột trên toàn bộ Section (không bị bất kỳ lớp con nào của Wix chặn)
    section.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      // Kiểm tra nếu chuột đang ở nửa bên trái hoặc gần khung sản phẩm
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.5;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      if (Math.abs(dx) < rect.width * 1.1 && Math.abs(dy) < rect.height * 0.85) {
        isHovering = true;
        const nx = Math.max(-1, Math.min(1, dx / (rect.width * 0.5)));
        const ny = Math.max(-1, Math.min(1, dy / (rect.height * 0.5)));
        mouseRotY = nx * 16; // Xoay tối đa 16 độ
        mouseRotX = -ny * 13;
        mouseX = (nx * 0.5 + 0.5) * 636;
        mouseY = (ny * 0.5 + 0.5) * 775;
      } else {
        isHovering = false;
      }
    });

    section.addEventListener('mouseleave', () => {
      isHovering = false;
    });

    let startTime = performance.now();

    function render3D(now) {
      const t = (now - startTime) * 0.001;
      syncStagePosition();

      // Chuyển động 3D tự động (Idle Floating & Breathing) ngay cả khi không rê chuột
      const idleRotY = Math.sin(t * 1.75) * 11.5;
      const idleRotX = Math.cos(t * 1.25) * 7.0;
      const floatY = Math.sin(t * 2.1) * -11;
      const scale3D = isHovering ? 1.065 : (1.035 + Math.sin(t * 1.75) * 0.02);

      const targetX = isHovering ? mouseRotX : idleRotX;
      const targetY = isHovering ? mouseRotY : idleRotY;

      curRotX += (targetX - curRotX) * 0.09;
      curRotY += (targetY - curRotY) * 0.09;

      // Áp dụng biến đổi 3D với !important để vượt qua mọi quy tắc của Wix
      const shadowX = (-curRotY * 1.7).toFixed(1);
      const shadowY = (20 + curRotX * 1.4).toFixed(1);
      stage.style.setProperty(
        'transform',
        `perspective(950px) translateY(${floatY.toFixed(1)}px) rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg) scale(${scale3D.toFixed(3)})`,
        'important'
      );
      stage.style.setProperty(
        'filter',
        `drop-shadow(${shadowX}px ${shadowY}px 26px rgba(0, 0, 0, 0.68))`,
        'important'
      );

      // Vẽ nội dung 3D đa lớp lên Canvas
      if (img.complete && img.naturalWidth > 0) {
        ctx.clearRect(0, 0, 636, 775);

        // Lớp 1: Nền khung ảnh Polaroid gốc (sx: 108, sy: 144, sw: 636, sh: 775)
        ctx.drawImage(img, 108, 144, 636, 775, 0, 0, 636, 775);

        // Lớp 2: Tách nổi khối 3D riêng cho Chai Dầu Gội Thorakao ở trung tâm khung
        // Trong khung 636x775, chai dầu gội nằm nghiêng khoảng góc -11 độ tại tâm (308, 395)
        const bottleParallaxX = curRotY * 1.45;
        const bottleParallaxY = -curRotX * 1.45 - 6;

        ctx.save();
        // Đổ bóng 3D của thân chai xuống mặt bàn gỗ và khăn bông khi chai nổi lên
        ctx.translate(308 + bottleParallaxX, 395 + bottleParallaxY);
        ctx.rotate((-11 * Math.PI) / 180);

        // Đường cắt bo theo dáng chai dầu gội Thorakao 750ml
        ctx.beginPath();
        ctx.moveTo(-36, -245); // Nắp chai trái
        ctx.lineTo(36, -245);  // Nắp chai phải
        ctx.lineTo(42, -165);  // Cổ chai
        ctx.quadraticCurveTo(96, -130, 102, 20);   // Vai & thân phải
        ctx.quadraticCurveTo(106, 175, 86, 225);   // Đáy phải
        ctx.quadraticCurveTo(0, 242, -86, 225);    // Đáy chai
        ctx.quadraticCurveTo(-106, 175, -102, 20); // Thân trái
        ctx.quadraticCurveTo(-96, -130, -42, -165);// Vai trái
        ctx.closePath();

        ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetX = -curRotY * 1.2;
        ctx.shadowOffsetY = 14 + curRotX * 1.1;
        ctx.fillStyle = 'rgba(15, 15, 15, 0.4)';
        ctx.fill();
        ctx.clip();

        // Vẽ phần ảnh chai phóng nổi 1.045x dịch theo parallax
        ctx.rotate((11 * Math.PI) / 180);
        ctx.scale(1.045, 1.045);
        ctx.translate(-308, -395);
        ctx.drawImage(img, 108, 144, 636, 775, 0, 0, 636, 775);

        // Vệt phản quang 3D (Specular Cylindrical Highlight) chạy dọc thân chai đen bóng theo góc nghiêng
        ctx.translate(308, 395);
        ctx.rotate((-11 * Math.PI) / 180);
        const highlightX = -curRotY * 4.2;
        const specGrad = ctx.createLinearGradient(highlightX - 55, 0, highlightX + 55, 0);
        specGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        specGrad.addColorStop(0.4, 'rgba(255, 250, 235, 0.18)');
        specGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.42)');
        specGrad.addColorStop(0.6, 'rgba(255, 250, 235, 0.18)');
        specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = specGrad;
        ctx.fillRect(-120, -250, 240, 500);
        ctx.restore();

        // Lớp 3: Hạt tinh chất thảo mộc bồ kết vàng lấp lánh bay quanh chai
        for (const p of auraParticles) {
          p.y += p.vy;
          p.x += p.vx + Math.sin(t * 2 + p.phase) * 0.35;
          if (p.y < 80) {
            p.y = 680;
            p.x = 140 + Math.random() * 380;
          }
          const alpha = (Math.sin(t * 3.2 + p.phase) * 0.4 + 0.55);
          drawSparkleStar(ctx, p.x + bottleParallaxX * 1.2, p.y + bottleParallaxY * 1.2, p.r * 2.3, alpha, t, '#ffea9f');
        }

        // Lớp 4: Vệt sáng kim quang (Diagonal Glare Sweep) quét qua toàn khung ảnh
        const sweepPos = ((t * 0.38) % 1.8) * 1100 - 250;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(sweepPos - 90, 0);
        ctx.lineTo(sweepPos + 30, 0);
        ctx.lineTo(sweepPos - 220, 775);
        ctx.lineTo(sweepPos - 340, 775);
        ctx.closePath();
        const beamGrad = ctx.createLinearGradient(sweepPos - 200, 0, sweepPos + 30, 0);
        beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        beamGrad.addColorStop(0.5, 'rgba(255, 248, 225, 0.34)');
        beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = beamGrad;
        ctx.fill();
        ctx.restore();

        // Viền sáng 3D tinh tế quanh mép khung Polaroid
        ctx.strokeStyle = 'rgba(255, 240, 200, 0.55)';
        ctx.lineWidth = 3;
        ctx.strokeRect(1.5, 1.5, 633, 772);
      }

      requestAnimationFrame(render3D);
    }

    requestAnimationFrame(render3D);
  }

  // ==========================================================================
  // 3. CÔ GÁI ĐANG NẰM - MÁI TÓC BỒNG BỀNH CHUYỂN ĐỘNG (#comp-mvpfzoii)
  // ==========================================================================
  function initGuideHairMotion() {
    const section = document.getElementById('comp-mvpfzoii') || document.getElementById('comp-mvpfzoir');
    if (!section) return;

    const img = section.querySelector('img');
    if (!img) return;

    const oldLayer = document.getElementById('hairMotionLayer');
    if (oldLayer) oldLayer.remove();
    const oldCanvas = document.getElementById('guideHairCanvas');
    if (oldCanvas) oldCanvas.remove();

    const canvas = document.createElement('canvas');
    canvas.id = 'guideHairCanvas';
    canvas.className = 'koc-art-canvas';
    section.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = 1200, height = 675;

    function resize() {
      width = canvas.width = section.clientWidth || 1200;
      height = canvas.height = section.clientHeight || 675;
    }
    resize();
    window.addEventListener('resize', resize);

    // Tọa độ chính xác của các ngôi sao & trăng khuyết trên mái tóc cô gái (trên ảnh gốc 1920x1080)
    const hairStars = [
      { ix: 1358, iy: 386, r: 22, phase: 0.0 },
      { ix: 1330, iy: 442, r: 19, phase: 1.1 },
      { ix: 1495, iy: 472, r: 24, phase: 2.2 },
      { ix: 1410, iy: 512, r: 17, phase: 0.6 },
      { ix: 1525, iy: 585, r: 20, phase: 1.8 },
      { ix: 1648, iy: 604, r: 23, phase: 2.9 },
      { ix: 1292, iy: 538, r: 15, phase: 3.5 },
      { ix: 1160, iy: 382, r: 16, phase: 4.1 }
    ];

    let startTime = performance.now();

    function renderHair(now) {
      const t = (now - startTime) * 0.001;
      if (canvas.width !== section.clientWidth || canvas.height !== section.clientHeight) {
        resize();
      }
      ctx.clearRect(0, 0, width, height);

      const mapper = getImageMapper(section, img, 0.5, 0.5);

      if (img.complete && img.naturalWidth > 0) {
        // Vùng mái tóc cô gái trên ảnh 1920x1080: ix từ 1215 đến 1765, iy từ 315 đến 632
        // Cắt thành 58 dải dọc (Vertical Mesh Strips) để tạo sóng tóc uốn lượn bồng bềnh thực tế
        const x0 = 1215;
        const x1 = 1765;
        const y0 = 315;
        const y1 = 632;
        const numStrips = 58;
        const stripW = (x1 - x0) / numStrips;

        ctx.save();
        // Giới hạn vùng vẽ nằm gọn trong khung tranh nâu của cô gái (không chạm viền đỏ ở y=645)
        const clipRect = mapper.toScreenRect(x0, y0 - 15, x1 - x0, (y1 - y0) + 22);
        ctx.beginPath();
        ctx.rect(clipRect.x, clipRect.y, clipRect.w, clipRect.h);
        ctx.clip();

        for (let i = 0; i < numStrips; i++) {
          const u = i / numStrips; // 0 ở sát khuôn mặt, 1 ở đuôi tóc bên phải
          // Hàm cửa sổ (Envelope) bằng 0 ở 2 đầu để ghép liền mạch tuyệt đối với ảnh nền
          const env = Math.sin(Math.pow(u, 0.72) * Math.PI);
          // Độ nhấp nhô sóng tóc (±20px trên ảnh gốc)
          const waveY = Math.sin(t * 3.1 - u * 5.2) * 20.0 * env;

          const sx = x0 + i * stripW;
          // Lấp nền giấy kraft ở dải này trước khi vẽ dải tóc dịch chuyển để không lộ bóng tóc tĩnh bên dưới
          const bgRect = mapper.toScreenRect(sx, y0, stripW + 1.2, y1 - y0);
          ctx.fillStyle = '#d0a667';
          ctx.fillRect(bgRect.x, bgRect.y, bgRect.w, bgRect.h);

          // Vẽ dải tóc đã được nâng/hạ theo sóng sin
          const dst = mapper.toScreenRect(sx, y0 + waveY, stripW + 1.2, y1 - y0);
          ctx.drawImage(img, sx, y0, stripW + 1.2, y1 - y0, dst.x, dst.y, dst.w, dst.h);
        }

        // Vẽ các dải lụa ánh kim mượt mà lướt dọc theo suối tóc đang gợn sóng
        for (let s = 0; s < 4; s++) {
          ctx.beginPath();
          const baseIy = 415 + s * 42;
          for (let step = 0; step <= 30; step++) {
            const u = step / 30;
            const ix = 1235 + u * 475;
            const env = Math.sin(Math.pow(u, 0.72) * Math.PI);
            const waveY = Math.sin(t * 3.1 - u * 5.2) * 20.0 * env;
            const curveIy = baseIy + u * 135 + Math.sin(u * Math.PI * 2 + s) * 14 + waveY;
            const pt = mapper.toScreen(ix, curveIy);
            if (step === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          const shimmerAlpha = (Math.sin(t * 2.2 + s * 1.4) * 0.5 + 0.5) * 0.42;
          ctx.strokeStyle = `rgba(255, 242, 195, ${shimmerAlpha})`;
          ctx.lineWidth = (2.8 - s * 0.4) * mapper.scale;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        ctx.restore();
      }

      // Vẽ các ngôi sao 4 cánh lấp lánh chuyển động nhịp nhàng cùng làn sóng tóc
      for (const st of hairStars) {
        const u = Math.max(0, Math.min(1, (st.ix - 1215) / (1765 - 1215)));
        const env = Math.sin(Math.pow(u, 0.72) * Math.PI);
        const waveY = Math.sin(t * 3.1 - u * 5.2) * 20.0 * env;

        const pt = mapper.toScreen(st.ix, st.iy + waveY);
        const pulse = Math.sin(t * 3.4 + st.phase) * 0.5 + 0.5;
        const rad = st.r * mapper.scale * (0.65 + pulse * 0.75);
        drawSparkleStar(ctx, pt.x, pt.y, rad, 0.35 + pulse * 0.65, t * 0.6 + st.phase);
      }

      requestAnimationFrame(renderHair);
    }

    requestAnimationFrame(renderHair);
  }

  // ==========================================================================
  // 4. CÔ GÁI CHẢI TÓC & LÁ BỒ KẾT TẠI FOOTER (#comp-kbgakxmn_r_comp-kbgakgyt)
  // ==========================================================================
  function initFooterLadyMotion() {
    const section = document.getElementById('comp-kbgakxmn_r_comp-kbgakgyt')
      || document.querySelector('.wix-synced-footer')
      || document.getElementById('comp-kbgakxmn');
    if (!section) return;

    const img = section.querySelector('img[src*="footer-art"]') || section.querySelector('img');
    if (!img) return;

    const oldLayer = document.getElementById('footerMotionLayer');
    if (oldLayer) oldLayer.remove();
    const oldCanvas = document.getElementById('footerLadyCanvas');
    if (oldCanvas) oldCanvas.remove();

    const canvas = document.createElement('canvas');
    canvas.id = 'footerLadyCanvas';
    canvas.className = 'koc-art-canvas';
    section.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = 1200, height = 820;

    function resize() {
      width = canvas.width = section.clientWidth || 1200;
      height = canvas.height = section.clientHeight || 820;
    }
    resize();
    window.addEventListener('resize', resize);

    // Các ngôi sao trên suối tóc cô gái ở Footer (tọa độ trên ảnh 1920x1080)
    const footerStars = [
      { ix: 1180, iy: 405, r: 19, phase: 0.0 },
      { ix: 1185, iy: 660, r: 23, phase: 1.2 },
      { ix: 1160, iy: 800, r: 18, phase: 2.1 },
      { ix: 1240, iy: 802, r: 22, phase: 2.8 },
      { ix: 1200, iy: 945, r: 19, phase: 3.6 }
    ];

    let startTime = performance.now();

    function renderFooter(now) {
      const t = (now - startTime) * 0.001;
      if (canvas.width !== section.clientWidth || canvas.height !== section.clientHeight) {
        resize();
      }
      ctx.clearRect(0, 0, width, height);

      // Footer dùng object-position: center right -> alignX = 1.0, alignY = 0.5
      const mapper = getImageMapper(section, img, 1.0, 0.5);

      // Chu kỳ động tác vuốt/chải tóc từ trên xuống (0 -> 1 mỗi 2.8 giây)
      const combCycle = (t * 0.36) % 1.0;
      const handStroke = Math.sin(combCycle * Math.PI); // Nhịp tay đưa xuống rồi thu về

      if (img.complete && img.naturalWidth > 0) {
        // A. CHUYỂN ĐỘNG ĐÔI TAY VUỐT TÓC & SUỐI TÓC ĐUNG ĐƯA (ix: 1035..1375, iy: 465..1005)
        const x0 = 1035;
        const x1 = 1375;
        const y0 = 465;
        const y1 = 1005;
        const numStrips = 54;
        const stripH = (y1 - y0) / numStrips;

        for (let i = 0; i < numStrips; i++) {
          const v = i / numStrips; // 0 ở ngang vai/cổ, 1 ở đuôi tóc sát đất
          const env = Math.sin(Math.pow(v, 0.75) * Math.PI);

          // Sóng tóc đung đưa ngang + nhịp tay vuốt chải dọc theo lọn tóc
          const swayX = Math.sin(t * 2.6 - v * 4.8) * 15.0 * env;
          // Vùng đôi bàn tay (v từ 0.05 đến 0.38) dịch chuyển vuốt dọc theo mái tóc
          const handEnv = (v < 0.45) ? Math.sin((v / 0.45) * Math.PI) : 0;
          const strokeY = handStroke * 18.0 * handEnv;
          const strokeX = -handStroke * 6.0 * handEnv;

          const sy = y0 + i * stripH;
          // Lấp màu nền giấy kraft của vòng tròn nghệ thuật trước khi vẽ dải dịch chuyển
          const bgRect = mapper.toScreenRect(x0, sy, x1 - x0, stripH + 1.2);
          ctx.fillStyle = '#d3b27d';
          ctx.fillRect(bgRect.x, bgRect.y, bgRect.w, bgRect.h);

          const dst = mapper.toScreenRect(x0 + swayX + strokeX, sy + strokeY, x1 - x0, stripH + 1.2);
          ctx.drawImage(img, x0, sy, x1 - x0, stripH + 1.2, dst.x, dst.y, dst.w, dst.h);
        }

        // B. CHUYỂN ĐỘNG CÀNH LÁ & CHÙM BỒ KẾT PHÍA TRÊN ĐẦU ĐUNG ĐƯA THEO GIÓ (ix: 1310..1620, iy: 10..300)
        const bx0 = 1310, bx1 = 1620, by0 = 10, by1 = 300;
        const bStrips = 24;
        const bStripH = (by1 - by0) / bStrips;
        for (let i = 0; i < bStrips; i++) {
          const v = i / bStrips;
          const env = Math.sin(v * Math.PI);
          const leafSwayX = Math.sin(t * 2.0 - v * 3.0) * 11.0 * env;
          const sy = by0 + i * bStripH;
          const dst = mapper.toScreenRect(bx0 + leafSwayX, sy, bx1 - bx0, bStripH + 1.2);
          ctx.drawImage(img, bx0, sy, bx1 - bx0, bStripH + 1.2, dst.x, dst.y, dst.w, dst.h);
        }
      }

      // C. VỆT SÁNG LƯỢC CHẢI TÓC ÓNG MƯỢT LƯỚT TỪ TAY XUỐNG ĐUÔI TÓC
      const sweepY = 480 + combCycle * 490; // Chạy từ y=480 (bàn tay) xuống y=970 (đuôi tóc)
      const sweepV = (sweepY - 465) / (1005 - 465);
      const sweepEnv = Math.sin(Math.pow(Math.max(0, Math.min(1, sweepV)), 0.75) * Math.PI);
      const sweepSwayX = Math.sin(t * 2.6 - sweepV * 4.8) * 15.0 * sweepEnv;
      const sweepCenterX = 1190 - Math.sin(sweepV * Math.PI) * 35 + sweepSwayX;

      const sweepPt = mapper.toScreen(sweepCenterX, sweepY);
      const sweepW = 95 * mapper.scale;
      const sweepH = 48 * mapper.scale;

      ctx.save();
      ctx.translate(sweepPt.x, sweepPt.y);
      ctx.rotate((-12 * Math.PI) / 180);
      const combGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, sweepW);
      const combAlpha = Math.sin(combCycle * Math.PI) * 0.65;
      combGrad.addColorStop(0, `rgba(255, 248, 210, ${combAlpha})`);
      combGrad.addColorStop(0.5, `rgba(255, 225, 140, ${combAlpha * 0.5})`);
      combGrad.addColorStop(1, 'rgba(255, 220, 120, 0)');
      ctx.fillStyle = combGrad;
      ctx.scale(1, sweepH / sweepW);
      ctx.beginPath();
      ctx.arc(0, 0, sweepW, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // D. CÁC NGÔI SAO LẤP LÁNH TRÊN SUỐI TÓC CÔ GÁI Ở FOOTER
      for (const st of footerStars) {
        const v = Math.max(0, Math.min(1, (st.iy - 465) / (1005 - 465)));
        const env = Math.sin(Math.pow(v, 0.75) * Math.PI);
        const swayX = Math.sin(t * 2.6 - v * 4.8) * 15.0 * env;

        // Ngôi sao bừng sáng mạnh hơn khi vệt chải tóc lướt ngang qua
        const distToSweep = Math.abs(st.iy - sweepY);
        const sweepBoost = Math.max(0, 1 - distToSweep / 120) * 0.6;
        const pulse = (Math.sin(t * 3.2 + st.phase) * 0.5 + 0.5) + sweepBoost;

        const pt = mapper.toScreen(st.ix + swayX, st.iy);
        const rad = st.r * mapper.scale * (0.7 + pulse * 0.7);
        drawSparkleStar(ctx, pt.x, pt.y, rad, 0.4 + pulse * 0.6, t * 0.7 + st.phase);
      }

      requestAnimationFrame(renderFooter);
    }

    requestAnimationFrame(renderFooter);
  }
})();
