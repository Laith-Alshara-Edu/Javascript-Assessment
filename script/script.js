const game = document.getElementById("game");

const paddle1 = document.getElementById("paddle1");
const paddle2 = document.getElementById("paddle2");
const ball = document.getElementById("ball");

const score1Display = document.getElementById("player1Score");
const score2Display = document.getElementById("player2Score");

const restartButton = document.getElementById("restart");

// Game settings
const gameWidth = 700;
const gameHeight = 400;

let score1 = 0;
let score2 = 0;

let paddle1Y = 160;
let paddle2Y = 160;

let ballX = 343;
let ballY = 193;

// Level settings
let currentLevel = 1;
let highestLevelUnlocked = 1;
let gameOver = false;

const levels = {
    1: 3,
    2: 5,
    3: 7
};

let ballSpeedX = levels[currentLevel];
let ballSpeedY = levels[currentLevel] * 0.75;

const paddleSpeed = 6;

// Keyboard controls
let keys = {};

document.addEventListener("keydown", function(e) {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", function(e) {
    keys[e.key.toLowerCase()] = false;
});

// Select difficulty level
function setLevel(level) {

    // Prevent selecting locked levels
    if (level > highestLevelUnlocked || gameOver) return;

    currentLevel = level;

    ballSpeedX = levels[level];
    ballSpeedY = levels[level] * 0.75;

    // Update level buttons
    document.querySelectorAll("#levelSelector button")
        .forEach((button, index) => {

            button.disabled = index + 1 > highestLevelUnlocked;

            button.classList.toggle(
                "active",
                index + 1 === currentLevel
            );
        });

    resetBall();
}

// Check level progression
function checkLevelProgress() {

    if (score1 < 10 && score2 < 10) return;

    if (currentLevel < 3) {

        const nextLevel = currentLevel + 1;

        // Unlock the next level
        highestLevelUnlocked = Math.max(
            highestLevelUnlocked,
            nextLevel
        );

        // Reset scores
        score1 = 0;
        score2 = 0;

        score1Display.textContent = 0;
        score2Display.textContent = 0;

        // Automatically select the next level
        setLevel(nextLevel);

        alert("Level " + nextLevel + " unlocked!");

    } else {

        // Finish the game
        gameOver = true;

        const winner = score1 >= 10 ? "Player 1" : "Player 2";

        alert(winner + " wins the game!");
    }
}

// Move paddles
function movePaddles() {

    // Player 1: W and S
    if (keys["w"] && paddle1Y > 0) {
        paddle1Y -= paddleSpeed;
    }

    if (keys["s"] && paddle1Y < 320) {
        paddle1Y += paddleSpeed;
    }

    // Player 2: Arrow Up and Arrow Down
    if (keys["arrowup"] && paddle2Y > 0) {
        paddle2Y -= paddleSpeed;
    }

    if (keys["arrowdown"] && paddle2Y < 320) {
        paddle2Y += paddleSpeed;
    }

    paddle1.style.top = paddle1Y + "px";
    paddle2.style.top = paddle2Y + "px";
}

// Move ball
function moveBall() {

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce off top and bottom
    if (ballY <= 0 || ballY >= gameHeight - 14) {
        ballSpeedY *= -1;
    }

    // Player 1 paddle collision
    if (
        ballX <= 27 &&
        ballSpeedX < 0 &&
        ballY + 14 >= paddle1Y &&
        ballY <= paddle1Y + 80
    ) {
        ballSpeedX = Math.abs(ballSpeedX);
    }

    // Player 2 paddle collision
    if (
        ballX + 14 >= gameWidth - 27 &&
        ballSpeedX > 0 &&
        ballY + 14 >= paddle2Y &&
        ballY <= paddle2Y + 80
    ) {
        ballSpeedX = -Math.abs(ballSpeedX);
    }

    // Player 2 scores
    if (ballX <= 0) {

        score2++;
        score2Display.textContent = score2;

        checkLevelProgress();

        if (!gameOver) resetBall();

        return;
    }

    // Player 1 scores
    if (ballX >= gameWidth) {

        score1++;
        score1Display.textContent = score1;

        checkLevelProgress();

        if (!gameOver) resetBall();

        return;
    }

    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
}

// Reset ball
function resetBall() {

    ballX = 343;
    ballY = 193;

    ballSpeedX = levels[currentLevel] *
        (Math.random() > 0.5 ? 1 : -1);

    ballSpeedY = levels[currentLevel] * 0.75 *
        (Math.random() > 0.5 ? 1 : -1);

    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
}

// Game loop
function gameLoop() {

    if (!gameOver) {
        movePaddles();
        moveBall();
    }

    requestAnimationFrame(gameLoop);
}

// Restart game
function restartGame() {

    score1 = 0;
    score2 = 0;

    score1Display.textContent = 0;
    score2Display.textContent = 0;

    paddle1Y = 160;
    paddle2Y = 160;

    paddle1.style.top = paddle1Y + "px";
    paddle2.style.top = paddle2Y + "px";

    gameOver = false;

    // Reset unlocked levels
    highestLevelUnlocked = 1;

    setLevel(1);
}

restartButton.addEventListener("click", restartGame);

// Select level 1 by default
setLevel(1);

// Start game
gameLoop();
