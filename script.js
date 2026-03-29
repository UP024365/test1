let allPosts = []; 
let ddayInterval;
const targetDate = new Date("May 1, 2026 00:00:00").getTime();

const routeData = {
    'red-isle': {
        title: "Red Isle Protocol",
        detail: "세인트 안느 주변 고효율 루트. 담배와 사탕수수 수급이 용이하며 소형선 파밍에 최적화되어 있습니다."
    },
    'east-indies': {
        title: "East Indies Spice Route",
        detail: "최상위 티어 구역. 심철(Heart of Ice)과 로즈우드 수급의 핵심지이며 바크 13T 복구 세팅을 권장합니다."
    }
};

/**
 * 탭 전환 로직
 */
function switchTab(id) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    
    const activeBtn = Array.from(document.querySelectorAll('.nav-link')).find(btn => 
        btn.getAttribute('onclick').includes(`'${id}'`)
    );
    if(activeBtn) activeBtn.classList.add('active');
    
    const targetSection = document.getElementById(id);
    if(targetSection) targetSection.classList.add('active');
    
    if(id === 'ships') initRadar();
    if(id === 'archive') startDDayCounter();
    else stopDDayCounter();
}

/**
 * 디데이 카운트다운
 */
function updateDDay() {
    const timerElement = document.getElementById('countdown-timer');
    if (!timerElement) return;
    const now = new Date().getTime();
    const distance = targetDate - now;
    if (distance < 0) {
        timerElement.innerText = "SEASON PROTOCOL INITIATED";
        return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
    timerElement.innerText = `${days}D ${hours}H ${minutes}M ${seconds}S`;
}

function startDDayCounter() {
    updateDDay();
    if(ddayInterval) clearInterval(ddayInterval);
    ddayInterval = setInterval(updateDDay, 1000);
}

function stopDDayCounter() {
    if(ddayInterval) clearInterval(ddayInterval);
}

/**
 * 무역로 정보 표시
 */
function showRoute(key) {
    const data = routeData[key];
    if(!data) return;
    document.getElementById('route-title').innerText = data.title;
    document.getElementById('route-detail').innerText = data.detail;
}

/**
 * 차트 초기화
 */
function initRadar() {
    const canvas = document.getElementById('radarChart');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(window.rChart) window.rChart.destroy();
    window.rChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['화력', '생존', '속도', '복구', '적재'],
            datasets: [{
                data: [65, 85, 70, 100, 75],
                borderColor: '#000',
                backgroundColor: 'rgba(0,0,0,0.02)',
                borderWidth: 1,
                pointRadius: 2
            }]
        },
        options: { 
            maintainAspectRatio: false, 
            scales: { r: { ticks: { display: false }, grid: { color: '#f5f5f5' }, pointLabels: { font: { weight: '800', size: 10 } } } }, 
            plugins: { legend: { display: false } } 
        }
    });
}

/**
 * 인증 및 게시판
 */
function handleAuth() {
    if (window.auth && window.auth.currentUser) window.logout();
    else window.login();
}

window.loadPosts = function() {
    const { db, appId, firebaseUtils } = window;
    if (!db) return;
    const q = firebaseUtils.collection(db, 'artifacts', appId, 'public', 'data', 'posts');
    firebaseUtils.onSnapshot(q, (snap) => {
        allPosts = [];
        snap.forEach(d => allPosts.push({ id: d.id, ...d.data() }));
        allPosts.sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        filterPosts(); 
    });
}

function renderPosts(postsToRender) {
    const list = document.getElementById('post-list');
    if(!list) return;
    list.innerHTML = "";
    
    if(postsToRender.length === 0) {
        list.innerHTML = "<p class='text-center text-[10px] text-gray-300 py-10 uppercase tracking-widest'>Archive is empty.</p>";
        return;
    }

    postsToRender.forEach(p => {
        const isMyPost = window.auth.currentUser && window.auth.currentUser.uid === p.uid;
        const row = document.createElement('div');
        row.className = "flex gap-6 border-b border-gray-50 pb-3 items-center hover:bg-gray-50 transition p-2 group text-[11px]";
        
        // 삭제 버튼(Delete) 추가됨
        row.innerHTML = `
            <div class="font-black min-w-[80px] uppercase truncate ${isMyPost ? 'text-blue-600' : 'opacity-40'}">${p.author}</div>
            <div class="text-gray-500 font-medium flex-grow">${p.content}</div>
            ${isMyPost ? `<button onclick="deleteMsg('${p.id}', '${p.uid}')" class="opacity-0 group-hover:opacity-100 text-[9px] font-bold text-red-400 hover:text-red-600 transition uppercase tracking-tighter">Delete</button>` : ''}
        `;
        list.appendChild(row);
    });
}

function filterPosts() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || "";
    const filtered = allPosts.filter(p => (p.author || "").toLowerCase().includes(searchTerm) || (p.content || "").toLowerCase().includes(searchTerm));
    renderPosts(filtered);
}

async function sendMsg() {
    const user = window.auth.currentUser;
    if(!user) return alert("LOGIN REQUIRED");
    const content = document.getElementById('p-msg').value;
    if(!content) return;
    const { db, appId, firebaseUtils } = window;
    try {
        await firebaseUtils.addDoc(firebaseUtils.collection(db, 'artifacts', appId, 'public', 'data', 'posts'), {
            author: user.displayName, uid: user.uid, content: content, createdAt: firebaseUtils.serverTimestamp()
        });
        document.getElementById('p-msg').value = "";
    } catch(e) { alert("FAIL"); }
}

async function deleteMsg(postId, writerUid) {
    const user = window.auth.currentUser;
    if(!user || user.uid !== writerUid) {
        alert("본인이 작성한 글만 삭제할 수 있습니다.");
        return;
    }

    if(!confirm("이 기록을 삭제하시겠습니까?")) return;
    
    const { db, appId, firebaseUtils } = window;
    try {
        await firebaseUtils.deleteDoc(firebaseUtils.doc(db, 'artifacts', appId, 'public', 'data', 'posts', postId));
    } catch (e) {
        alert("삭제 권한이 없습니다.");
    }
}

window.onload = () => { 
    initRadar(); // 차트 초기화
    
    // 기본적으로 열려 있는 탭이 'archive'라면 카운터 시작
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection && activeSection.id === 'archive') {
        startDDayCounter();
    }
    
    // Firebase 데이터 로드
    if (window.loadPosts) {
        window.loadPosts(); 
    }
};