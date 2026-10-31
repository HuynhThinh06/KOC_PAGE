/**
 * ANIMATIONS.JS - HỆ THỐNG HIỆU ỨNG NGHỆ THUẬT ĐỘNG (INTERACTIVE ART SYSTEM)
 * 1. Cánh hoa đào bay theo gió (Canvas Sakura Particles)
 * 2. Đàn cò vỗ cánh bay lượn (SVG Vector Wings)
 * 3. Suối tóc sóng sánh bồng bềnh & Ngôi sao lấp lánh
 * 4. Cô gái chải tóc & lá bồ kết đung đưa tại Footer
 * 5. Nghiêng 3D chân thật (Interactive 3D Tilt) cho sản phẩm dầu gội
 */

document.addEventListener('DOMContentLoaded', () => {
  initSakuraFallingPetals();
  initStorksAnimation();
  initSleepingHairMotion();
  initFooterLadyMotion();
  initProduct3DTilt();
});

// ==========================================================================
// 1. CÁNH HOA ĐÀO RƠI BỒNG BỀNH THEO LÀN GIÓ (CANVAS SAKURA PARTICLES)
// ==========================================================================
function initSakuraFallingPetals() {
  const storyContainer = document.getElementById('comp-mpbn2o59') || document.querySelector('.comp-mpbn2o51');
  if (!storyContainer) return;

  // Tạo Canvas lồng vào trong section
  let canvas = document.getElementById('sakuraStoryCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'sakuraStoryCanvas';
    canvas.className = 'sakura-canvas';
    storyContainer.style.position = 'relative';
    storyContainer.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  let width, height;
  let petals = [];
  let isVisible = false;

  function resize() {
    width = canvas.width = storyContainer.offsetWidth;
    height = canvas.height = storyContainer.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Cấu trúc 1 cánh hoa đào rơi
  class Petal {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = initial ? Math.random() * width : Math.random() * width * 0.4; // xuất phát nhiều từ phía cành đào góc trên bên trái
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 9 + 8; // Kích thước cánh hoa
      this.speedX = Math.random() * 1.8 + 0.8; // Gió thổi từ trái sang phải
      this.speedY = Math.random() * 1.2 + 0.9; // Rơi xuống
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 2;
      this.opacity = Math.random() * 0.4 + 0.6;
      this.flip = Math.random() * Math.PI;
      this.flipSpeed = Math.random() * 0.03 + 0.01;
      // Màu hoa đào phấn hồng
      const pinkShades = [
        'rgba(244, 143, 150, ',
        'rgba(235, 120, 130, ',
        'rgba(248, 175, 180, ',
        'rgba(220, 95, 105, '
      ];
      this.colorBase = pinkShades[Math.floor(Math.random() * pinkShades.length)];
    }
    update() {
      this.x += this.speedX + Math.sin(this.flip) * 0.5;
      this.y += this.speedY;
      this.rotation += this.rotSpeed;
      this.flip += this.flipSpeed;

      if (this.y > height + 20 || this.x > width + 20) {
        this.reset(false);
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.scale(Math.cos(this.flip), 1);

      // Vẽ hình dạng cánh hoa đào oval mềm mại
      ctx.beginPath();
      ctx.moveTo(0, -this.size / 2);
      ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size / 2, this.size / 2, 0, this.size / 2);
      ctx.bezierCurveTo(-this.size / 2, this.size / 2, -this.size / 2, -this.size / 2, 0, -this.size / 2);

      ctx.fillStyle = this.colorBase + this.opacity + ')';
      ctx.fill();

      // Điểm nhụy hoa đào phớt nhẹ
      ctx.beginPath();
      ctx.arc(0, -this.size / 4, this.size / 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 235, 200, ' + (this.opacity * 0.7) + ')';
      ctx.fill();

      ctx.restore();
    }
  }

  // Khởi tạo 28 cánh hoa
  for (let i = 0; i < 28; i++) {
    petals.push(new Petal());
  }

  function loop() {
    if (!isVisible) return;
    ctx.clearRect(0, 0, width, height);
    for (let p of petals) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(loop);
  }

  // IntersectionObserver: Chỉ render khi người dùng cuộn đến section
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!isVisible) {
          isVisible = true;
          loop();
        }
      } else {
        isVisible = false;
      }
    });
  }, { threshold: 0.1 });

  observer.observe(storyContainer);
}

