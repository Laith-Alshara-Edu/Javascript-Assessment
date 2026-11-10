const jumpSound = new Audio("audio/jump.wav");
jumpSound.preload = "auto";
jumpSound.volume = 0.5;
jumpSound.load();

const game = document.getElementById("game");
const dino = document.getElementById("dino");

// Jump settings
let isJumping = false;
let jumpHeight = 0;
let velocity = 0;

const gravity = 0.6;
const jumpStrength = 12;

// Obstacle settings
let obstacles = [];
let obstacleTimer = 0;
let nextObstacleTime = 100;

let obstacleSpeed = 4;
let currentLevel = 1;

let gameOver = false;

// Game over message
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


// LEVEL SELECTOR
function setLevel(level) {

    currentLevel = level;

    if (level === 1) {
        obstacleSpeed = 4;
        nextObstacleTime = 70 + Math.random() * 70;
    }

    else if (level === 2) {
        obstacleSpeed = 6;
        nextObstacleTime = 55 + Math.random() * 55;
    }

    else if (level === 3) {
        obstacleSpeed = 10;
        nextObstacleTime = 35 + Math.random() * 40;
    }

    // Highlight selected button
    document.querySelectorAll("#level-buttons button").forEach(button => {
        button.classList.remove("active");
    });

    document.getElementById("level" + level).classList.add("active");
}


// Level button controls
document.getElementById("level1").addEventListener("click", function() {
    setLevel(1);
    this.blur();
});

document.getElementById("level2").addEventListener("click", function() {
    setLevel(2);
    this.blur();
});

document.getElementById("level3").addEventListener("click", function() {
    setLevel(3);
    this.blur();
});


// Start at Level 1
setLevel(1);


// JUMP AND RESTART CONTROLS
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

            // Play jump sound immediately
            jumpSound.currentTime = 0;
            jumpSound.play().catch(error => {
                console.log("Could not play jump sound:", error);
            });
        }
    }
});


// CREATE CACTUS
function createObstacle() {

    const cactus = document.createElement("div");

    cactus.classList.add("cactus");

    game.appendChild(cactus);

    obstacles.push({
        element: cactus,
        x: game.clientWidth
    });
}


// COLLISION DETECTION
function checkCollision(dinoRect, cactusRect) {

    return (
        dinoRect.left < cactusRect.right &&
        dinoRect.right > cactusRect.left &&
        dinoRect.top < cactusRect.bottom &&
        dinoRect.bottom > cactusRect.top
    );
}


// RESTART GAME
function restartGame() {

    obstacles.forEach(obstacle => {
        obstacle.element.remove();
    });

    obstacles = [];

    jumpHeight = 0;
    velocity = 0;
    isJumping = false;

    obstacleTimer = 0;

    gameOver = false;

    dino.style.bottom = "20px";

    gameOverText.style.display = "none";

    setLevel(currentLevel);
}


// END GAME
function endGame() {

    gameOver = true;

    gameOverText.style.display = "block";
}


// MAIN GAME LOOP
function gameLoop() {

    if (!gameOver) {

        // UPDATE JUMPING
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


        // SPAWN OBSTACLES
        obstacleTimer++;

        if (obstacleTimer >= nextObstacleTime) {

            createObstacle();

            obstacleTimer = 0;

            // Set next spawn delay based on current level
            if (currentLevel === 1) {
                nextObstacleTime = 70 + Math.random() * 70;
            }

            else if (currentLevel === 2) {
                nextObstacleTime = 55 + Math.random() * 55;
            }

            else if (currentLevel === 3) {
                nextObstacleTime = 35 + Math.random() * 40;
            }
        }


        // MOVE OBSTACLES AND CHECK COLLISIONS
        const dinoRect = dino.getBoundingClientRect();

        for (let i = obstacles.length - 1; i >= 0; i--) {

            const obstacle = obstacles[i];

            obstacle.x -= obstacleSpeed;

            obstacle.element.style.left = obstacle.x + "px";

            const cactusRect = obstacle.element.getBoundingClientRect();

            // Check collision
            if (checkCollision(dinoRect, cactusRect)) {

                endGame();
                break;
            }

            // Remove cactus when it leaves the screen
            if (obstacle.x < -20) {

                obstacle.element.remove();

                obstacles.splice(i, 1);
            }
        }
    }

    requestAnimationFrame(gameLoop);
}


// START GAME
gameLoop();