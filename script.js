/**
 * Valentine Proposal Page
 * Handles runaway No button, Yes celebration (confetti, rockets, glitters).
 */

/* ==========================================================================
   Constants
   ========================================================================== */

const RUN_AWAY_RADIUS = 120;
const COLORS = [
  "#ff6b6b",
  "#ffd93d",
  "#6bcb77",
  "#4d96ff",
  "#ff85a2",
  "#a855f7",
  "#22d3ee",
  "#fbbf24",
];
const ROCKETS = ["🚀", "✨", "💫", "🌟", "🎆", "🎇"];

/* ==========================================================================
   DOM References
   ========================================================================== */

const btnNo = document.getElementById("btnNo");
const btnYes = document.getElementById("btnYes");
const btnWrapper = document.querySelector(".btn-wrapper");
const mainContainer = document.getElementById("mainContainer");
const celebration = document.getElementById("celebration");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/* ==========================================================================
   Runaway No Button
   ========================================================================== */

function moveNoButton(e) {
  const rect = btnNo.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

  if (dist >= RUN_AWAY_RADIUS) return;

  const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
  const move = RUN_AWAY_RADIUS - dist + 40;
  let newX =
    parseFloat(btnNo.style.left) ||
    btnWrapper.offsetWidth / 2 - rect.width / 2;
  let newY =
    parseFloat(btnNo.style.top) ||
    btnWrapper.offsetHeight / 2 - rect.height / 2;
  newX += Math.cos(angle) * move;
  newY += Math.sin(angle) * move;

  const maxX = btnWrapper.offsetWidth - rect.width - 8;
  const maxY = btnWrapper.offsetHeight - rect.height - 8;

  btnNo.style.transform = "none";
  btnNo.style.left = Math.max(8, Math.min(maxX, newX)) + "px";
  btnNo.style.top = Math.max(8, Math.min(maxY, newY)) + "px";
}

function handleNoClick(e) {
  e.preventDefault();
  const rect = btnNo.getBoundingClientRect();
  btnNo.style.transform = "none";
  btnNo.style.left =
    8 + Math.random() * (btnWrapper.offsetWidth - rect.width - 16) + "px";
  btnNo.style.top =
    8 +
    Math.random() * (btnWrapper.offsetHeight - rect.height - 16) +
    "px";
}

/* ==========================================================================
   Celebration Effects
   ========================================================================== */

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function runConfetti() {
  const particles = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: canvas.height,
    size: Math.random() * 8 + 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    speed: Math.random() * 3 + 2,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.2,
  }));

  let start = null;

  function animate(ts) {
    if (!start) start = ts;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.y -= p.speed;
      p.x += Math.sin(p.angle) * 1.5;
      p.angle += p.spin;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    if (ts - start < 8000) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

function runRockets() {
  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "rocket";
      el.textContent = ROCKETS[i % ROCKETS.length];
      el.style.left = Math.random() * 100 + "%";
      el.style.animationDuration = 3 + Math.random() * 2 + "s";
      celebration.appendChild(el);
      setTimeout(() => el.remove(), 6000);
    }, i * 200);
  }
}

function runGlitters() {
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "particle";
      const size = 4 + Math.random() * 12;
      el.style.width = el.style.height = size + "px";
      el.style.background =
        COLORS[Math.floor(Math.random() * COLORS.length)];
      el.style.left = Math.random() * 100 + "%";
      el.style.top = "100%";
      el.style.animationDuration = 4 + Math.random() * 4 + "s";
      el.style.animationDelay = Math.random() * 2 + "s";
      celebration.appendChild(el);
      setTimeout(() => el.remove(), 10000);
    }, i * 80);
  }
}

function startCelebration() {
  mainContainer.classList.add("hidden");
  celebration.classList.add("active");
  resizeCanvas();
  runConfetti();
  runRockets();
  runGlitters();
}

/* ==========================================================================
   Event Bindings
   ========================================================================== */

function init() {
  document.addEventListener("mousemove", moveNoButton);

  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length) moveNoButton(e.touches[0]);
    },
    { passive: true }
  );

  btnNo.addEventListener("click", handleNoClick);
  btnYes.addEventListener("click", startCelebration);
  window.addEventListener("resize", resizeCanvas);
}

init();
