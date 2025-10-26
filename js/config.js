export const GAME_CONFIG = {
  MINUTES_PER_TICK: 10,
  TICK_INTERVAL: 2000,
  PRAYER_CHANCE: 0.25,
  EVENT_CHANCE: 0.35,
  MAX_EVENTS: 80,
  MAX_PRAYERS: 80,
  WORLD_SIZE: 1800
};

export const DEFAULT_TOGGLES = {
  music: true,
  minimap: true,
  prayers: true,
  paths: true,
  sprites: true,
  time: true
};

export const weatherTypes = [
  { icon: '☀️', name: 'Sunny' },
  { icon: '⛅', name: 'Partly Cloudy' },
  { icon: '🌧️', name: 'Rainy' },
  { icon: '⛈️', name: 'Stormy' },
  { icon: '🌫️', name: 'Foggy' },
  { icon: '❄️', name: 'Snowy' }
];
