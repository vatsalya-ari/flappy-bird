const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Fullscreen canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Load images
const birdImg = new Image();
birdImg.src = "assets/bird.jpg";

const pipeImg = new Image();
pipeImg.src = "assets/pipe.jpg";

const bgImg = new Image();
bgImg.src = "assets/background.jpg";

let bird = {
    x: 100,
    y: 200,
    width: 60,
    height: 60,
    gravity: 0.4,
    velocity: 0
};

let pipes = [];
let frame = 0;
let votes = 0;

function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    frame = 0;
    votes = 0;
}

function spawnPipe() {
    let topHeight = Math.random() * (canvas.height * 0.4) + 80;
    let gap = 200;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + gap,
        width: 80,
        passed: false
    });
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y < 0 || bird.y + bird.height > canvas.height) {
        resetGame();
    }
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= 3;

        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
        ) {
            resetGame();
        }

        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            pipe.passed = true;
            votes++;
        }
    });

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function drawBackground() {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(pipeImg, pipe.x, 0, pipe.width, pipe.top);
        ctx.drawImage(
            pipeImg,
            pipe.x,
            pipe.bottom,
            pipe.width,
            canvas.height - pipe.bottom
        );
    });
}

function drawVotes() {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Votes: " + votes, 20, 40);
}

function gameLoop() {
    drawBackground();

    frame++;
    if (frame % 120 === 0) spawnPipe();

    updateBird();
    updatePipes();
    drawBird();
    drawPipes();
    drawVotes();

    requestAnimationFrame(gameLoop);
}

window.addEventListener("mousedown", () => (bird.velocity = -7));
window.addEventListener("keydown", () => (bird.velocity = -7));

gameLoop();
