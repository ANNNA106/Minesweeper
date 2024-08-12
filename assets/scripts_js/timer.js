let timeElapsed = 0; // Start at 0 seconds

const timerElement = document.getElementById('timer');

function updateTimer() {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timeElapsed++;
}

const timerInterval = setInterval(updateTimer, 1000); // Update every second