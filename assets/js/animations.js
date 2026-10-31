/**
 * ANIMATIONS.JS - HỆ THỐNG HIỆU ỨNG NGHỆ THUẬT ĐỘNG
 * 1. Cánh hoa đào rơi tại SECTION "THÔNG TIN CHIẾN DỊCH"
 * 2. Nghiêng 3D chân thật (Interactive 3D Tilt) cho sản phẩm dầu gội
 * 3. Suối tóc sóng sánh bồng bềnh & Ngôi sao lấp lánh tại HƯỚNG DẪN SỬ DỤNG
 * 4. Cô gái chải tóc & Lá bồ kết đung đưa tại FOOTER
 */

document.addEventListener('DOMContentLoaded', () => {
  initCampaignSakuraPetals();
  initProduct3DInteractive();
  initGuideHairMotion();
  initFooterLadyMotion();
});

// ==========================================================================
// 1. CÁNH HOA ĐÀO RƠI TẠI SECTION "THÔNG TIN CHIẾN DỊCH" (thong-tin-chien-dich.png)
// ==========================================================================
function initCampaignSakuraPetals() {
  const container = document.getElementById('comp-mvq57q0k') || document.getElementById('comp-mvq57pzq');
  if (!container) return;

  // Đảm bảo container định vị relative
  container.style.position = 'relative';

  let canvas = document.getElementById('sakuraCampaignCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'sakuraCampaignCanvas';
    canvas.className = 'sakura-canvas-campaign';
    container.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  let width, height;
  let petals = [];

  function resize() {
    width = canvas.width = container.offsetWidth || 1200;
    height = canvas.height = container.offsetHeight || 600;
  }
  resize();
  window.addEventListener('resize', resize);

  class SakuraPetal {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = initial ? Math.random() * width : Math.random() * width * 0.8;
      this.y = initial ? Math.random() * height : -25;
      this.size = Math.random() * 10 + 9;
      this.speedX = Math.random() * 1.6 + 0.6; // Gió thoảng từ trái sang phải
      this.speedY = Math.random() * 1.3 + 0.8; // Rơi xuống
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 2.2;
      this.opacity = Math.random() * 0.35 + 0.65;
      this.flip = Math.random() * Math.PI;
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

      // Tâm hoa sáng nhẹ
      ctx.beginPath();
      ctx.arc(0, -this.size / 4, this.size / 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 245, 220, ' + (this.opacity * 0.8) + ')';
      ctx.fill();

      ctx.restore();
    }
  }

  // Khởi tạo 32 cánh hoa
  for (let i = 0; i < 32; i++) {
    petals.push(new SakuraPetal());
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    for (let p of petals) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(loop);
  }
  loop();
}

// ==========================================================================
// 2. NGHIÊNG 3D CHÂN THẬT (INTERACTIVE 3D TILT) CHO SẢN PHẨM DẦU GỘI (san-pham.png)
// ==========================================================================
function initProduct3DInteractive() {
  const container = document.getElementById('comp-mpbn2o3a') || document.querySelector('.comp-mpbn2o2z');
  if (!container) return;

  const img = container.querySelector('img');
  if (!img) return;

  container.style.position = 'relative';

  // Thêm vệt sáng bóng phản chiếu (Specular Glare) & Ánh kim quang
  let glare = container.querySelector('.product-specular-glare');
  if (!glare) {
    glare = document.createElement('div');
    glare.className = 'product-specular-glare';
    container.appendChild(glare);
  }

  let beam = container.querySelector('.bottle-shine-beam');
  if (!beam) {
    beam = document.createElement('div');
    beam.className = 'bottle-shine-beam';
    container.appendChild(beam);
  }

  container.classList.add('product-3d-wrap');

  // Tính toán hiệu ứng xoay 3D trực tiếp trên hình ảnh khi di chuột
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = (x / rect.width) - 0.5;
    const yPct = (y / rect.height) - 0.5;

    const maxTilt = 8; // Nghiêng tối đa 8 độ
    const rotX = -yPct * maxTilt;
    const rotY = xPct * maxTilt;

    img.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(1.02)`;
    glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 55%)`;
  });

  container.addEventListener('mouseleave', () => {
    img.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
}

// ==========================================================================
// 3. SUỐI TÓC BỒNG BỀNH & SAO LẤP LÁNH TẠI HƯỚNG DẪN SỬ DỤNG (huong-dan-su-dung.png)
// ==========================================================================
function initGuideHairMotion() {
  const container = document.getElementById('comp-mvpfzoir') || document.getElementById('comp-mvpfzoii');
  if (!container) return;

  container.style.position = 'relative';

  let layer = document.getElementById('hairMotionLayer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'hairMotionLayer';
    layer.className = 'hair-motion-layer';

    layer.innerHTML = `
      <div class="hair-wave-glow"></div>
      
      <!-- 3 Ngôi sao 4 cánh tỏa sáng nhấp nháy trên mái tóc -->
      <svg class="hair-star-twinkle h-star-1" viewBox="0 0 24 24" fill="#ffffff">
        <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z"/>
      </svg>
      <svg class="hair-star-twinkle h-star-2" viewBox="0 0 24 24" fill="#fffae0">
        <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z"/>
      </svg>
      <svg class="hair-star-twinkle h-star-3" viewBox="0 0 24 24" fill="#ffffff">
        <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z"/>
      </svg>
    `;
    container.appendChild(layer);
  }
}

// ==========================================================================
// 4. CÔ GÁI CHẢI TÓC & LÁ BỒ KẾT TẠI FOOTER (footer-art.png)
// ==========================================================================
function initFooterLadyMotion() {
  const container = document.getElementById('comp-kbgakxmn_r_comp-mdr17w8k') || document.getElementById('comp-kbgakxmn');
  if (!container) return;

  container.style.position = 'relative';

  let footerLayer = document.getElementById('footerMotionLayer');
  if (!footerLayer) {
    footerLayer = document.createElement('div');
    footerLayer.id = 'footerMotionLayer';
    footerLayer.className = 'footer-motion-layer';

    footerLayer.innerHTML = `
      <!-- Vệt ánh sáng chải tóc êm ả lướt xuôi suối tóc -->
      <div class="comb-sweep-wrap">
        <div class="comb-sweep-glow"></div>
      </div>

      <!-- Cành lá bồ kết đung đưa theo gió -->
      <div class="footer-leaf-breeze">
        <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; opacity: 0.7;">
          <path d="M10 10 Q60 40 140 25" stroke="#4a5d3d" stroke-width="2.5" stroke-linecap="round"/>
          <ellipse cx="40" cy="25" rx="8" ry="14" transform="rotate(30 40 25)" fill="#5b7348"/>
          <ellipse cx="70" cy="34" rx="7" ry="13" transform="rotate(20 70 34)" fill="#4d623c"/>
          <ellipse cx="100" cy="33" rx="8" ry="14" transform="rotate(-15 100 33)" fill="#5b7348"/>
          <ellipse cx="125" cy="28" rx="7" ry="12" transform="rotate(-25 125 28)" fill="#425533"/>
        </svg>
      </div>
    `;
    container.appendChild(footerLayer);
  }
}
