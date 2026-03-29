import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, serverTimestamp, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAFwAW39PfZ5K73zKNImq1wOQw4oXj0pbo",
    authDomain: "jp08041.firebaseapp.com",
    projectId: "jp08041",
    storageBucket: "jp08041.firebasestorage.app",
    messagingSenderId: "870601458638",
    appId: "1:870601458638:web:2a954a2ce5731065b3219f",
    measurementId: "G-F1FQ043HWE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const appId = "test1";

// 전역 변수로 설정하여 script.js에서 접근 가능하게 함
window.db = db;
window.auth = auth;
window.appId = appId;
window.firebaseUtils = { collection, addDoc, onSnapshot, query, serverTimestamp, deleteDoc, doc };

// 구글 로그인/로그아웃 함수
window.login = async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (e) {
        console.error("로그인 실패:", e);
        alert("로그인 중 오류가 발생했습니다.");
    }
};
window.logout = () => signOut(auth);

// 인증 상태 감시
onAuthStateChanged(auth, (user) => {
    const light = document.getElementById('status-light');
    const authBtn = document.getElementById('auth-btn');
    const pNameInput = document.getElementById('p-name');
    const pMsgInput = document.getElementById('p-msg');

    if (user) {
        if(light) light.classList.replace('bg-gray-500', 'bg-green-500');
        if(authBtn) authBtn.innerText = "LOGOUT";
        if(pNameInput) {
            pNameInput.value = user.displayName;
            pNameInput.readOnly = true;
        }
        if(pMsgInput) pMsgInput.placeholder = "공유할 전술을 입력하세요...";
        if (typeof window.loadPosts === "function") window.loadPosts();
    } else {
        if(light) light.classList.replace('bg-green-500', 'bg-gray-500');
        if(authBtn) authBtn.innerText = "LOGIN WITH GOOGLE";
        if(pNameInput) {
            pNameInput.value = "";
            pNameInput.placeholder = "LOGIN REQUIRED";
        }
        if(pMsgInput) pMsgInput.placeholder = "먼저 로그인을 해주세요.";
    }
});