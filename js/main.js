import { state } from './state.js';
import { initUI, toggleSidebar, switchTab, toggleSetting } from './ui.js';
import { initCanvas, zoomIn, zoomOut, centerCamera } from './map.js';
import { initNeural } from './neural.js';
import {
  initGodMode,
  openCreateTrainer,
  openCreateNPC,
  closeModal,
  createTrainer,
  createNPC,
  createRandomNPC,
  healAll,
  spawnPokemon,
  changeWeather,
  timeSkip,
  triggerEvent
} from './godMode.js';
import { seedInitialWorld, startWorldLoop } from './world.js';

function startGame() {
  const progressBar = document.getElementById('progress-bar');
  if (!progressBar) return;
  let progress = 0;

  const loaderInterval = setInterval(() => {
    progress = Math.min(100, progress + Math.random() * 22);
    progressBar.style.width = `${progress}%`;

    if (progress >= 100) {
      clearInterval(loaderInterval);
      setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        const container = document.getElementById('game-container');
        container?.classList.add('active');

        initUI();
        initCanvas();
        initNeural();
        initGodMode();
        seedInitialWorld();
        startWorldLoop();

        if (state.toggles.music) {
          const music = document.getElementById('bg-music');
          if (music) {
            music.volume = 0.4;
            music.play().catch(() => {});
          }
        }
      }, 350);
    }
  }, 220);
}

document.addEventListener('DOMContentLoaded', startGame);

// Expose functions for inline handlers
window.toggleSidebar = toggleSidebar;
window.switchTab = switchTab;
window.toggleSetting = toggleSetting;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.centerCamera = centerCamera;
window.openCreateTrainer = openCreateTrainer;
window.openCreateNPC = openCreateNPC;
window.closeModal = closeModal;
window.createTrainer = createTrainer;
window.createNPC = createNPC;
window.createRandomNPC = createRandomNPC;
window.healAll = healAll;
window.spawnPokemon = spawnPokemon;
window.changeWeather = changeWeather;
window.timeSkip = timeSkip;
window.triggerEvent = triggerEvent;
