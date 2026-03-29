/**
 * js/archive.js
 * 디데이 카운트다운 로직
 */

let ddayInterval;
const targetDate = new Date("May 1, 2026 00:00:00").getTime();

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