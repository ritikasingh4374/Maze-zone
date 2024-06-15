// script.js

const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const timerElement = document.getElementById('timer');
const cellSize = 30;
const rows = canvas.width / cellSize;
const cols = canvas.height / cellSize;

let maze = [];
let player = { x: 0, y: 0 };
let key = { x: rows - 1, y: cols - 1 };
let timeLeft = 60;
let gameInterval;
let timerInterval;

function initGame() {
    maze = generateMaze(rows, cols);
    player = { x: 0, y: 0 };
    key = { x: rows - 1, y: cols - 1 };
    timeLeft = 60;
    drawMaze();
    drawPlayer();
    drawKey();
    startTimer();
}

function generateMaze(rows, cols) {
    // Generate a simple maze using Depth-First Search (DFS) algorithm
    // This is a basic implementation; you can use more sophisticated algorithms for complex mazes
    let maze = Array.from({ length: rows }, () => Array(cols).fill(0));

    function carvePassages(cx, cy) {
        const directions = [
            [0, -1], [1, 0], [0, 1], [-1, 0]
        ];
        shuffle(directions);
        directions.forEach(([dx, dy]) => {
            const nx = cx + dx;
            const ny = cy + dy;
            if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && maze[nx][ny] === 0) {
                maze[cx][cy] |= directionToBit(dx, dy);
                maze[nx][ny] |= directionToBit(-dx, -dy);
                carvePassages(nx, ny);
            }
        });
    }

    carvePassages(0, 0);
    return maze;
}

function directionToBit(dx, dy) {
    if (dx === 1 && dy === 0) return 1; // right
    if (dx === -1 && dy === 0) return 2; // left
    if (dx === 0 && dy === 1) return 4; // down
    if (dx === 0 && dy === -1) return 8; // up
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            const cell = maze[x][y];
            if (!(cell & 1)) drawLine(x + 1, y, x + 1, y + 1); // right
            if (!(cell & 2)) drawLine(x, y, x, y + 1); // left
            if (!(cell & 4)) drawLine(x, y + 1, x + 1, y + 1); // down
            if (!(cell & 8)) drawLine(x, y, x + 1, y); // up
        }
    }
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1 * cellSize, y1 * cellSize);
    ctx.lineTo(x2 * cellSize, y2 * cellSize);
    ctx.stroke();
}

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x * cellSize + 2, player.y * cellSize + 2, cellSize - 4, cellSize - 4);
}

function drawKey() {
    ctx.fillStyle = 'gold';
    ctx.fillRect(key.x * cellSize + 2, key.y * cellSize + 2, cellSize - 4, cellSize - 4);
}

function startTimer() {
    timerElement.textContent = `Time left: ${timeLeft}s`;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            clearInterval(gameInterval);
            alert('Time\'s up! You lost.');
        }
    }, 1000);
}

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;
    if (newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
        const currentCell = maze[player.x][player.y];
        const newCell = maze[newX][newY];
        if ((dx === 1 && (currentCell & 1)) || (dx === -1 && (currentCell & 2)) || (dy === 1 && (currentCell & 4)) || (dy === -1 && (currentCell & 8))) {
            player.x = newX;
            player.y = newY;
            drawMaze();
            drawPlayer();
            drawKey();
            if (player.x === key.x && player.y === key.y) {
                clearInterval(timerInterval);
                alert('Congratulations! You found the key.');
            }
        }
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') movePlayer(0, -1);
    if (e.key === 'ArrowDown') movePlayer(0, 1);
    if (e.key === 'ArrowLeft') movePlayer(-1, 0);
    if (e.key === 'ArrowRight') movePlayer(1, 0);
});

initGame();
