import { GAME_CONFIG, DEFAULT_TOGGLES } from './config.js';

export const state = {
  tick: 0,
  minutes: 8 * 60,
  weather: { icon: '☀️', name: 'Sunny' },
  stats: {
    trainers: 0,
    pokemon: 0,
    battles: 0,
    encounters: 0,
    towns: 5,
    routes: 9
  },
  trainers: [],
  npcs: [],
  pokemon: [],
  prayers: [],
  events: [],
  toggles: { ...DEFAULT_TOGGLES }
};

export function adjustTimeFlow(enabled) {
  GAME_CONFIG.MINUTES_PER_TICK = enabled ? 10 : 30;
}
