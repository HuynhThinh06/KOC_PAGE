/**
 * AUTH-UI.JS - Modal đăng nhập/đăng ký và menu tài khoản trên header.
 * Phụ thuộc vào auth.js (window.ThorakaoAuth). Nếu chưa cấu hình Firebase thì không hiển thị gì.
 */
(function () {
  let mode = "login";
  let modal, btnWrap;

  const esc = (s) => String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function buildModal() {
    modal = document.createElement("div");
    modal.className = "auth-backdrop";
    modal.innerHTML = `
      <div class="auth-modal" role="dialog" aria-modal="true" aria-label="Đăng nhập">
        <button type="button" class="auth-close" aria-label="Đóng">&times;</button>
        <div class="auth-tabs">
          <button type="button" data-tab="login" class="active">Đăng nhập</button>
          <button type="button" data-tab="register">Đăng ký</button>
        </div>
        <button type="button" class="auth-social auth-google" data-social="google">Tiếp tục với Google</button>
        <button type="button" class="auth-social auth-facebook" data-social="facebook">Tiếp tục với Facebook</button>
        <div class="auth-divider"><span>hoặc dùng email</span></div>
        <form class="auth-form" novalidate>
          <input type="text" name="name" class="form-input auth-name" placeholder="Họ và tên" autocomplete="name">
          <input type="email" name="email" class="form-input" placeholder="Email" autocomplete="email" required>
          <input type="password" name="password" class="form-input" placeholder="Mật khẩu (tối thiểu 6 ký tự)" autocomplete="current-password" required>
          <div class="auth-msg" role="alert"></div>
          <button type="submit" class="btn btn-primary auth-submit">Đăng nhập</button>
          <a href="#" class="auth-forgot">Quên mật khẩu?</a>
        </form>
      </div>`;
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    modal.querySelector(".auth-close").onclick = close;
    modal.querySelectorAll("[data-tab]").forEach((b) => (b.onclick = () => setMode(b.dataset.tab)));
    modal.querySelectorAll("[data-social]").forEach((b) => (b.onclick = () => social(b.dataset.social)));
    modal.querySelector(".auth-form").addEventListener("submit", submit);
    modal.querySelector(".auth-forgot").onclick = forgot;
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  const msg = (text, ok) => {
    const m = modal.querySelector(".auth-msg");
    m.textContent = text || "";
    m.className = "auth-msg" + (ok ? " ok" : "");
  };

  function setMode(m) {
    mode = m;
    modal.querySelectorAll("[data-tab]").forEach((b) => b.classList.toggle("active", b.dataset.tab === m));
    modal.querySelector(".auth-name").style.display = m === "register" ? "" : "none";
    modal.querySelector(".auth-forgot").style.display = m === "login" ? "" : "none";
    modal.querySelector(".auth-submit").textContent = m === "login" ? "Đăng nhập" : "Tạo tài khoản";
    modal.querySelector('[name="password"]').autocomplete = m === "login" ? "current-password" : "new-password";
    msg("");
  }

  function open(m) {
    if (!modal) buildModal();
    setMode(m || "login");
    modal.classList.add("open");
  }
  function close() { if (modal) modal.classList.remove("open"); }

  async function run(fn) {
    const A = window.ThorakaoAuth;
    msg("Đang xử lý...", true);
    try { await fn(A); msg(""); close(); }
    catch (err) { msg(A.translateError(err)); }
  }

  const social = (kind) => run((A) => (kind === "google" ? A.loginGoogle() : A.loginFacebook()));

  function submit(e) {
    e.preventDefault();
    const f = e.target;
    const name = f.name.value.trim(), email = f.email.value.trim(), pw = f.password.value;
    if (!email || !pw) return msg("Vui lòng nhập email và mật khẩu.");
    if (mode === "register") {
      if (!name) return msg("Vui lòng nhập họ và tên.");
      if (pw.length < 6) return msg("Mật khẩu cần tối thiểu 6 ký tự.");
      return run((A) => A.register(name, email, pw));
    }
    run((A) => A.login(email, pw));
  }

  async function forgot(e) {
    e.preventDefault();
    const email = modal.querySelector('[name="email"]').value.trim();
    if (!email) return msg("Nhập email của bạn rồi bấm lại 'Quên mật khẩu'.");
    try {
      await window.ThorakaoAuth.resetPassword(email);
      msg("Đã gửi email đặt lại mật khẩu (nếu email tồn tại). Hãy kiểm tra hộp thư.", true);
    } catch (err) { msg(window.ThorakaoAuth.translateError(err)); }
  }

  function renderButton(user) {
    if (!btnWrap) {
      btnWrap = document.createElement("div");
      btnWrap.className = "auth-nav";
      const host = document.querySelector(".header-actions");
      if (host) {
        host.insertBefore(btnWrap, host.firstChild);
      } else {
        // Không tạo nút nổi gây trùng lặp với header Wix
        return;
      }
    }
    if (!user) {
      btnWrap.innerHTML = '<button type="button" class="btn btn-outline auth-login-btn">Đăng nhập</button>';
      btnWrap.querySelector("button").onclick = () => open("login");
      return;
    }
    const name = user.displayName || (user.email || "").split("@")[0] || "Tài khoản";
    const avatar = user.photoURL
      ? `<img src="${esc(user.photoURL)}" alt="" referrerpolicy="no-referrer">`
      : `<span class="auth-initial">${esc(name.charAt(0).toUpperCase())}</span>`;
    btnWrap.innerHTML = `
      <button type="button" class="auth-avatar-btn" aria-haspopup="true">${avatar}<span class="auth-name-text">${esc(name)}</span></button>
      <div class="auth-menu">
        <a href="account.html">Tài khoản của tôi</a>
        <a href="account.html#orders">Đơn hàng của tôi</a>
        <button type="button" class="auth-logout">Đăng xuất</button>
      </div>`;
    const menu = btnWrap.querySelector(".auth-menu");
    btnWrap.querySelector(".auth-avatar-btn").onclick = (e) => { e.stopPropagation(); menu.classList.toggle("open"); };
    btnWrap.querySelector(".auth-logout").onclick = () => window.ThorakaoAuth.logout();
    document.addEventListener("click", () => menu.classList.remove("open"));
  }

  function init() {
    const A = window.ThorakaoAuth;
    if (!A || !A.enabled) return; // Chưa cấu hình Firebase: ẩn tính năng
    renderButton(A.user);
    window.addEventListener("auth:changed", (e) => renderButton(e.detail));
    window.openAuthModal = open;
  }

  if (window.ThorakaoAuth) {
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();
  } else {
    window.addEventListener("auth:ready", () =>
      document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init());
  }
})();
