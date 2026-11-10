
const game = document.getElementById("game");
const dino = document.getElementById("dino");

let isJumping = false;
let jumpHeight = 0;
let velocity = 0;

const gravity = 0.6;
const jumpStrength = 12;

let obstacles = [];
let obstacleTimer = 0;
let nextObstacleTime = 100;

const obstacleSpeed = 4;

let gameOver = false;

// Create game-over message
const gameOverText = document.createElement("div");
gameOverText.textContent = "GAME OVER - Press SPACE to restart";
gameOverText.style.position = "absolute";
gameOverText.style.top = "40%";
gameOverText.style.width = "100%";
gameOverText.style.textAlign = "center";
gameOverText.style.font = "bold 20px Arial";
gameOverText.style.color = "red";
gameOverText.style.display = "none";
gameOverText.style.zIndex = "10";
game.appendChild(gameOverText);

// Jump and restart controls
document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault();

        if (gameOver) {
            restartGame();
            return;
        }

        if (!isJumping) {
            isJumping = true;
            velocity = jumpStrength;
        }
    }
});

function createObstacle() {
    const cactus = document.createElement("div");
    cactus.classList.add("cactus");
    game.appendChild(cactus);

    obstacles.push({
        element: cactus,
        x: game.clientWidth
    });
}

function checkCollision(dinoRect, cactusRect) {
    return (
        dinoRect.left < cactusRect.right &&
        dinoRect.right > cactusRect.left &&
        dinoRect.top < cactusRect.bottom &&
        dinoRect.bottom > cactusRect.top
    );
}

function restartGame() {
    obstacles.forEach(obstacle => obstacle.element.remove());
    obstacles = [];

    jumpHeight = 0;
    velocity = 0;
    isJumping = false;

    obstacleTimer = 0;
    nextObstacleTime = 100;
    gameOver = false;

    dino.style.bottom = "20px";
    gameOverText.style.display = "none";
}

function endGame() {
    gameOver = true;
    gameOverText.style.display = "block";
}

function gameLoop() {
    if (!gameOver) {
        // Update jumping
        if (isJumping) {
            jumpHeight += velocity;
            velocity -= gravity;

            if (jumpHeight <= 0) {
                jumpHeight = 0;
                velocity = 0;
                isJumping = false;
            }

            dino.style.bottom = (20 + jumpHeight) + "px";
        }

        // Spawn obstacles
        obstacleTimer++;

        if (obstacleTimer >= nextObstacleTime) {
            createObstacle();
            obstacleTimer = 0;
            nextObstacleTime = 70 + Math.random() * 70;
        }

        // Move obstacles and check collisions
        const dinoRect = dino.getBoundingClientRect();

        for (let i = obstacles.length - 1; i >= 0; i--) {
            const obstacle = obstacles[i];

            obstacle.x -= obstacleSpeed;
            obstacle.element.style.left = obstacle.x + "px";

            const cactusRect = obstacle.element.getBoundingClientRect();

            if (checkCollision(dinoRect, cactusRect)) {
                endGame();
                break;
            }

            if (obstacle.x < -20) {
                obstacle.element.remove();
                obstacles.splice(i, 1);
            }
        }
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
