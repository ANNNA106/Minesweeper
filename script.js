let board = [];
//default difficulty is easy
let rows = 8;
let columns = 8;
let level = 'easy';

let minesCount = 10;
let minesLocation = []; // "2-2", "3-4", "2-1"

let tilesClicked = 0; //goal to click all tiles except the ones containing mines
let flagEnabled = false;

let gameOver = false;

window.onload = function() {
    level = localStorage.getItem('difficulty');
    this.value = level;
    console.log("level",level, this.value);
    document.getElementById('difficultyButton').addEventListener('click', function() {
        var dropdown = document.getElementById('difficultyOptions');
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });
    setDifficulty(level);
    document.querySelectorAll('.difficulty-option').forEach(option => {
        option.addEventListener('click', function() {
            var difficulty = this.getAttribute('data-value');
            console.log('Selected difficulty:', difficulty);
            localStorage.setItem('difficulty', difficulty);
            setDifficulty(difficulty);
            highlightSelectedOption(difficulty);
            document.getElementById('difficultyOptions').style.display = 'none';
        });
    });
    console.log(minesCount, rows, columns);
    startGame();
}

function highlightSelectedOption(difficulty) {
    document.querySelectorAll('.difficulty-option').forEach(option => {
        if (option.getAttribute('data-value') === difficulty) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

function setDifficulty(level) {
    var board = document.getElementById('board');
    if (level == 'easy') {
        rows = 8;
        columns = 8;
        minesCount = 10;
        board.style.width = "400px";
        board.style.height = "400px";
        level = 'easy';
    } else if(level == 'medium'){
        rows = 10;
        columns = 10;
        minesCount = 15;
        board.style.width = "500px";
        board.style.height = "500px";
        level = 'medium';
    } else if (level == 'hard') {
        rows = 12;
        columns = 12;
        minesCount = 20;
        board.style.width = "600px";
        board.style.height = "600px";
        level = 'hard';
    }

    // Reset the game with new settings
    startGame();
}

function setMines() {
    // minesLocation.push("2-2");
    // minesLocation.push("2-3");
    // minesLocation.push("5-6");
    // minesLocation.push("3-4");
    // minesLocation.push("1-1");
    minesLocation = [];
    let minesLeft = minesCount;
    while (minesLeft > 0) { 
        console.log(rows,columns)
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}


function startGame() {
    for (let c = 0; c < board.length ; c++) {
        for (let r = 0; r < board.length ; r++) {
            board[r][c].style.display = "none";
        }
    }
    board = [];
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines();
    //populate our board
    console.log(rows);
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            //<div id="0-0"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            tile.style.display = "flex";
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }
    console.log(tile.id);
    if (minesLocation.includes(tile.id)) {
        // alert("GAME OVER");
        gameOver = true;
        revealMines();
        return;
    }


    let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);

}

function revealMines() {
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";                
            }
        }
    }
    gameFinished(false);

}

// Function to show the modal
function showRestartModal() {
    document.getElementById('restartModal').style.display = 'block';
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    //top 3
    minesFound += checkTile(r-1, c-1);      //top left
    minesFound += checkTile(r-1, c);        //top 
    minesFound += checkTile(r-1, c+1);      //top right

    //left and right
    minesFound += checkTile(r, c-1);        //left
    minesFound += checkTile(r, c+1);        //right

    //bottom 3
    minesFound += checkTile(r+1, c-1);      //bottom left
    minesFound += checkTile(r+1, c);        //bottom 
    minesFound += checkTile(r+1, c+1);      //bottom right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        board[r][c].innerText = "";
        
        //top 3
        checkMine(r-1, c-1);    //top left
        checkMine(r-1, c);      //top
        checkMine(r-1, c+1);    //top right

        //left and right
        checkMine(r, c-1);      //left
        checkMine(r, c+1);      //right

        //bottom 3
        checkMine(r+1, c-1);    //bottom left
        checkMine(r+1, c);      //bottom
        checkMine(r+1, c+1);    //bottom right
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
        gameFinished(true);
    }

}
function gameFinished(win) {
    const restartButton = document.getElementById("restartButton");
    restartButton.style.display = "flex";
    const menuButton = document.getElementById("menuButton");
    menuButton.style.display = "flex";
    showRestartModal();
    restartButton.addEventListener('click', function() {
        document.getElementById('restartModal').style.display = 'none';
        location.reload();
        setDifficulty(level);
    });
    menuButton.addEventListener('click', function() {
        document.getElementById('restartModal').style.display = 'none';
        window.location.href = "index.html";
    });
    if(win){
        const won = document.getElementById("win");
        won.style.display = "flex";
    }
    else{
        const lost = document.getElementById("lose");
        lost.style.display = "flex";
    }
    console.log("Game Over");
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}

document.addEventListener('DOMContentLoaded', () => {
    // Get modal element and blur effect

document.addEventListener('DOMContentLoaded', () => {
    // Get modal element and blur effect
    const modal = document.getElementById('rules-modal');
    const body = document.body;
    const body = document.body;
    const howToPlayBtn = document.getElementById('how-to-play-btn');
    const closeModalBtn = document.querySelector('.close');

    // Function to open modal
    function openModal() {
        modal.style.display = 'flex'; // Show the modal
        body.classList.add('blur'); // Add blur effect
        document.body.scrollTop = 0; // Reset scroll position
        document.documentElement.scrollTop = 0; // Reset scroll position
    }

    // Function to close modal
    function closeModal() {
        modal.style.display = 'none'; // Hide the modal
        body.classList.remove('blur'); // Remove blur effect
    }

    // Show modal when button is clicked
    howToPlayBtn.addEventListener('click', openModal);

    // Hide modal when close button is clicked
    closeModalBtn.addEventListener('click', closeModal);

    // Hide modal if clicking outside of modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });});
    // JavaScript for Contact Us modal

// JavaScript for Contact Us modal

// Function to show the contact modal
function openContactModal() {
    document.getElementById('contact-modal').style.display = 'flex'; // Show the modal
    document.body.classList.add('blur'); // Add blur effect
}

// Function to close the contact modal
function closeContactModal() {
    document.getElementById('contact-modal').style.display = 'none'; // Hide the modal
    document.body.classList.remove('blur'); // Remove blur effect
}

// Event listener for "Contact Us" button
document.getElementById('contact-us-btn').addEventListener('click', openContactModal);

// Event listener for close button in the modal
document.querySelector('#contact-modal .close').addEventListener('click', closeContactModal);

// Event listener for clicking outside the modal content to close the modal
window.addEventListener('click', (event) => {
    const modal = document.getElementById('contact-modal');
    if (event.target === modal) {
        closeContactModal();
    }
});