const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let playerName = '';
let score = 0;
let gameOver = false;
let player;
let enemies = [];

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
    player = new Player(); // Crear la nave del jugador
    enemies = createEnemies(); // Crear enemigos
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (gameOver) return endGame();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    player.update();
    player.draw();

    enemies.forEach(enemy => {
        enemy.update();
        enemy.draw();
    });

    // Verifica colisiones, incrementa la puntuación, etc.
    checkCollisions();

    requestAnimationFrame(gameLoop);
}

function endGame() {
    document.getElementById('final-score').textContent = `Score: ${score}`;
    document.getElementById('game-over-screen').style.display = 'flex';
    saveScore(playerName, score);
}

// Crear una clase para el jugador
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

// Crear enemigos de forma similar al jugador
function createEnemies() {
    let enemies = [];
    for (let i = 0; i < 5; i++) {
        enemies.push(new Enemy(i * 100 + 50, 50));
    }
    return enemies;
}

class Enemy {
    constructor(x, y) {
        this.width = 50;
        this.height = 50;
        this.x = x;
        this.y = y;
        this.speed = 2;
        this.color = 'red';
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = -this.height;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Manejo de las teclas presionadas
let keys = {};
window.addEventListener('keydown', function (e) {
    keys[e.key] = true;
});
window.addEventListener('keyup', function (e) {
    keys[e.key] = false;
});

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

