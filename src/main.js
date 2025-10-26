import { GameEngine } from './managers/GameEngine.js';

const loadingScreen = document.getElementById('loading-screen');
const appRoot = document.getElementById('app');

async function bootstrap() {
  const engine = new GameEngine({
    canvas: document.getElementById('world-canvas'),
    minimap: document.getElementById('minimap'),
    infoPanel: document.getElementById('info-panel'),
    ticker: document.getElementById('event-ticker'),
    prayerFeed: document.getElementById('prayer-feed'),
    tabs: document.getElementById('primary-tabs'),
    tabPanels: document.querySelectorAll('.tab-panel'),
    godModeWindow: document.getElementById('god-mode-window'),
    toggleGodModeButton: document.getElementById('toggle-god-mode'),
    toggleAudioButton: document.getElementById('toggle-audio'),
    saveButton: document.getElementById('save-world'),
    bgm: document.getElementById('bgm'),
    timeReadout: document.getElementById('time-readout'),
    weatherReadout: document.getElementById('weather-readout'),
    eventReadout: document.getElementById('event-readout'),
  });

  await engine.initialize();
  loadingScreen.classList.add('hidden');
  appRoot.classList.remove('hidden');
  engine.start();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
