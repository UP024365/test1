/**
 * js/map.js
 * 무역로 구역별 상세 정보
 */

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

function showRoute(key) {
    const data = routeData[key];
    if(!data) return;
    
    const titleEl = document.getElementById('route-title');
    const detailEl = document.getElementById('route-detail');
    
    if (titleEl) titleEl.innerText = data.title;
    if (detailEl) detailEl.innerText = data.detail;
}