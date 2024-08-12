let timer;
let timeElapsed = 0;

function startTimer() {
    if (timer) {
        clearInterval(timer); // Clear any existing timer
    }
    timer = setInterval(() => {
        timeElapsed++;
        document.getElementById("timer").innerText = `Time: ${timeElapsed}`;
        console.log(timeElapsed);
    }, 1000);
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        console.log('Timer stopped at:', timeElapsed);
    } else {
        console.log('No timer to stop');
    }
}