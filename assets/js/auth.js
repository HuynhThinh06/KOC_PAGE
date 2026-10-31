/**
 * AUTH.JS - Đăng ký / đăng nhập bằng Google, Facebook, Email (Firebase Auth)
 * Lưu hồ sơ và đơn hàng của người dùng trên Cloud Firestore (kèm đồng bộ dự phòng localStorage).
 * Nạp bằng: <script type="module" src="assets/js/auth.js"></script>
 * Phát sự kiện `auth:changed` (detail: user | null) và `auth:ready` trên window.
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithPopup, signInWithRedirect,
  GoogleAuthProvider, FacebookAuthProvider, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile, signOut,
  setPersistence, browserLocalPersistence, browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, addDoc, collection, getDocs,
  query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const cfg = (window.THORAKAO_CONFIG || (typeof THORAKAO_CONFIG !== "undefined" ? THORAKAO_CONFIG : {})).FIREBASE || {};
const enabled = !!(cfg.apiKey && cfg.projectId);

export const AUTH_ERRORS = {
  "auth/email-already-in-use": "Email này đã được đăng ký. Hãy đăng nhập hoặc dùng cách đăng nhập khác.",
  "auth/invalid-email": "Địa chỉ email không hợp lệ.",
  "auth/weak-password": "Mật khẩu quá yếu, cần tối thiểu 6 ký tự.",
  "auth/missing-password": "Vui lòng nhập mật khẩu.",
  "auth/wrong-password": "Email hoặc mật khẩu không đúng.",
  "auth/user-not-found": "Không tìm thấy tài khoản với email này.",
  "auth/invalid-credential": "Email hoặc mật khẩu không chính xác.",
  "auth/user-disabled": "Tài khoản này đã bị vô hiệu hóa.",
  "auth/too-many-requests": "Bạn đã thử quá nhiều lần. Vui lòng đợi vài phút rồi thử lại.",
  "auth/popup-closed-by-user": "Bạn đã đóng cửa sổ đăng nhập trước khi hoàn tất.",
  "auth/cancelled-popup-request": "Yêu cầu mở cửa sổ đăng nhập đã bị hủy.",
  "auth/popup-blocked": "Trình duyệt đã chặn cửa sổ bật lên (Popup). Vui lòng cho phép popup cho trang web này.",
  "auth/network-request-failed": "Lỗi kết nối mạng. Vui lòng kiểm tra Internet của bạn.",
  "auth/operation-not-allowed": "Phương thức đăng nhập này chưa được bật trên Firebase Console (Authentication -> Sign-in method).",
  "auth/unauthorized-domain": "Tên miền hiện tại chưa được thêm vào Authorized Domains trong Firebase Console.",
  "auth/account-exists-with-different-credential":
    "Email này đã được liên kết với phương thức đăng nhập khác (Google/Facebook/Email). Hãy đăng nhập bằng phương thức đó."
};

export function translateError(err) {
  if (!err) return "Có lỗi xảy ra, vui lòng thử lại.";
  if (typeof err === "string") return AUTH_ERRORS[err] || err;
  return AUTH_ERRORS[err.code] || err.message || "Có lỗi xảy ra, vui lòng thử lại.";
}

// Helper lưu/đọc hồ sơ dự phòng ở localStorage theo uid
function getLocalProfile(uid) {
  if (!uid) return {};
  try {
    return JSON.parse(localStorage.getItem("thorakao_profile_" + uid) || "{}");
  } catch (e) {
    return {};
  }
}

function setLocalProfile(uid, data) {
  if (!uid) return {};
  try {
    const current = getLocalProfile(uid);
    const merged = { ...current, ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem("thorakao_profile_" + uid, JSON.stringify(merged));
    return merged;
  } catch (e) {
    return data || {};
  }
}

function syncCachedUser(user, profileData = {}) {
  if (!user) {
    localStorage.removeItem("thorakao_user");
    return;
  }
  const localProf = getLocalProfile(user.uid);
  const mergedProf = { ...localProf, ...profileData };
  const name = mergedProf.fullName || user.displayName || (user.email ? user.email.split("@")[0] : "Khách hàng");
  const cached = {
    uid: user.uid,
    email: user.email || mergedProf.email || "",
    name: name,
    fullName: name,
    phone: mergedProf.phone || "",
    address: mergedProf.address || "",
    photoURL: user.photoURL || "",
    loggedIn: true,
    loginTime: new Date().toISOString()
  };
  localStorage.setItem("thorakao_user", JSON.stringify(cached));
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

  const saveProfile = async (uid, data) => {
    const cleanData = {};
    Object.keys(data || {}).forEach((k) => {
      if (data[k] !== undefined) cleanData[k] = data[k];
    });
    setLocalProfile(uid, cleanData);
    if (auth.currentUser && auth.currentUser.uid === uid) {
      syncCachedUser(auth.currentUser, cleanData);
    }
    try {
      await setDoc(doc(db, "users", uid), { ...cleanData, updatedAt: serverTimestamp() }, { merge: true });
    } catch (e) {
      console.warn("Firestore saveProfile fallback to local:", e);
    }
  };

  Object.assign(api, {
    loginGoogle: () => social(new GoogleAuthProvider()),
    loginFacebook: () => social(new FacebookAuthProvider()),

    async register(name, email, password, phone = "") {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        try {
          await updateProfile(cred.user, { displayName: name });
        } catch (e) {}
      }
      const profilePayload = {
        fullName: name || email.split("@")[0],
        email: email,
        phone: phone || ""
      };
      await saveProfile(cred.user.uid, profilePayload);
      syncCachedUser(cred.user, profilePayload);
      window.dispatchEvent(new CustomEvent("auth:changed", { detail: cred.user }));
      return cred;
    },

    async login(email, password, rememberMe = true) {
      try {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      } catch (e) {}
      const cred = await signInWithEmailAndPassword(auth, email, password);
      syncCachedUser(cred.user);
      return cred;
    },

    resetPassword: (email) => sendPasswordResetEmail(auth, email),

    async logout() {
      localStorage.removeItem("thorakao_user");
      await signOut(auth);
    },

    async getProfile() {
      if (!auth.currentUser) return null;
      const uid = auth.currentUser.uid;
      const localProf = getLocalProfile(uid);
      try {
        const snap = await getDoc(doc(db, "users", uid));
        if (snap.exists()) {
          const remoteProf = snap.data() || {};
          const merged = { ...localProf, ...remoteProf };
          setLocalProfile(uid, merged);
          syncCachedUser(auth.currentUser, merged);
          return merged;
        }
      } catch (e) {
        console.warn("Firestore getProfile fallback to local:", e);
      }
      const fallback = {
        fullName: localProf.fullName || auth.currentUser.displayName || (auth.currentUser.email || "").split("@")[0],
        email: auth.currentUser.email || localProf.email || "",
        phone: localProf.phone || "",
        address: localProf.address || ""
      };
      return fallback;
    },

    async updateProfileData(data) {
      if (!auth.currentUser) throw new Error("not-logged-in");
      const uid = auth.currentUser.uid;
      if (data.fullName && data.fullName !== auth.currentUser.displayName) {
        try {
          await updateProfile(auth.currentUser, { displayName: data.fullName });
        } catch (e) {}
      }
      await saveProfile(uid, data);
      window.dispatchEvent(new CustomEvent("auth:changed", { detail: auth.currentUser }));
    },

    async saveOrder(order) {
      if (!auth.currentUser) return;
      try {
        await addDoc(collection(db, "users", auth.currentUser.uid, "orders"), {
          ...order,
          createdAt: serverTimestamp()
        });
      } catch (e) {
        console.warn("Firestore saveOrder fallback to local:", e);
      }
    },

    async getOrders() {
      if (!auth.currentUser) return [];
      const uid = auth.currentUser.uid;
      const email = (auth.currentUser.email || "").toLowerCase();
      let remoteOrders = [];
      try {
        const q = query(collection(db, "users", uid, "orders"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        remoteOrders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch (e) {
        console.warn("Firestore getOrders fallback to local:", e);
      }

      // Kết hợp với đơn hàng lưu trong localStorage của cùng tài khoản để không mất đơn
      let localOrders = [];
      try {
        const allLocal = JSON.parse(localStorage.getItem("thorakao_koc_orders") || "[]");
        localOrders = allLocal.filter(
          (o) => (o.uid && o.uid === uid) || (o.email && o.email.toLowerCase() === email)
        );
      } catch (e) {}

      const seenIds = new Set();
      const combined = [];
      for (const o of [...remoteOrders, ...localOrders]) {
        const key = o.orderId || o.id;
        if (key && seenIds.has(key)) continue;
        if (key) seenIds.add(key);
        combined.push(o);
      }
      return combined;
    }
  });

  onAuthStateChanged(auth, async (user) => {
    api.user = user;
    if (user) {
      syncCachedUser(user);
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          const initData = {
            fullName: user.displayName || (user.email || "").split("@")[0] || "",
            email: user.email || ""
          };
          await saveProfile(user.uid, initData);
        } else {
          const remoteData = snap.data() || {};
          setLocalProfile(user.uid, remoteData);
          syncCachedUser(user, remoteData);
        }
      } catch (e) {
        console.warn("Profile init:", e);
      }
    } else {
      localStorage.removeItem("thorakao_user");
    }
    window.dispatchEvent(new CustomEvent("auth:changed", { detail: user }));
  });
}

window.ThorakaoAuth = api;
window.dispatchEvent(new CustomEvent("auth:ready", { detail: api }));
