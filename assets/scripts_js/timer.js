const countdownTime = 10 * 60; // 10 minutes
let timeRemaining = countdownTime;

// Update the timer every second
const timerElement = document.getElementById('timer');

function updateTimer() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timeRemaining--;

    if (timeRemaining < 0) {
        clearInterval(timerInterval);
        timerElement.textContent = 'Time\'s up!';
    }
}

const timerInterval = setInterval(updateTimer, 1000);