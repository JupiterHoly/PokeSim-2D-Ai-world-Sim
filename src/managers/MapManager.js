import { Noise } from '../core/Noise.js';
import { biomes } from '../data/biomes.js';

export class MapManager {
  constructor(eventBus, random, canvas, minimap) {
    this.eventBus = eventBus;
    this.random = random;
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.minimap = minimap;
    this.minimapContext = minimap.getContext('2d');
    this.width = 128;
    this.height = 128;
    this.tiles = [];
    this.zoom = 1;
    this.camera = { x: this.width / 2, y: this.height / 2 };
    this.noise = new Noise(this.random);
    this.tileSize = 8;
  }

  async initialize(save) {
    if (save) {
      this.tiles = save.tiles;
      this.width = save.width;
      this.height = save.height;
      this.tiles.forEach((tile) => {
        if (!tile) return;
        if (typeof tile.explored !== 'boolean') {
          tile.explored = false;
        }
      });
    } else {
      this.generate();
    }
    this.bindCameraControls();
    this.renderMinimap();
  }

  getRenderContext() {
    return this.context;
  }

  generate() {
    this.tiles = new Array(this.width * this.height);
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const elevation = this.noise.perlin2(x / 32, y / 32);
        const moisture = this.noise.perlin2(x / 24 + 100, y / 24 + 100);
        const biome = this.pickBiome(elevation, moisture);
        this.tiles[x + y * this.width] = { elevation, moisture, biome, explored: false };
      }
    }
    this.eventBus.emit('map:generated', { width: this.width, height: this.height });
  }

  pickBiome(elevation, moisture) {
    let chosen = biomes[0];
    let bestScore = Infinity;
    for (const biome of biomes) {
      const [emin, emax] = biome.elevationRange;
      const [mmin, mmax] = biome.moistureRange;
      const eScore = elevation < emin ? emin - elevation : elevation > emax ? elevation - emax : 0;
      const mScore = moisture < mmin ? mmin - moisture : moisture > mmax ? moisture - mmax : 0;
      const score = eScore + mScore;
      if (score < bestScore) {
        chosen = biome;
        bestScore = score;
      }
    }
    return chosen.id;
  }

  getTile(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return null;
    return this.tiles[x + y * this.width];
  }

  getRandomWalkableTile() {
    const x = this.random.integer(0, this.width - 1);
    const y = this.random.integer(0, this.height - 1);
    return { x, y };
  }

  getPointOfInterest(position) {
    const options = [
      { x: Math.min(this.width - 1, position.x + this.random.integer(-12, 12)), y: position.y },
      { x: position.x, y: Math.min(this.height - 1, position.y + this.random.integer(-12, 12)) },
      this.getRandomWalkableTile(),
    ];
    return options[this.random.integer(0, options.length - 1)];
  }

  bindCameraControls() {
    let dragging = false;
    let last = { x: 0, y: 0 };
    this.canvas.addEventListener('wheel', (event) => {
      const delta = Math.sign(event.deltaY);
      this.zoom = Math.max(0.5, Math.min(4, this.zoom - delta * 0.1));
    });
    this.canvas.addEventListener('pointerdown', (event) => {
      dragging = true;
      last = { x: event.clientX, y: event.clientY };
    });
    window.addEventListener('pointerup', () => {
      dragging = false;
    });
    window.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      const dx = (event.clientX - last.x) / 16;
      const dy = (event.clientY - last.y) / 16;
      this.camera.x = Math.max(0, Math.min(this.width, this.camera.x - dx));
      this.camera.y = Math.max(0, Math.min(this.height, this.camera.y - dy));
      last = { x: event.clientX, y: event.clientY };
    });
  }

  updateFogOfWar(trainers) {
    for (const trainer of trainers) {
      const radius = 6;
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const x = Math.round(trainer.position.x + dx);
          const y = Math.round(trainer.position.y + dy);
          const tile = this.getTile(x, y);
          if (tile) tile.explored = true;
        }
      }
    }
  }

  render() {
    const ctx = this.context;
    const tileSize = this.tileSize * this.zoom;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    ctx.translate(
      this.canvas.width / 2 - this.camera.x * tileSize,
      this.canvas.height / 2 - this.camera.y * tileSize
    );

    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const tile = this.getTile(x, y);
        if (!tile) continue;
        const biome = biomes.find((b) => b.id === tile.biome);
        ctx.fillStyle = biome?.color ?? '#222';
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        if (!tile.explored) {
          ctx.fillStyle = 'rgba(12, 11, 30, 0.6)';
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
      }
    }
    ctx.restore();
  }

  worldToScreen({ x, y }) {
    const tileSize = this.tileSize * this.zoom;
    const offsetX = this.canvas.width / 2 - this.camera.x * tileSize;
    const offsetY = this.canvas.height / 2 - this.camera.y * tileSize;
    return {
      x: offsetX + x * tileSize + tileSize / 2,
      y: offsetY + y * tileSize + tileSize / 2,
    };
  }

  renderMinimap() {
    const ctx = this.minimapContext;
    const tileSize = this.minimap.width / this.width;
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const tile = this.getTile(x, y);
        const biome = biomes.find((b) => b.id === tile?.biome);
        ctx.fillStyle = biome?.color ?? '#222';
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }

  toJSON() {
    return {
      width: this.width,
      height: this.height,
      tiles: this.tiles,
    };
  }
}
