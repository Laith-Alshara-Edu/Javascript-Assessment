
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

document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault();

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

function gameLoop() {
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

    obstacleTimer++;

    if (obstacleTimer >= nextObstacleTime) {
        createObstacle();
        obstacleTimer = 0;

        nextObstacleTime = 70 + Math.random() * 70;
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];

        obstacle.x -= obstacleSpeed;
        obstacle.element.style.left = obstacle.x + "px";

        if (obstacle.x < -20) {
            obstacle.element.remove();
            obstacles.splice(i, 1);
        }
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
