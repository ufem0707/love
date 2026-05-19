const agree = document.getElementById("agree");
const disagree = document.getElementById("disagree");
const modal = document.getElementById("modal");
const congrats = document.getElementById("congrats");
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

function rectsOverlap(r1, r2, gap = 14) {
  return !(
    r1.right + gap < r2.left ||
    r1.left - gap > r2.right ||
    r1.bottom + gap < r2.top ||
    r1.top - gap > r2.bottom
  );
}

function getTempRect(x, y, width, height) {
  return {
    left: x,
    top: y,
    right: x + width,
    bottom: y + height
  };
}

function moveDisagreeButton() {
  disagree.classList.add("floating");

  const padding = 16;
  const width = disagree.offsetWidth;
  const height = disagree.offsetHeight;
  const agreeRect = agree.getBoundingClientRect();

  let x = padding;
  let y = padding;

  for (let i = 0; i < 80; i++) {
    x = Math.random() * (window.innerWidth - width - padding * 2) + padding;
    y = Math.random() * (window.innerHeight - height - padding * 2) + padding;

    const newRect = getTempRect(x, y, width, height);
    if (!rectsOverlap(newRect, agreeRect)) break;
  }

  disagree.style.left = `${x}px`;
  disagree.style.top = `${y}px`;
}

["click", "touchstart"].forEach((eventName) => {
  disagree.addEventListener(eventName, (e) => {
    e.preventDefault();
    moveDisagreeButton();
  }, { passive: false });
});

agree.addEventListener("click", () => {
  modal.style.display = "none";
  congrats.classList.remove("hidden");
  startFireworks();
});

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let particles = [];

function createFirework() {
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight * 0.55 + 40;
  const colors = ["#ff5f9e", "#ffd166", "#06d6a0", "#4cc9f0", "#ffffff"];

  for (let i = 0; i < 45; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1.5;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 70,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function animateFireworks() {
  ctx.fillStyle = "rgba(17, 17, 17, 0.18)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  particles = particles.filter((p) => p.life > 0);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.035;
    p.life--;

    ctx.globalAlpha = p.life / 70;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  requestAnimationFrame(animateFireworks);
}

function startFireworks() {
  resizeCanvas();
  createFirework();
  setInterval(createFirework, 700);
  animateFireworks();
}
