/**
 * CART.JS - QUẢN LÝ GIỎ HÀNG VÀ ĐẶT HÀNG E-COMMERCE
 * Đồng bộ localStorage, tính phí ship (Freeship >= 200k) và kết nối Google Sheets Webhook.
 */

const CART_STORAGE_KEY = 'thorakao_koc_cart';
const ORDERS_STORAGE_KEY = 'thorakao_koc_orders';

// Khởi tạo giỏ hàng từ localStorage
function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  localStorage.setItem('thorakao_cart', JSON.stringify(cart));
  updateCartUI();
}

// Thêm sản phẩm vào giỏ
function addToCart(qty = 1, showDrawer = true) {
  const cart = getCart();
  const prod = THORAKAO_CONFIG.PRODUCT;
  
  const existingIndex = cart.findIndex(item => item.id === prod.id);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += qty;
  } else {
    cart.push({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image,
      capacity: prod.capacity,
      quantity: qty
    });
  }

  saveCart(cart);
  showToast(`Đã thêm ${qty} chai dầu gội vào giỏ hàng!`);

  if (showDrawer) {
    openCartDrawer();
  }
}

// Cập nhật số lượng
function updateQuantity(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    saveCart(cart);
  }
}

// Xóa khỏi giỏ
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  showToast('Đã xóa sản phẩm khỏi giỏ hàng!');
}

// Tính toán giỏ hàng
function getCartSummary() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const totalQty = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Quy định phí ship: >= 200.000đ: 0đ; < 200.000đ: 25.000đ
  let shippingFee = 0;
  if (subtotal > 0) {
    shippingFee = subtotal >= THORAKAO_CONFIG.PRODUCT.freeShippingThreshold ? 0 : THORAKAO_CONFIG.PRODUCT.standardShippingFee;
  }
  const total = subtotal + shippingFee;

  return {
    cart,
    totalQty,
    subtotal,
    shippingFee,
    total,
    freeShipDiff: Math.max(0, THORAKAO_CONFIG.PRODUCT.freeShippingThreshold - subtotal)
  };
}

