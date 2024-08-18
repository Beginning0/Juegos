const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let playerName = '';
let score = 0;
let gameOver = false;
let player;
let enemies = [];
let isPaused = false;


window.addEventListener('keydown', function (e) {
    if (e.key === 'p' || e.key === 'P') {
        togglePause();
    }

    if (e.key === ' ') {  // Verificar si se presiona la tecla "Espacio"
        if (gameOver) {  // Solo reiniciar si el juego ha terminado
            restartGame();
        }
    }

    keys[e.key] = true;
});

window.addEventListener('keyup', function (e) {
    keys[e.key] = false;
});

function restartGame() {
    // Ocultar la pantalla de Game Over
    document.getElementById('game-over-screen').style.display = 'none';

    // Reiniciar las variables del juego
    startGame();
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        console.log("Game Paused");
    } else {
        console.log("Game Resumed");
    }
}
// Conecta la función `restartGame` al botón "Play Again"
document.getElementById('restart-button').addEventListener('click', restartGame);

document.getElementById('start-button').addEventListener('click', () => {
    playerName = document.getElementById('player-name').value;
    if (playerName) {
        document.getElementById('start-screen').style.display = 'none';
        startGame();
    }
});

// document.getElementById('restart-button').addEventListener('click', () => {
//     // Ocultar la pantalla de Game Over
//     document.getElementById('game-over-screen').style.display = 'none';

//     // Reiniciar las variables del juego
//     startGame();
// });

document.getElementById('menu-button').addEventListener('click', () => {
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
    startGame();
});

function startGame() {
    score = 0; // Reiniciar el puntaje
    gameOver = false; // Asegurarse de que el estado de game over sea falso
    player = new Player(); // Crear una nueva instancia del jugador
    enemies = createEnemies(); // Crear una nueva lista de enemigos
    requestAnimationFrame(gameLoop); // Iniciar el bucle del juego
}


function gameLoop() {
    if (gameOver) return endGame();

    if (!isPaused) {  // Solo ejecutar si no está en pausa
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        player.update();
        player.draw();

        enemies.forEach(enemy => {
            enemy.update();
            enemy.draw();
        });

        // Incrementar el puntaje
        score += 1;
        drawScore();

        checkCollisions();
    } else {
        // Mostrar mensaje de pausa
        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.fillText('PAUSED', canvas.width / 2 - 100, canvas.height / 2);
    }

    requestAnimationFrame(gameLoop);  // Continuar el loop, incluso en pausa
}


function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);

    // Mostrar los tres mejores puntajes
    const topScores = getTopScores();
    topScores.forEach((entry, index) => {
        ctx.fillText(`${index + 1}. ${entry.name}: ${entry.score}`, 10, 50 + index * 20);
    });
}


function endGame() {
    saveScore(playerName, score);
    document.getElementById('final-score').textContent = `Score: ${score}`;
    document.getElementById('game-over-screen').style.display = 'flex';
}


class Player {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 10;
        this.speed = 5;
        this.color = 'blue';
    }

    update() {
        if (keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] && this.x < canvas.width - this.width) {
            this.x += this.speed;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Enemy {
    constructor(x, y) {
        this.width = 50;
        this.height = 50;
        this.x = x;
        this.y = y;
        this.speed = 2;
        this.color = 'red';
        this.direction = 1; // Dirección para el movimiento en zigzag
    }

    update() {
        // Movimiento vertical
        this.y += this.speed;
        
        // Movimiento horizontal en zigzag
        this.x += this.direction * 2;
        if (this.x <= 0 || this.x >= canvas.width - this.width) {
            this.direction *= -1; // Cambiar dirección al chocar con los bordes
        }

        if (this.y > canvas.height) {
            this.y = -this.height;
            this.x = Math.random() * (canvas.width - this.width);
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}


function createEnemies() {
    let enemies = [];
    for (let i = 0; i < 5; i++) {
        let x = i * 100 + 50;
        let y = Math.random() * 100;
        enemies.push(new Enemy(x, y));
    }
    return enemies;
}

function checkCollisions() {
    enemies.forEach(enemy => {
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.height + player.y > enemy.y) {
            gameOver = true;
        }
    });
}

let keys = {};
window.addEventListener('keydown', function (e) {
    keys[e.key] = true;
});

window.addEventListener('keyup', function (e) {
    keys[e.key] = false;
});

