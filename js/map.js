import { GAME_CONFIG } from './config.js';
import { state } from './state.js';

let worldCtx;
let minimapCtx;
let animationId;

const camera = {
  x: GAME_CONFIG.WORLD_SIZE / 2,
  y: GAME_CONFIG.WORLD_SIZE / 2,
  zoom: 0.5
};

let isDragging = false;
const dragStart = { x: 0, y: 0 };

const terrainBlobs = Array.from({ length: 14 }).map((_, i) => ({
  x: (i * 123) % GAME_CONFIG.WORLD_SIZE,
  y: ((i * 213) + 400) % GAME_CONFIG.WORLD_SIZE,
  radius: 160 + (i * 37) % 140,
  tilt: (i * 28) * Math.PI / 180,
  color: `rgba(${30 + (i * 20) % 120}, ${80 + (i * 12) % 120}, ${120 + (i * 7) % 120}, 0.4)`
}));

const townLocations = Array.from({ length: 8 }).map((_, i) => ({
  x: 200 + i * 180,
  y: (i * 260 + 120) % GAME_CONFIG.WORLD_SIZE
}));

const routeLines = Array.from({ length: 16 }).map((_, i) => ({
  x1: 120 + (i * 90),
  y1: 80,
  x2: (i * 150) % GAME_CONFIG.WORLD_SIZE,
  y2: GAME_CONFIG.WORLD_SIZE - 120
}));

export function initCanvas() {
  const worldCanvas = document.getElementById('world-canvas');
  const minimapCanvas = document.getElementById('minimap-canvas');
  if (!worldCanvas || !minimapCanvas) return;
  worldCtx = worldCanvas.getContext('2d');
  minimapCtx = minimapCanvas.getContext('2d');

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  worldCanvas.addEventListener('pointerdown', startDrag);
  window.addEventListener('pointermove', drag);
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointerleave', endDrag);

  if (!animationId) {
    const loop = () => {
      drawWorld();
      drawMinimap();
      animationId = requestAnimationFrame(loop);
    };
    animationId = requestAnimationFrame(loop);
  }
}

function resizeCanvas() {
  if (!worldCtx) return;
  const canvas = worldCtx.canvas;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  drawWorld();
  drawMinimap();
}

function startDrag(event) {
  isDragging = true;
  dragStart.x = event.clientX;
  dragStart.y = event.clientY;
  document.body.style.cursor = 'grabbing';
}

function drag(event) {
  if (!isDragging) return;
  const deltaX = (event.clientX - dragStart.x) / camera.zoom;
  const deltaY = (event.clientY - dragStart.y) / camera.zoom;
  camera.x -= deltaX;
  camera.y -= deltaY;
  camera.x = Math.max(0, Math.min(GAME_CONFIG.WORLD_SIZE, camera.x));
  camera.y = Math.max(0, Math.min(GAME_CONFIG.WORLD_SIZE, camera.y));
  dragStart.x = event.clientX;
  dragStart.y = event.clientY;
}

function endDrag() {
  isDragging = false;
  document.body.style.cursor = '';
}

export function zoomIn() {
  camera.zoom = Math.min(2.4, camera.zoom + 0.15);
}

export function zoomOut() {
  camera.zoom = Math.max(0.3, camera.zoom - 0.15);
}

export function centerCamera() {
  camera.x = GAME_CONFIG.WORLD_SIZE / 2;
  camera.y = GAME_CONFIG.WORLD_SIZE / 2;
  camera.zoom = 0.8;
}

function drawWorld() {
  if (!worldCtx) return;
  const canvas = worldCtx.canvas;
  worldCtx.clearRect(0, 0, canvas.width, canvas.height);
  worldCtx.save();
  worldCtx.translate(canvas.width / 2, canvas.height / 2);
  worldCtx.scale(camera.zoom, camera.zoom);
  worldCtx.translate(-camera.x, -camera.y);

  const gradient = worldCtx.createRadialGradient(
    GAME_CONFIG.WORLD_SIZE / 2,
    GAME_CONFIG.WORLD_SIZE / 2,
    200,
    GAME_CONFIG.WORLD_SIZE / 2,
    GAME_CONFIG.WORLD_SIZE / 2,
    900
  );
  gradient.addColorStop(0, '#13355a');
  gradient.addColorStop(1, '#08111f');
  worldCtx.fillStyle = gradient;
  worldCtx.fillRect(0, 0, GAME_CONFIG.WORLD_SIZE, GAME_CONFIG.WORLD_SIZE);

  terrainBlobs.forEach(blob => {
    worldCtx.fillStyle = blob.color;
    worldCtx.beginPath();
    worldCtx.ellipse(blob.x, blob.y, blob.radius, blob.radius * 0.6, blob.tilt, 0, Math.PI * 2);
    worldCtx.fill();
  });

  townLocations.forEach(town => {
    worldCtx.fillStyle = 'rgba(51, 255, 215, 0.75)';
    worldCtx.fillRect(town.x, town.y, 55, 55);
    worldCtx.strokeStyle = 'rgba(8, 20, 32, 0.9)';
    worldCtx.lineWidth = 4;
    worldCtx.strokeRect(town.x, town.y, 55, 55);
  });

  if (state.toggles.paths) {
    worldCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    worldCtx.lineWidth = 6;
    worldCtx.lineCap = 'round';
    worldCtx.beginPath();
    routeLines.forEach(route => {
      worldCtx.moveTo(route.x1, route.y1);
      worldCtx.lineTo(route.x2, route.y2);
    });
    worldCtx.stroke();
  }

  worldCtx.restore();
}

function drawMinimap() {
  if (!minimapCtx || !worldCtx) return;
  const canvas = minimapCtx.canvas;
  minimapCtx.clearRect(0, 0, canvas.width, canvas.height);
  minimapCtx.fillStyle = '#0a1626';
  minimapCtx.fillRect(0, 0, canvas.width, canvas.height);

  minimapCtx.fillStyle = 'rgba(51, 255, 215, 0.3)';
  minimapCtx.fillRect(18, 18, canvas.width - 36, canvas.height - 36);
  minimapCtx.fillStyle = 'rgba(12, 30, 48, 0.8)';
  minimapCtx.fillRect(28, 28, canvas.width - 56, canvas.height - 56);

  const scale = (canvas.width - 56) / GAME_CONFIG.WORLD_SIZE;
  const viewWidth = (worldCtx.canvas.width / camera.zoom) * scale;
  const viewHeight = (worldCtx.canvas.height / camera.zoom) * scale;
  const viewX = 28 + (camera.x - worldCtx.canvas.width / (2 * camera.zoom)) * scale;
  const viewY = 28 + (camera.y - worldCtx.canvas.height / (2 * camera.zoom)) * scale;

  minimapCtx.strokeStyle = 'rgba(51, 255, 215, 0.6)';
  minimapCtx.lineWidth = 2;
  minimapCtx.strokeRect(viewX, viewY, viewWidth, viewHeight);
}
