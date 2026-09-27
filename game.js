// ================================================================
//  PEWPLAY GAME TEMPLATE — "schiva i blocchi"
//  Un gioco completo e minimale da cui partire. Sostituiscilo pure!
//
//  Cosa mostra:
//    - canvas nitido su schermi retina e ridimensionabile
//    - game loop con delta time (stessa velocità a 60 e 120 Hz)
//    - input da tastiera, mouse e touch
//    - pausa automatica quando la scheda/finestra non è visibile
//    - record salvato in localStorage con una chiave UNICA per questo gioco
//
//  Il gioco è indipendente: funziona aprendo index.html, dentro PewPlay
//  o su qualsiasi altro sito.
// ================================================================

// ── IDENTITÀ DEL GIOCO ────────────────────────────
// Usata come prefisso per localStorage: tutti i giochi PewPlay condividono
// lo stesso dominio, quindi ogni gioco deve usare chiavi sue.
const GAME_ID = 'my-game'; // ← metti il nome del repo

// ── TESTI ─────────────────────────────────────────
const T = {
  title: 'My Game',
  intro: 'Dodge the falling blocks!\nArrow keys, mouse or touch to move.',
  play: 'Play',
  again: 'Play again',
  resume: 'Resume',
  paused: 'Paused',
  gameOver: 'Game Over',
  result: (s, b) => `Score: ${s} · Best: ${b}`,
  score: 'Score',
  best: 'Best',
};

// ── SALVATAGGI ────────────────────────────────────
const storage = {
  get(key, fallback) {
    try { const v = localStorage.getItem(`${GAME_ID}:${key}`); return v === null ? fallback : JSON.parse(v); }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(`${GAME_ID}:${key}`, JSON.stringify(value)); } catch { /* storage pieno o bloccato */ }
  },
};

// ── CONFIG ────────────────────────────────────────
const CONFIG = {
  playerSize: 26,
  playerSpeed: 420,        // pixel al secondo
  playerColor: '#7C5CFC',
  blockMin: 16,
  blockMax: 42,
  blockSpeed: 180,         // pixel al secondo all'inizio
  blockSpeedPerPoint: 4,   // accelerazione per ogni punto
  spawnEvery: 0.65,        // secondi tra un blocco e l'altro all'inizio
  spawnMin: 0.18,
  background: '#0a0a0f',
  blockColor: '#ff4757',
  hudColor: 'rgba(255,255,255,.85)',
};

// ── CANVAS ────────────────────────────────────────
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let W = 0;
let H = 0;
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = canvas.clientWidth;
  H = canvas.clientHeight;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize);
resize();

// ── STATO ─────────────────────────────────────────
let state = 'start'; // 'start' | 'playing' | 'paused' | 'gameover'
let score = 0;
let best = storage.get('best', 0);
let spawnTimer = 0;
let blocks = [];
const player = { x: 0, y: 0, size: CONFIG.playerSize };
const keys = {};
let pointerX = null;

// ── UI ────────────────────────────────────────────
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayText = document.getElementById('overlay-text');
const startBtn = document.getElementById('start-btn');

function showOverlay(title, text, button) {
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  startBtn.textContent = button;
  overlay.classList.remove('hidden');
  startBtn.focus({ preventScroll: true });
}

// ── INPUT ─────────────────────────────────────────
function primaryAction() {
  if (state === 'playing') pause();
  else if (state === 'paused') resume();
  else startGame();
}
document.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyP' || e.code === 'Escape') {
    if (e.target === startBtn && (e.code === 'Space' || e.code === 'Enter')) return; // ci pensa il click del pulsante
    e.preventDefault();
    if (e.code === 'Escape' && state !== 'playing') return;
    primaryAction();
  }
  if (e.code.startsWith('Arrow')) e.preventDefault(); // non far scorrere la pagina che contiene il gioco
});
document.addEventListener('keyup', e => { keys[e.code] = false; });
canvas.addEventListener('pointermove', e => { if (state === 'playing') pointerX = e.clientX; });
canvas.addEventListener('pointerdown', e => {
  if (state === 'paused') resume();
  else if (state !== 'playing') startGame();
  pointerX = e.clientX;
});
canvas.addEventListener('pointerup', e => { if (e.pointerType === 'touch') pointerX = null; });
startBtn.addEventListener('click', e => { e.stopPropagation(); primaryAction(); });

// Pausa automatica se l'utente cambia scheda o clicca fuori dal gioco
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
window.addEventListener('blur', pause);

// ── LOGICA ────────────────────────────────────────
function startGame() {
  score = 0;
  spawnTimer = 0;
  blocks = [];
  player.x = W / 2 - player.size / 2;
  player.y = H - player.size - 36;
  pointerX = null;
  state = 'playing';
  overlay.classList.add('hidden');
}

function pause() {
  if (state !== 'playing') return;
  state = 'paused';
  showOverlay(T.paused, T.result(score, best), T.resume);
}

function resume() {
  state = 'playing';
  overlay.classList.add('hidden');
}

function gameOver() {
  state = 'gameover';
  if (score > best) { best = score; storage.set('best', best); }
  showOverlay(T.gameOver, T.result(score, best), T.again);
}

function spawnBlock() {
  const size = CONFIG.blockMin + Math.random() * (CONFIG.blockMax - CONFIG.blockMin);
  blocks.push({
    x: Math.random() * (W - size),
    y: -size,
    size,
    speed: CONFIG.blockSpeed + score * CONFIG.blockSpeedPerPoint + Math.random() * 90,
  });
}

const hit = (a, b) => a.x < b.x + b.size && a.x + a.size > b.x && a.y < b.y + b.size && a.y + a.size > b.y;

function update(dt) {
  if (state !== 'playing') return;

  const dir = (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0);
  if (dir) { player.x += dir * CONFIG.playerSpeed * dt; pointerX = null; }
  if (pointerX !== null) player.x += (pointerX - (player.x + player.size / 2)) * Math.min(1, dt * 12);
  player.x = Math.max(0, Math.min(W - player.size, player.x));
  player.y = H - player.size - 36;

  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    spawnBlock();
    spawnTimer = Math.max(CONFIG.spawnMin, CONFIG.spawnEvery - score * 0.01);
  }

  for (let i = blocks.length - 1; i >= 0; i--) {
    const b = blocks[i];
    b.y += b.speed * dt;
    if (hit(player, b)) return gameOver();
    if (b.y > H) { blocks.splice(i, 1); score++; }
  }
}

// ── DISEGNO ───────────────────────────────────────
function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
}

function draw() {
  ctx.fillStyle = CONFIG.background;
  ctx.fillRect(0, 0, W, H);
  if (state === 'start') return;

  ctx.fillStyle = CONFIG.blockColor;
  for (const b of blocks) { roundRect(b.x, b.y, b.size, b.size, 5); ctx.fill(); }

  ctx.save();
  ctx.shadowColor = CONFIG.playerColor;
  ctx.shadowBlur = 16;
  ctx.fillStyle = CONFIG.playerColor;
  roundRect(player.x, player.y, player.size, player.size, 7);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = CONFIG.hudColor;
  ctx.font = '600 16px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`${T.score}: ${score}`, 16, 28);
  ctx.textAlign = 'right';
  ctx.fillText(`${T.best}: ${best}`, W - 16, 28);
}

// ── LOOP ──────────────────────────────────────────
let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000); // max 50 ms: niente salti dopo una pausa
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

showOverlay(T.title, T.intro, T.play);
requestAnimationFrame(loop);
