const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const playerNameInput = document.getElementById('playerName');
const startButton = document.getElementById('startButton');
const gameHistoryList = document.getElementById('gameHistory');

let snake, food, dx, dy, score, gameLoop;
let lastTouchX, lastTouchY;

startButton.addEventListener('click', startGame);

function startGame() {
    if (!playerNameInput.value) {
        alert('Por favor, ingresa tu nombre antes de jugar.');
        return;
    }

    snake = [{x: 200, y: 200}];
    food = generateFood();
    dx = 10;
    dy = 0;
    score = 0;
    updateScore();

    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(gameStep, 100);

    document.addEventListener('keydown', changeDirection);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
}

function gameStep() {
    if (checkCollision()) {
        endGame();
        return;
    }

    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        food = generateFood();
    } else {
        snake.pop();
    }

    clearCanvas();
    drawFood();
    drawSnake();
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / 10)) * 10,
        y: Math.floor(Math.random() * (canvas.height / 10)) * 10
    };
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 10, 10);
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, 10, 10));
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;

    if (keyPressed === LEFT_KEY && dx !== 10) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && dy !== 10) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && dx !== -10) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && dy !== -10) {
        dx = 0;
        dy = 10;
    }
}

function handleTouchStart(event) {
    lastTouchX = event.touches[0].clientX;
    lastTouchY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!lastTouchX || !lastTouchY) {
        return;
    }

    let touchX = event.touches[0].clientX;
    let touchY = event.touches[0].clientY;

    let deltaX = touchX - lastTouchX;
    let deltaY = touchY - lastTouchY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Movimiento horizontal
        if (deltaX > 0 && dx !== -10) {
            dx = 10;
            dy = 0;
        } else if (deltaX < 0 && dx !== 10) {
            dx = -10;
            dy = 0;
        }
    } else {
        // Movimiento vertical
        if (deltaY > 0 && dy !== -10) {
            dx = 0;
            dy = 10;
        } else if (deltaY < 0 && dy !== 10) {
            dx = 0;
            dy = -10;
        }
    }

    lastTouchX = touchX;
    lastTouchY = touchY;

    event.preventDefault();
}

function checkCollision() {
    const head = snake[0];
    return (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
}

function endGame() {
    clearInterval(gameLoop);
    saveScore();
    updateGameHistory();
    alert(`Juego terminado. Tu puntaje es: ${score}`);
}

function updateScore() {
    scoreElement.textContent = `Puntaje: ${score}`;
}

function saveScore() {
    const playerName = playerNameInput.value;
    const gameHistory = JSON.parse(localStorage.getItem('snakeGameHistory') || '[]');
    gameHistory.push({name: playerName, score: score, date: new Date().toLocaleString()});
    localStorage.setItem('snakeGameHistory', JSON.stringify(gameHistory));
}

function updateGameHistory() {
    const gameHistory = JSON.parse(localStorage.getItem('snakeGameHistory') || '[]');
    gameHistoryList.innerHTML = '';
    gameHistory.sort((a, b) => b.score - a.score).forEach(game => {
        const li = document.createElement('li');
        li.textContent = `${game.name}: ${game.score} puntos - ${game.date}`;
        gameHistoryList.appendChild(li);
    });
}

updateGameHistory();

// Ajustar el tamaño del canvas para dispositivos móviles
function resizeCanvas() {
    const containerWidth = document.querySelector('.container').offsetWidth;
    const size = Math.min(containerWidth - 20, 400); // 20px de margen
    canvas.width = size;
    canvas.height = size;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();