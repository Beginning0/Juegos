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
    player = new Player();
    enemies = createEnemies();
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

    checkCollisions();
    requestAnimationFrame(gameLoop);
}

function endGame() {
    document.getElementById('final-score').textContent = `Score: ${score}`;
    document.getElementById('game-over-screen').style.display = 'flex';
    saveScore(playerName, score);
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
    }

    update() {
        this.y += this.speed;
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
            pla