// Cập nhật giao diện Drawer giỏ hàng và Header
function updateCartUI() {
  const summary = getCartSummary();

  // 1. Cập nhật Badge trên Header
  const badges = document.querySelectorAll('.cart-badge, .header-cart-badge, #open-header-cart [data-hook="items-count"], #open-header-cart [data-part="item-count"], #open-header-cart text, #open-header-cart span, [data-part="item-count"]');
  badges.forEach(b => {
    b.textContent = summary.totalQty;
  });

  // 2. Cập nhật Drawer giỏ hàng
  const drawerBody = document.getElementById('cart-drawer-items');
  const drawerSubtotal = document.getElementById('cart-drawer-subtotal');
  const drawerShipNotice = document.getElementById('cart-drawer-ship-notice');
  const drawerCheckoutBtn = document.getElementById('cart-drawer-checkout-btn');

  if (drawerBody) {
    if (summary.cart.length === 0) {
      drawerBody.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 10px;">🧴</div>
          <p style="font-weight: 600;">Giỏ hàng của bạn đang trống</p>
          <p style="font-size: 0.85rem; margin-top: 6px;">Hãy chọn thêm dầu gội bồ kết để trải nghiệm nhé!</p>
          <a href="product.html" class="btn btn-primary" style="margin-top: 20px; font-size: 0.85rem; padding: 8px 20px;">Xem sản phẩm</a>
        </div>
      `;
      if (drawerSubtotal) drawerSubtotal.innerText = '0₫';
      if (drawerShipNotice) drawerShipNotice.style.display = 'none';
      if (drawerCheckoutBtn) drawerCheckoutBtn.style.pointerEvents = 'none';
    } else {
      let itemsHtml = '';
      summary.cart.forEach(item => {
        itemsHtml += `
          <div style="display: flex; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--border-color); align-items: center;">
            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: contain; background: #FAF7F2; border-radius: 8px; padding: 4px;">
            <div style="flex: 1;">
              <h5 style="font-size: 0.9rem; font-weight: 700; color: var(--color-primary-dark); margin-bottom: 4px;">${item.name}</h5>
              <div style="font-size: 0.85rem; color: var(--color-primary); font-weight: 700;">${item.price.toLocaleString('vi-VN')}₫</div>
              <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                <button type="button" onclick="updateQuantity('${item.id}', -1)" style="width: 26px; height: 26px; border: 1px solid var(--border-color); background: #FFF; border-radius: 4px; font-weight: 700; cursor: pointer;">-</button>
                <span style="font-size: 0.9rem; font-weight: 700; min-width: 20px; text-align: center;">${item.quantity}</span>
                <button type="button" onclick="updateQuantity('${item.id}', 1)" style="width: 26px; height: 26px; border: 1px solid var(--border-color); background: #FFF; border-radius: 4px; font-weight: 700; cursor: pointer;">+</button>
              </div>
            </div>
            <button type="button" onclick="removeFromCart('${item.id}')" style="background: none; border: none; color: #999; font-size: 1.1rem; cursor: pointer;" title="Xóa">✕</button>
          </div>
        `;
      });
      drawerBody.innerHTML = itemsHtml;
      if (drawerSubtotal) drawerSubtotal.innerText = summary.subtotal.toLocaleString('vi-VN') + '₫';
      if (drawerCheckoutBtn) drawerCheckoutBtn.style.pointerEvents = 'auto';

      if (drawerShipNotice) {
        drawerShipNotice.style.display = 'block';
        if (summary.freeShipDiff === 0) {
          drawerShipNotice.innerHTML = `🎉 <strong>Chúc mừng!</strong> Bạn đã được <strong>MIỄN PHÍ VẬN CHUYỂN</strong>!`;
          drawerShipNotice.style.background = '#E8F5E9';
          drawerShipNotice.style.borderColor = '#C8E6C9';
          drawerShipNotice.style.color = '#2E7D32';
        } else {
          drawerShipNotice.innerHTML = `Mua thêm <strong>${summary.freeShipDiff.toLocaleString('vi-VN')}₫</strong> để được <strong>MIỄN PHÍ VẬN CHUYỂN</strong>!`;
          drawerShipNotice.style.background = '#FFF7EB';
          drawerShipNotice.style.borderColor = '#F5D3A3';
          drawerShipNotice.style.color = '#B45309';
        }
      }
    }
  }

  // 3. Cập nhật trang cart.html (nếu đang ở trang cart.html)
  if (typeof renderCartPage === 'function') {
    renderCartPage(summary);
  }
}

// Drawer Mở / Đóng
function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer-backdrop');
  if (drawer) {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer-backdrop');
  if (drawer) {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Đặt hàng & Gửi Webhook
async function submitOrder(orderData) {
  const orderId = 'THO-' + Date.now().toString().slice(-6);
  const payload = {
    type: 'ORDER',
    orderId: orderId,
    fullName: orderData.fullName,
    phone: orderData.phone,
    address: orderData.address,
    productName: THORAKAO_CONFIG.PRODUCT.name,
    quantity: orderData.quantity,
    subtotal: orderData.subtotal,
    shippingFee: orderData.shippingFee,
    totalPrice: orderData.total,
    paymentMethod: orderData.paymentMethod || 'COD',
    note: orderData.note || '',
    createdAtISO: new Date().toISOString()
  };

  // Gắn tài khoản (nếu khách đã đăng nhập)
  const authUser = (window.ThorakaoAuth && window.ThorakaoAuth.user) || (typeof getLoggedInUser === 'function' ? getLoggedInUser() : null);
  if (authUser) {
    payload.uid = authUser.uid || '';
    payload.email = authUser.email || '';
  }

  // 1. Lưu đơn hàng vào localStorage dự phòng
  try {
    const existingOrders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    existingOrders.unshift(payload);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(existingOrders));
  } catch (e) {}

  // 1b. Lưu đơn vào Firestore & tự động bổ sung SĐT/Địa chỉ vào hồ sơ nếu chưa có
  if (window.ThorakaoAuth && window.ThorakaoAuth.user) {
    if (window.ThorakaoAuth.saveOrder) {
      try { await window.ThorakaoAuth.saveOrder(payload); } catch (e) { console.warn('Lưu đơn lên tài khoản thất bại:', e); }
    }
    if (window.ThorakaoAuth.updateProfileData) {
      try {
        const curProf = (await window.ThorakaoAuth.getProfile()) || {};
        const updates = {};
        if (!curProf.phone && orderData.phone) updates.phone = orderData.phone;
        if (!curProf.address && orderData.address) updates.address = orderData.address;
        if (Object.keys(updates).length > 0) {
          await window.ThorakaoAuth.updateProfileData(updates);
        }
      } catch (e) {}
    }
  }

  // 2. Gửi Webhook Google Sheet (Nếu đã cài đặt URL)
  if (THORAKAO_CONFIG.GOOGLE_SHEET_WEBHOOK_URL) {
    try {
      fetch(THORAKAO_CONFIG.GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Webhook error:', err);
    }
  }

  // Xóa sạch giỏ hàng
  saveCart([]);

  return { success: true, orderId: orderId };
}

// Tự điền form đặt hàng bằng hồ sơ khi khách đã đăng nhập (không bắt buộc đăng nhập để đặt hàng)
async function prefillOrderForm(user) {
  const nameEl = document.getElementById('order-fullname');
  if (!nameEl) return;
  const set = (id, v) => {
    const el = document.getElementById(id);
    if (el && !el.value && v) el.value = v;
  };

  try {
    const cached = typeof getLoggedInUser === 'function' ? getLoggedInUser() : null;
    if (cached) {
      set('order-fullname', cached.fullName || cached.name);
      set('order-phone', cached.phone);
      set('order-address', cached.address);
    }
    const activeUser = user || (window.ThorakaoAuth && window.ThorakaoAuth.user);
    if (activeUser && window.ThorakaoAuth && window.ThorakaoAuth.getProfile) {
      const p = (await window.ThorakaoAuth.getProfile()) || {};
      set('order-fullname', p.fullName || activeUser.displayName);
      set('order-phone', p.phone);
      set('order-address', p.address);
    }
  } catch (e) {
    console.warn('Prefill error:', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  prefillOrderForm();
});
window.addEventListener('auth:changed', (e) => prefillOrderForm(e.detail));
