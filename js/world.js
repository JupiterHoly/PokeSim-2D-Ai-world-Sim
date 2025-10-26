import { GAME_CONFIG, weatherTypes } from './config.js';
import { state } from './state.js';
import { createTrainerData, pokemonDex, prayerPhrases, eventPhrases } from './data.js';
import {
  addEvent,
  addPrayer,
  renderPokemon,
  renderTrainers,
  updateStats,
  updateTickDisplay,
  updateTimeDisplay,
  updateWeatherDisplay
} from './ui.js';

let worldTimer = null;

export function seedInitialWorld() {
  state.trainers = Array.from({ length: 6 }, () => createTrainerData());
  state.pokemon = pokemonDex.slice(0, 12).map((pokemon, index) => ({
    ...pokemon,
    level: pokemon.level + (index % 4)
  }));
  renderTrainers();
  renderPokemon();
  updateStats();
  updateTimeDisplay();
  updateWeatherDisplay();
  updateTickDisplay();
}

function maybeAddPrayer() {
  if (!state.toggles.prayers) return;
  if (Math.random() >= GAME_CONFIG.PRAYER_CHANCE) return;
  const message = prayerPhrases[Math.floor(Math.random() * prayerPhrases.length)];
  addPrayer(message);
}

function maybeAddEvent() {
  if (Math.random() >= GAME_CONFIG.EVENT_CHANCE) return;
  const message = eventPhrases[Math.floor(Math.random() * eventPhrases.length)];
  addEvent(message);
}

function maybeShiftWeather() {
  if (state.tick % 6 !== 0 && Math.random() >= 0.15) return;
  state.weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  updateWeatherDisplay();
  addEvent(`Weather shifted to ${state.weather.name}.`);
}

function advanceTime() {
  state.minutes += GAME_CONFIG.MINUTES_PER_TICK;
  if (state.minutes >= 24 * 60) {
    state.minutes -= 24 * 60;
  }
  updateTimeDisplay();
}

function updateCounters() {
  if (Math.random() < 0.3) {
    state.stats.battles += Math.floor(Math.random() * 3);
  }
  if (Math.random() < 0.35) {
    state.stats.encounters += Math.floor(Math.random() * 2);
  }
  updateStats();
}

function tickWorld() {
  state.tick += 1;
  updateTickDisplay();
  advanceTime();
  maybeShiftWeather();
  maybeAddPrayer();
  maybeAddEvent();
  updateCounters();
}

export function startWorldLoop() {
  if (worldTimer) clearInterval(worldTimer);
  worldTimer = setInterval(tickWorld, GAME_CONFIG.TICK_INTERVAL);
}

export function stopWorldLoop() {
  if (worldTimer) clearInterval(worldTimer);
  worldTimer = null;
}

export function incrementTickImmediately() {
  tickWorld();
}

export function timeSkipHour() {
  state.minutes += 60;
  if (state.minutes >= 24 * 60) {
    state.minutes -= 24 * 60;
  }
  updateTimeDisplay();
  addEvent('Time skipped ahead by one hour.');
}

export function changeWeatherRandomly() {
  state.weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  updateWeatherDisplay();
  addEvent(`Weather command issued: ${state.weather.name}.`);
}