// ==========================================================================
// 2. HIỆU ỨNG ĐÀN CÒ VỖ CÁNH BAY TRÊN BẦU TRỜI (BRAND STORY)
// ==========================================================================
function initStorksAnimation() {
  const storyContainer = document.getElementById('comp-mpbn2o59') || document.querySelector('.comp-mpbn2o51');
  if (!storyContainer) return;

  let wrap = document.getElementById('storksFlightWrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'storksFlightWrap';
    wrap.className = 'storks-flight-wrap';

    // 2 Chú cò thủy mặc vector với hình dáng chân thật như tranh gốc
    wrap.innerHTML = `
      <!-- Chú cò lớn dẫn đầu -->
      <div class="stork-single stork-lead">
        <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));">
          <!-- Thân & Cổ cò -->
          <path d="M12 28 C28 32, 45 42, 58 55 C70 68, 88 88, 108 95" stroke="#1c1917" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M10 27 C16 28, 22 30, 28 34 C36 40, 50 56, 56 64 C64 56, 75 48, 85 45" fill="#fdfbf7" stroke="#1c1917" stroke-width="2.5"/>
          <!-- Chỏm đầu đỏ hạc hoàng hậu -->
          <circle cx="11" cy="27" r="3" fill="#cf3824"/>
          <!-- Đôi cánh xòe bay lông vũ -->
          <path d="M42 45 C35 25, 30 8, 38 4 C48 0, 52 18, 56 38 C60 16, 68 8, 76 10 C82 12, 78 30, 72 48" fill="#ffffff" stroke="#1c1917" stroke-width="3" stroke-linejoin="round"/>
          <!-- Vệt đen cánh hạc -->
          <path d="M36 12 C38 6, 44 2, 48 5 C46 16, 48 26, 50 36 M66 12 C72 10, 76 13, 74 20 C70 30, 68 38, 66 46" stroke="#1c1917" stroke-width="3" stroke-linecap="round"/>
          <!-- Chân dài duỗi thẳng -->
          <path d="M60 66 L95 95 M56 68 L88 98" stroke="#1c1917" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
      </div>

      <!-- Chú cò con bay theo sau -->
      <div class="stork-single stork-follow">
        <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.12));">
          <path d="M14 30 C28 33, 44 42, 56 54 C66 66, 82 84, 102 92" stroke="#1c1917" stroke-width="4" stroke-linecap="round"/>
          <path d="M12 29 C18 30, 24 32, 30 35 C38 42, 48 54, 54 62 C62 55, 72 48, 80 45" fill="#fdfbf7" stroke="#1c1917" stroke-width="2"/>
          <circle cx="13" cy="29" r="2.5" fill="#cf3824"/>
          <path d="M40 44 C34 26, 28 10, 36 6 C46 2, 50 20, 54 38 C58 18, 66 10, 74 12 C80 14, 76 30, 70 46" fill="#ffffff" stroke="#1c1917" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M58 64 L90 92 M54 66 L84 95" stroke="#1c1917" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    `;
    storyContainer.style.position = 'relative';
    storyContainer.appendChild(wrap);
  }
}

// ==========================================================================
// 3. MÁI TÓC BỒNG BỀNH & SAO LẤP LÁNH (HƯỚNG DẪN SỬ DỤNG)
// ==========================================================================
function initSleepingHairMotion() {
  const guideContainer = document.getElementById('comp-mvpfzoir') || document.querySelector('.comp-mvpfzoii');
  if (!guideContainer) return;

  let hairWrap = document.getElementById('sleepingHairOverlay');
  if (!hairWrap) {
    hairWrap = document.createElement('div');
    hairWrap.id = 'sleepingHairOverlay';
    hairWrap.className = 'sleeping-hair-overlay';

    // Vệt hào quang bồng bềnh và 4 ngôi sao nhỏ lấp lánh trên tóc
    hairWrap.innerHTML = `
      <div class="hair-glow-shimmer"></div>
      
      <!-- Ngôi sao 4 cánh lấp lánh -->
      <svg class="star-sparkle star-1" viewBox="0 0 24 24" fill="#ffffff">
        <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z"/>
      </svg>
      <svg class="star-sparkle star-2" viewBox="0 0 24 24" fill="#fffae0">
        <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z"/>
      </svg>
      <svg class="star-sparkle star-3" viewBox="0 0 24 24" fill="#ffffff">
        <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z"/>
      </svg>
      <svg class="star-sparkle star-4" viewBox="0 0 24 24" fill="#fff5cc">
        <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z"/>
      </svg>
    `;
    guideContainer.style.position = 'relative';
    guideContainer.appendChild(hairWrap);
  }
}

