// ===========================
// Keyboard Controls
// ===========================
// Set movement flags based on left/right arrow keys
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") keyLeft = true;
    if (e.key === "ArrowRight") keyRight = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") keyLeft = false;
    if (e.key === "ArrowRight") keyRight = false;
});

// ===========================
// Touch Controls
// ===========================
// Rotate paddle based on touch position (drag)
canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    paddleAngle = getAngleFromTouch(touchX, touchY);
}, { passive: false });

// Also update on initial touch
canvas.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    paddleAngle = getAngleFromTouch(touchX, touchY);
});

// ===========================
// Utility: Get CSS Variable Color
// ===========================
function getCSSColor(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

// ===========================
// Load and Display Highscore
// ===========================
function updateHighscoreDisplay() {
    fetch('/highscores')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("highscoreList");
            if (data.length > 0) {
                container.innerHTML = "<h3>Highscore</h3><p>" + data[0].score + " </p>";
            } else {
                container.innerHTML = "<p>No highscore yet.</p>";
            }
        });
}

// ===========================
// Game Logic Update
// ===========================
function update(delta) {
    if (isGameOver) return;

    // Paddle movement (circular rotation)
    if (keyLeft) paddleAngle = (paddleAngle - 180 * delta + 360) % 360;
    if (keyRight) paddleAngle = (paddleAngle + 180 * delta) % 360;

    // Update ball position
    ballX += dx * delta;
    ballY += dy * delta;

    // Distance from center
    const distX = ballX - centerX;
    const distY = ballY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    // Collision with arena boundary
    if (distance >= arenaRadius - 5) {
        const angleDeg = (Math.atan2(distY, distX) * 180 / Math.PI + 360) % 360;
        const paddleStart = (paddleAngle - paddleWidth / 2 + 360) % 360;
        const paddleEnd = (paddleAngle + paddleWidth / 2 + 360) % 360;

        // Check if ball hits the paddle
        let hit = false;
        if (paddleStart < paddleEnd) {
            hit = angleDeg >= paddleStart && angleDeg <= paddleEnd;
        } else {
            hit = angleDeg >= paddleStart || angleDeg <= paddleEnd;
        }

        if (hit) {
            // Successful hit: reflect and increase speed
            hitCounter++;
            const normAngle = Math.atan2(distY, distX);
            const angleToPaddle = (normAngle * 180 / Math.PI + 360) % 360;
            const paddleCenter = (paddleAngle + 360) % 360;

            let delta = angleToPaddle - paddleCenter;
            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;

            const maxDeflection = 30;
            const deflection = (delta / (paddleWidth / 2)) * maxDeflection;
            const newAngle = normAngle + Math.PI + (deflection * Math.PI / 180);

            ballSpeed = Math.min(ballSpeed * 1.15, 600);
            dx = Math.cos(newAngle) * ballSpeed;
            dy = Math.sin(newAngle) * ballSpeed;
        } else {
            // Missed paddle = Game Over
            isGameOver = true;

            setTimeout(() => {
                fetch('/submit-score', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ score: hitCounter })
                }).then(() => updateHighscoreDisplay());
            }, 300);
        }
    }
}

// ===========================
// Game Rendering
// ===========================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw arena circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, arenaRadius, 0, Math.PI * 2);
    ctx.strokeStyle = getCSSColor("--arena-color");
    ctx.lineWidth = 5;
    ctx.stroke();

    // Draw paddle arc
    ctx.beginPath();
    const start = ((paddleAngle - paddleWidth / 2) * Math.PI) / 180;
    const end = ((paddleAngle + paddleWidth / 2) * Math.PI) / 180;
    ctx.arc(centerX, centerY, arenaRadius, start, end);
    ctx.strokeStyle = getCSSColor("--paddle-color");
    ctx.lineWidth = 12;
    ctx.stroke();

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
    ctx.fillStyle = getCSSColor("--ball-color");
    ctx.fill();

    // Draw score
    ctx.fillStyle = getCSSColor("--score-color");
    ctx.font = "bold 96px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(hitCounter, centerX, centerY);

    // Show Game Over text
    if (isGameOver) {
        ctx.fillStyle = getCSSColor("--gameover-color");
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", centerX, centerY);
    }
}

// ===========================
// Game Loop
// ===========================
function gameLoop(timestamp = performance.now()) {
    const delta = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    if (isRunning) {
        update(delta);
        draw();
    } else if (isGameOver) {
        draw();
    }

    updateButtonLabel();
    requestAnimationFrame(gameLoop);
}

// ===========================
// Main Button + Init
// ===========================
const mainBtn = document.getElementById("mainBtn");

mainBtn.addEventListener("click", () => {
    if (!isRunning || isGameOver) {
        resetGame();
        isRunning = true;
    } else {
        isRunning = false;
    }
    updateButtonLabel();
});

// Open game modal on start
document.getElementById("openBtn").addEventListener("click", openModal);

// Initialize game state
resetGame();
gameLoop();
updateHighscoreDisplay();
