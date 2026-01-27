const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");

canvas.width = 800;
canvas.height = 400;

// Image of player
const playerImg = new Image();
playerImg.src = 'img/game/puck_game.png';

let playerImgLoaded = false;
playerImg.onload = () => {
    playerImgLoaded = true;
};

// Game status
let score = 0;
let level = 1;
const player = {
    x: 60,
    y: canvas.height / 2,
    size: 40,
    speed: 5
};

let enemies = [];

function createEnemies() {
    enemies = [];
    const count = 4 + level;
    for (let i = 0; i < count; i++) {
        enemies.push({
            x: 200 + Math.random() * (canvas.width - 300),
            y: Math.random() * canvas.height,
            radius: 15,
            dy: (Math.random() - 0.7) * (4 + level)
        });
    }
}

const keys = {};
window.addEventListener("keydown", e => keys[e.code] = true);
window.addEventListener("keyup", e => keys[e.code] = false);

function update() {
    // Movement
    if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
    if (keys["ArrowDown"] && player.y < canvas.height - player.size) player.y += player.speed;
    if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
    if (keys["ArrowRight"] && player.x < canvas.width - player.size) player.x += player.speed;

    // Opponents
    enemies.forEach(enemy => {
        enemy.y += enemy.dy;
        if (enemy.y < 0 || enemy.y > canvas.height) enemy.dy *= -1;

        // Collision (center of image vs ball)
        const pCenterX = player.x + player.size / 2;
        const pCenterY = player.y + player.size / 2;
        const dist = Math.hypot(pCenterX - enemy.x, pCenterY - enemy.y);
        
        if (dist < (player.size / 2) + enemy.radius) {
            resetGame();
        }
    });

    // Goal
    if (player.x + player.size > canvas.width - 20 && 
        player.y + player.size > canvas.height / 3 && 
        player.y < (canvas.height / 3) * 2) {
        score++;
        if (score % 2 === 0) level++;
        scoreElement.innerText = `Skóre: ${score}`;
        levelElement.innerText = `Level: ${level}`;
        player.x = 60;
        player.y = canvas.height / 2;
        createEnemies();
    }
}

function resetGame() {
    score = 0;
    level = 1;
    scoreElement.innerText = `Skóre: ${score}`;
    levelElement.innerText = `Level: ${level}`;
    player.x = 60;
    player.y = canvas.height / 2;
    createEnemies();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ice lines
    ctx.strokeStyle = "rgba(255, 0, 0, 0.2)";
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Net/Cage
    ctx.fillStyle = "#2ecc71";
    ctx.fillRect(canvas.width - 15, canvas.height / 3, 15, canvas.height / 3);

    // Player (image or dot)
    if (playerImgLoaded) {
        ctx.drawImage(playerImg, player.x, player.y, player.size, player.size);
    } else {
        ctx.fillStyle = "blue";
        ctx.fillRect(player.x, player.y, player.size, player.size);
    }

    // Opponents visual
    enemies.forEach(enemy => {
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#c0392b";
        ctx.fill();
        ctx.closePath();
    });

    update();
    requestAnimationFrame(draw);
}

createEnemies();
draw();