// ==========================================================================
// 4. CÔ GÁI CHẢI TÓC & LÁ BỒ KẾT ĐUNG ĐƯA (FOOTER)
// ==========================================================================
function initFooterLadyMotion() {
  const footerContainer = document.getElementById('comp-kbgakxmn_r_comp-mdr17w8k') || document.querySelector('.wix-synced-footer');
  if (!footerContainer) return;

  let ladyWrap = document.getElementById('footerLadyMotionWrap');
  if (!ladyWrap) {
    ladyWrap = document.createElement('div');
    ladyWrap.id = 'footerLadyMotionWrap';
    ladyWrap.className = 'footer-lady-motion';

    ladyWrap.innerHTML = `
      <!-- Vệt sáng chuyển động nhịp nhàng như động tác chải tóc -->
      <div class="hair-comb-stroke">
        <div class="comb-light-beam"></div>
      </div>

      <!-- Chùm lá bồ kết đung đưa theo gió nhẹ -->
      <div class="boket-leaves-sway">
        <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; opacity: 0.65;">
          <path d="M30 10 Q90 50 170 30" stroke="#4a5d3d" stroke-width="2.5" stroke-linecap="round"/>
          <ellipse cx="60" cy="30" rx="9" ry="16" transform="rotate(35 60 30)" fill="#5b7348"/>
          <ellipse cx="85" cy="40" rx="8" ry="15" transform="rotate(25 85 40)" fill="#4d623c"/>
          <ellipse cx="115" cy="42" rx="9" ry="16" transform="rotate(-15 115 42)" fill="#5b7348"/>
          <ellipse cx="140" cy="38" rx="8" ry="14" transform="rotate(-30 140 38)" fill="#425533"/>
        </svg>
      </div>
    `;
    footerContainer.style.position = 'relative';
    footerContainer.appendChild(ladyWrap);
  }
}

// ==========================================================================
// 5. HIỆU ỨNG 3D PARALLAX TILT CHO CHAI DẦU GỘI THORAKAO (SẢN PHẨM)
// ==========================================================================
function initProduct3DTilt() {
  const prodContainer = document.getElementById('comp-mpbn2o3a') || document.querySelector('.comp-mpbn2o2z');
  if (!prodContainer) return;

  const imgEl = prodContainer.querySelector('img');
  if (!imgEl) return;

  // Bọc hình ảnh trong card 3D
  if (!prodContainer.classList.contains('product-3d-card-wrap')) {
    prodContainer.classList.add('product-3d-card-wrap');

    // Thêm vệt sáng bóng (specular glare) và ánh kim quang chạy qua chai
    const innerWrap = document.createElement('div');
    innerWrap.className = 'product-3d-inner';

    const glare = document.createElement('div');
    glare.className = 'product-3d-glare';

    const shine = document.createElement('div');
    shine.className = 'bottle-shine-effect';

    // Di chuyển img vào trong innerWrap
    imgEl.parentNode.insertBefore(innerWrap, imgEl);
    innerWrap.appendChild(imgEl);
    innerWrap.appendChild(glare);
    innerWrap.appendChild(shine);

    // Tính toán góc nghiêng 3D mượt mà khi rê chuột
    let bounds;
    function onMouseEnter() {
      bounds = prodContainer.getBoundingClientRect();
    }

    function onMouseMove(e) {
      if (!bounds) bounds = prodContainer.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const xPct = mouseX / bounds.width - 0.5; // -0.5 đến 0.5
      const yPct = mouseY / bounds.height - 0.5;

      const maxTilt = 9; // Độ nghiêng tối đa
      const rotateX = -yPct * maxTilt;
      const rotateY = xPct * maxTilt;

      innerWrap.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
      glare.style.background = `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 60%)`;
    }

    function onMouseLeave() {
      innerWrap.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }

    prodContainer.addEventListener('mouseenter', onMouseEnter);
    prodContainer.addEventListener('mousemove', onMouseMove);
    prodContainer.addEventListener('mouseleave', onMouseLeave);
  }
}
