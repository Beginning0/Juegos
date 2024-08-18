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
        console.log("Player Name:", playerName); // Verifica que el nombre se captura
        document.getElementById('start-screen').style.display = 'none';
        startGame();
    } else {
        alert('Please enter a valid name!');
    }
});


function startGame() {
    score = 0;
    gameOver = false;
    ctx.fillStyle = 'white';
    ctx.fillRect(100, 100, 50, 50); // Dibuja un cuadrado blanco en el canvas
    requestAnimationFrame(gameLoop);
}


function gameLoop() {
    if (gameOver) return endGame();
    console.log("Game Loop Running"); // Verifica si el loop está funcionando
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Aquí debería ir el código para dibujar el juego
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
