const game = document.getElementById("game");
const dino = document.getElementById("dino");
const ground = document.getElementById("ground");

let isJumping = false;
let jumpHeight = 0;
let velocity = 0;

const gravity = 0.6;
const jumpStrength = 12;

document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault();

        if (!isJumping) {
            isJumping = true;
            velocity = jumpStrength;
        }
    }
});

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

    requestAnimationFrame(gameLoop);
}

gameLoop();