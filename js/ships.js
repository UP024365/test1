/**
 * js/ships.js
 * 함선 레이더 차트 초기화
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
            scales: { 
                r: { 
                    ticks: { display: false }, 
                    grid: { color: '#f5f5f5' }, 
                    pointLabels: { font: { weight: '800', size: 10 } } 
                } 
            }, 
            plugins: { legend: { display: false } } 
        }
    });
}