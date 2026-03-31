// ================================================================
//  PEWPLAY GAME TEMPLATE
//  A simple "dodge the falling blocks" game to get you started.
//  Replace this with your own game logic!
//
//  Structure:
//    - Config & State
//    - Input handling (keyboard + touch + mouse)
//    - Game loop (update + draw)
//    - Screen management (start / playing / game over)
// ================================================================

// ── CANVAS SETUP ──────────────────────────────────
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// ── CONFIG ────────────────────────────────────────
// Tweak these to change the feel of the game
const CONFIG = {
  playerSize: 24,
  playerSpeed: 6,
  playerColor: '#7C5CFC',

  blockMinSize: 16,
  blockMaxSize: 40,
  blockSpeed: 3,          // starting speed
  blockSpeedIncrease: 0.2, // speed increase per 10 points
  spawnRate: 40,           // lower = more blocks (frames between spawns)

  backgroundColor: '#0a0a0f',
  blockColor: '#ff4757',
  scoreColor: 'rgba(255, 255, 255, 0.85)',
};

// ── GAME STATE ────────────────────────────────────
let state = 'start'; // 'start' | 'playing' | 'gameover'
let score = 0;
let highScore = parseInt(localStorage.getItem('highScore') || '0', 10);
let frameCount = 0;

// Player
const player = { x: 0, y: 0, size: CONFIG.playerSize };

// Falling blocks
let blocks = [];

// Input
const keys = {};
let pointerX = null; // for mouse/touch control

// ── DOM REFERENCES ────────────────────────────────
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayText = document.getElementById('overlay-text');
const startBtn = document.getElementById('start-btn');

// ── INPUT HANDLING ────────────────────────────────
document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if ((e.code === 'Space' || e.code === 'Enter') && state !== 'playing') {
    startGame();
  }
});
document.addEventListener('keyup', (e) => { keys[e.code] = false; });

// Mouse
canvas.addEventListener('mousemove', (e) => {
  if (state === 'playing') pointerX = e.clientX;
});
canvas.addEventListener('click', () => {
  if (state !== 'playing') startGame();
});

// Touch
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (state === 'playing') pointerX = e.touches[0].clientX;
}, { passive: false });
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (state !== 'playing') {
    startGame();
  } else {
    pointerX = e.touches[0].clientX;
  }
}, { passive: false });
canvas.addEventListener('touchend', () => { pointerX = null; });

// Start button
startBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  startGame();
});

// ── GAME FUNCTIONS ────────────────────────────────

function startGame() {
  score = 0;
  frameCount = 0;
  blocks = [];
  player.x = canvas.width / 2;
  player.y = canvas.height - 60;
  player.size = CONFIG.playerSize;
  pointerX = null;
  state = 'playing';
  overlay.classList.add('hidden');
}

function gameOver() {
  state = 'gameover';
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', String(highScore));
  }
  overlayTitle.textContent = 'Game Over';
  overlayText.textContent = `Score: ${score} | Best: ${highScore}`;
  startBtn.textContent = 'Play Again';
  overlay.classList.remove('hidden');
}

function showStart() {
  overlayTitle.textContent = 'My Game';
  overlayText.textContent = 'Dodge the falling blocks!\nMove with arrow keys, mouse, or touch.';
  startBtn.textContent = 'Play';
  overlay.classList.remove('hidden');
}

function spawnBlock() {
  const size = CONFIG.blockMinSize + Math.random() * (CONFIG.blockMaxSize - CONFIG.blockMinSize);
  blocks.push({
    x: Math.random() * (canvas.width - size),
    y: -size,
    size: size,
    speed: CONFIG.blockSpeed + (score / 10) * CONFIG.blockSpeedIncrease + Math.random() * 1.5,
  });
}

function rectCollision(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.size > b.x &&
    a.y < b.y + b.size &&
    a.y + a.size > b.y
  );
}

// ── UPDATE ────────────────────────────────────────

function update() {
  if (state !== 'playing') return;

  frameCount++;

  // Player movement — keyboard
  if (keys['ArrowLeft'] || keys['KeyA']) player.x -= CONFIG.playerSpeed;
  if (keys['ArrowRight'] || keys['KeyD']) player.x += CONFIG.playerSpeed;
  if (keys['ArrowUp'] || keys['KeyW']) player.y -= CONFIG.playerSpeed;
  if (keys['ArrowDown'] || keys['KeyS']) player.y += CONFIG.playerSpeed;

  // Player movement — mouse/touch (horizontal follow)
  if (pointerX !== null) {
    const dx = pointerX - (player.x + player.size / 2);
    if (Math.abs(dx) > 2) {
      player.x += dx * 0.15;
    }
  }

  // Clamp to screen
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

  // Spawn blocks
  const spawnInterval = Math.max(10, CONFIG.spawnRate - Math.floor(score / 5));
  if (frameCount % spawnInterval === 0) spawnBlock();

  // Update blocks
  for (let i = blocks.length - 1; i >= 0; i--) {
    blocks[i].y += blocks[i].speed;

    // Collision check
    if (rectCollision(player, blocks[i])) {
      gameOver();
      return;
    }

    // Remove off-screen blocks and score
    if (blocks[i].y > canvas.height) {
      blocks.splice(i, 1);
      score++;
    }
  }
}

// ── DRAW ──────────────────────────────────────────

function draw() {
  // Background
  ctx.fillStyle = CONFIG.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (state !== 'playing' && state !== 'gameover') return;

  // Blocks
  ctx.fillStyle = CONFIG.blockColor;
  for (const b of blocks) {
    ctx.beginPath();
    roundRect(ctx, b.x, b.y, b.size, b.size, 4);
    ctx.fill();
  }

  // Player
  ctx.fillStyle = CONFIG.playerColor;
  ctx.beginPath();
  roundRect(ctx, player.x, player.y, player.size, player.size, 6);
  ctx.fill();

  // Player glow
  ctx.shadowColor = CONFIG.playerColor;
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Score HUD
  ctx.fillStyle = CONFIG.scoreColor;
  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Score: ${score}`, 16, 28);
  ctx.textAlign = 'right';
  ctx.fillText(`Best: ${highScore}`, canvas.width - 16, 28);
}

// Rounded rectangle helper
function roundRect(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ── GAME LOOP ─────────────────────────────────────

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// ── INIT ──────────────────────────────────────────
showStart();
loop();
