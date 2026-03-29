/**
 * js/main.js
 * 공통 내비게이션 및 인증 핸들러
 */

// 탭 전환 로직
function switchTab(id) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    
    const activeBtn = Array.from(document.querySelectorAll('.nav-link')).find(btn => 
        btn.getAttribute('onclick').includes(`'${id}'`)
    );
    if(activeBtn) activeBtn.classList.add('active');
    
    const targetSection = document.getElementById(id);
    if(targetSection) targetSection.classList.add('active');
    
    // 페이지별 특수 로직 실행 제어
    if(id === 'ships') {
        if (typeof initRadar === 'function') initRadar();
    }
    
    if(id === 'archive') {
        if (typeof startDDayCounter === 'function') startDDayCounter();
    } else {
        if (typeof stopDDayCounter === 'function') stopDDayCounter();
    }
}

// 인증(로그인/로그아웃) 처리
function handleAuth() {
    if (window.auth && window.auth.currentUser) window.logout();
    else window.login();
}

// 초기 로드 설정
window.onload = () => { 
    // 기본적으로 열려 있는 탭이 'archive'라면 카운터 시작
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection && activeSection.id === 'archive') {
        if (typeof startDDayCounter === 'function') startDDayCounter();
    }
    
    // Firebase 데이터 로드 시작
    if (typeof window.loadPosts === 'function') {
        window.loadPosts(); 
    }
};