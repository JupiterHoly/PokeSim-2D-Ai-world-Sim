import { GAME_CONFIG } from './config.js';
import { state, adjustTimeFlow } from './state.js';

export function initUI() {
  switchTab('world');
  Object.entries(state.toggles).forEach(([key, value]) => {
    const toggle = document.getElementById(`toggle-${key}`);
    if (toggle) toggle.classList.toggle('active', value);
  });
  document.body.classList.toggle('retro-sprites', state.toggles.sprites);
  const minimapCard = document.getElementById('minimap-card');
  if (minimapCard) {
    minimapCard.style.display = state.toggles.minimap ? 'block' : 'none';
  }
  updateStats();
  updateTimeDisplay();
  updateWeatherDisplay();
}

export function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar?.classList.toggle('open');
}

export function switchTab(name) {
  document.querySelectorAll('.tabs button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === name);
  });
  document.querySelectorAll('.tab-content').forEach(panel => {
    panel.classList.toggle('active', panel.id === `tab-${name}`);
  });
  if (window.innerWidth <= 1100) {
    document.getElementById('sidebar')?.classList.remove('open');
  }
}

export function toggleSetting(key) {
  state.toggles[key] = !state.toggles[key];
  const button = document.getElementById(`toggle-${key}`);
  button?.classList.toggle('active', state.toggles[key]);

  if (key === 'music') {
    const music = document.getElementById('bg-music');
    if (!music) return;
    if (state.toggles.music) {
      music.volume = 0.4;
      music.play().catch(() => {});
    } else {
      music.pause();
    }
    return;
  }

  if (key === 'minimap') {
    const minimap = document.getElementById('minimap-card');
    if (minimap) minimap.style.display = state.toggles.minimap ? 'block' : 'none';
    return;
  }

  if (key === 'time') {
    adjustTimeFlow(state.toggles.time);
    showToast('Time flow adjusted.');
    return;
  }

  if (key === 'sprites') {
    document.body.classList.toggle('retro-sprites', state.toggles.sprites);
    showToast(`Retro sprites ${state.toggles.sprites ? 'enabled' : 'disabled'}.`);
  }
}

export function updateStats() {
  state.stats.trainers = state.trainers.length;
  const trainerCount = document.getElementById('stat-trainers');
  const pokemonCount = document.getElementById('stat-pokemon');
  const battles = document.getElementById('stat-battles');
  const encounters = document.getElementById('stat-encounters');
  const towns = document.getElementById('stat-towns');
  const routes = document.getElementById('stat-routes');

  if (trainerCount) trainerCount.textContent = state.stats.trainers;
  if (pokemonCount) pokemonCount.textContent = state.stats.pokemon;
  if (battles) battles.textContent = state.stats.battles;
  if (encounters) encounters.textContent = state.stats.encounters;
  if (towns) towns.textContent = state.stats.towns;
  if (routes) routes.textContent = state.stats.routes;
}

export function updateTimeDisplay() {
  const hours = Math.floor(state.minutes / 60);
  const mins = state.minutes % 60;
  const display = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  const timeText = document.getElementById('time-text');
  if (timeText) timeText.textContent = display;
}

export function updateWeatherDisplay() {
  const icon = document.getElementById('weather-icon');
  const text = document.getElementById('weather-text');
  if (icon) icon.textContent = state.weather.icon;
  if (text) text.textContent = state.weather.name;
}

export function updateTickDisplay() {
  const tickText = document.getElementById('tick-text');
  if (tickText) tickText.textContent = `Tick: ${state.tick}`;
}

export function renderTrainers() {
  const list = document.getElementById('trainers-list');
  if (!list) return;
  list.innerHTML = '';
  state.trainers.forEach(trainer => {
    const card = document.createElement('div');
    card.className = 'trainer-card';
    card.innerHTML = `
      <div class="avatar">🎒</div>
      <div class="meta">
        <strong>${trainer.name}</strong>
        <span>Personality: ${trainer.personality}</span>
        <span>Role: ${trainer.role}</span>
        <span>Starter: ${trainer.starter}</span>
        <span>AI: ${trainer.control} • IQ ${trainer.intelligence}</span>
        <span>Status: ${trainer.mood}</span>
      </div>
    `;
    list.appendChild(card);
  });
  updateStats();
}

export function renderPokemon() {
  const grid = document.getElementById('pokemon-list');
  if (!grid) return;
  grid.innerHTML = '';
  state.pokemon.forEach(pokemon => {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.innerHTML = `
      <div class="avatar">${pokemon.emoji}</div>
      <div class="meta">
        <strong>${pokemon.name}</strong>
        <span>Type: <span class="type-badge">${pokemon.type}</span></span>
        <span>Level ${pokemon.level}</span>
      </div>
    `;
    grid.appendChild(card);
  });
  state.stats.pokemon = state.pokemon.length;
  updateStats();
}

export function addPrayer(message) {
  const list = document.getElementById('prayers-list');
  if (!list) return;
  const item = document.createElement('div');
  item.className = 'prayer-item';
  const timeStamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  item.innerHTML = `<strong>${timeStamp}</strong> — ${message}`;
  list.prepend(item);
  state.prayers.unshift(message);
  if (list.children.length > GAME_CONFIG.MAX_PRAYERS) {
    list.removeChild(list.lastChild);
    state.prayers.pop();
  }
}

export function addEvent(message) {
  const list = document.getElementById('events-list');
  if (!list) return;
  const item = document.createElement('div');
  item.className = 'event-item';
  const timeStamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  item.innerHTML = `<strong>${timeStamp}</strong> — ${message}`;
  list.prepend(item);
  state.events.unshift(message);
  if (list.children.length > GAME_CONFIG.MAX_EVENTS) {
    list.removeChild(list.lastChild);
    state.events.pop();
  }
}

export function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toast-out 0.35s forwards';
    toast.addEventListener('animationend', () => toast.remove());
  }, 2500);
}
