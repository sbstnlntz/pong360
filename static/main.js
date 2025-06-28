// ===============================
// Canvas Initialization
// ===============================
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// ===============================
// Game State Variables
// ===============================
let centerX, centerY, arenaRadius;
let paddleAngle = 0;
const paddleWidth = 40;
const INITIAL_BALL_SPEED = 100;
let ballSpeed = INITIAL_BALL_SPEED;
let ballX, ballY, ballAngle, dx, dy;

let isGameOver = false;
let isRunning = false;
let hitCounter = 0;

let lastTimestamp = performance.now();
let keyLeft = false;
let keyRight = false;

// ===============================
// Resize Canvas and Recalculate Arena
// ===============================
function resizeCanvas() {
  const size = Math.min(window.innerWidth, window.innerHeight);
  canvas.width = size;
  canvas.height = size;
  centerX = size / 2;
  centerY = size / 2;
  arenaRadius = size / 2 - size * 0.05;
}

// ===============================
// Reset Game State
// ===============================
function resetGame() {
  resizeCanvas();
  ballSpeed = INITIAL_BALL_SPEED;
  hitCounter = 0;
  paddleAngle = 0;
  ballX = centerX;
  ballY = centerY;
  ballAngle = Math.random() * 2 * Math.PI;
  dx = Math.cos(ballAngle) * ballSpeed;
  dy = Math.sin(ballAngle) * ballSpeed;
  isGameOver = false;
}

// ===============================
// Convert Touch Coordinates to Angle
// ===============================
function getAngleFromTouch(x, y) {
  const dx = x - centerX;
  const dy = y - centerY;
  return (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
}

// ===============================
// Update Start/Reset Button Label
// ===============================
function updateButtonLabel() {
  mainBtn.textContent = (!isRunning || isGameOver) ? "Start" : "Reset";
}

// ===============================
// Show Game Modal
// ===============================
function openModal() {
  document.getElementById("gameModal").classList.add("show");
  isRunning = true;
  updateHighscoreDisplay(); // Trigger highscore fetch on open
}

// ===============================
// Hide Game Modal
// ===============================
function closeModal() {
  document.getElementById("gameModal").classList.remove("show");
  isRunning = false;
  isGameOver = true; // Ensures draw() displays "Game Over"
}

// ===============================
// Handle Impressum Modal
// ===============================
const impressumModal = document.getElementById("impressumModal");

document.getElementById("impressumBtn").addEventListener("click", () => {
  impressumModal.classList.add("show");
});

function closeImpressum() {
  impressumModal.classList.remove("show");
}

// Close Impressum Modal when clicking outside of it
document.addEventListener("click", function (event) {
  const modal = document.getElementById("impressumModal");
  const content = modal.querySelector(".modal-content");

  if (
    modal.classList.contains("show") &&
    !content.contains(event.target) &&
    !event.target.closest("#impressumBtn")
  ) {
    closeImpressum();
  }
});

// ===============================
// Global Escape Key Listener
// ===============================
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const gameModal = document.getElementById("gameModal");
    const impressumModal = document.getElementById("impressumModal");

    if (gameModal.classList.contains("show")) {
      closeModal();
    } else if (impressumModal.classList.contains("show")) {
      closeImpressum();
    }
  }
});
