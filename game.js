const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let playerName = '';
let score = 0;
let gameOver = false;

document.getElementById('start-button').addEventListener('click', () => {
    playerName = document.getElementById('player-name').value;
    if (playerName) {
        document.getElementById('start-screen').style.display = 'none';
        startGame();
    }
});

function startGame() {
    score = 0;
    gameOver = false;
    // Lógica del juego aquí
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (gameOver) return endGame();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Dibujar jugador, enemigos y manejar colisiones
    // Aumentar puntuación, etc.
    requestAnimationFrame(gameLoop);
}

function endGame() {
    document.getElementById('final-score').textContent = `Score: ${score}`;
    document.getElementById('game-over-screen').style.display = 'flex';
    saveScore(playerName, score);
}

document.getElementById('restart-button').addEventListener('click', () => {
    document.getElementById('game-over-screen').style.display = 'none';
    startGame();
});

// Aquí incluirás funciones para manejar el movimiento de la nave, disparos, enemigos, etc.
