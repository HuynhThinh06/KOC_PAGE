/**
 * AUTH.JS - Đăng ký / đăng nhập bằng Google, Facebook, Email (Firebase Auth)
 * Lưu hồ sơ và đơn hàng của người dùng trên Cloud Firestore.
 * Nạp bằng: <script type="module" src="assets/js/auth.js"></script>
 * Phát sự kiện `auth:changed` (detail: user | null) và `auth:ready` trên window.
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithPopup, signInWithRedirect,
  GoogleAuthProvider, FacebookAuthProvider, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, addDoc, collection, getDocs,
  query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const cfg = (window.THORAKAO_CONFIG || (typeof THORAKAO_CONFIG !== "undefined" ? THORAKAO_CONFIG : {})).FIREBASE || {};
const enabled = !!(cfg.apiKey && cfg.projectId);

export const AUTH_ERRORS = {
  "auth/email-already-in-use": "Email này đã được đăng ký. Hãy đăng nhập hoặc dùng cách đăng nhập khác.",
  "auth/invalid-email": "Email không hợp lệ.",
  "auth/weak-password": "Mật khẩu quá yếu, cần tối thiểu 6 ký tự.",
  "auth/wrong-password": "Email hoặc mật khẩu không đúng.",
  "auth/user-not-found": "Email hoặc mật khẩu không đúng.",
  "auth/invalid-credential": "Email hoặc mật khẩu không đúng.",
  "auth/too-many-requests": "Bạn thử quá nhiều lần. Vui lòng đợi một lát rồi thử lại.",
  "auth/popup-closed-by-user": "Bạn đã đóng cửa sổ đăng nhập.",
  "auth/cancelled-popup-request": "Bạn đã đóng cửa sổ đăng nhập.",
  "auth/network-request-failed": "Lỗi mạng. Vui lòng kiểm tra kết nối.",
  "auth/account-exists-with-different-credential":
    "Email này đã được dùng với cách đăng nhập khác (Google/Facebook/Email). Hãy đăng nhập bằng cách đó."
};

export function translateError(err) {
  return AUTH_ERRORS[err && err.code] || "Có lỗi xảy ra, vui lòng thử lại.";
}

const api = { enabled, user: null, translateError };

if (enabled) {
  const app = initializeApp(cfg);
  const auth = getAuth(app);
  auth.languageCode = "vi";
  const db = getFirestore(app);

  const social = async (provider) => {
    try {
      return await signInWithPopup(auth, provider);
    } catch (e) {
      if (e.code === "auth/popup-blocked") return signInWithRedirect(auth, provider);
      throw e;
    }
  };

  const saveProfile = (uid, data) =>
    setDoc(doc(db, "users", uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });

  Object.assign(api, {
    loginGoogle: () => social(new GoogleAuthProvider()),
    loginFacebook: () => social(new FacebookAuthProvider()),
    async register(name, email, password) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await saveProfile(cred.user.uid, { fullName: name, email });
      window.dispatchEvent(new CustomEvent("auth:changed", { detail: cred.user }));
      return cred;
    },
    login: (email, password) => signInWithEmailAndPassword(auth, email, password),
    resetPassword: (email) => sendPasswordResetEmail(auth, email),
    logout: () => signOut(auth),
    async getProfile() {
      if (!auth.currentUser) return null;
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      return snap.exists() ? snap.data() : null;
    },
    updateProfileData(data) {
      if (!auth.currentUser) return Promise.reject(new Error("not-logged-in"));
      return saveProfile(auth.currentUser.uid, data);
    },
    async saveOrder(order) {
      if (!auth.currentUser) return;
      await addDoc(collection(db, "users", auth.currentUser.uid, "orders"),
        { ...order, createdAt: serverTimestamp() });
    },
    async getOrders() {
      if (!auth.currentUser) return [];
      const q = query(collection(db, "users", auth.currentUser.uid, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
  });

  onAuthStateChanged(auth, async (user) => {
    api.user = user;
    if (user) {
      // Tạo hồ sơ lần đầu khi đăng nhập Google/Facebook
      try {
        const ref = doc(db, "users", user.uid);
        if (!(await getDoc(ref)).exists()) {
          await saveProfile(user.uid, { fullName: user.displayName || "", email: user.email || "" });
        }
      } catch (e) { console.warn("Profile init:", e); }
    }
    window.dispatchEvent(new CustomEvent("auth:changed", { detail: user }));
  });
}

window.ThorakaoAuth = api;
window.dispatchEvent(new CustomEvent("auth:ready", { detail: api }));
