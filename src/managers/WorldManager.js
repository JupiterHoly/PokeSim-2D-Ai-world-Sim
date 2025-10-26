import { createId } from '../core/id.js';

const WEATHER_TYPES = [
  { id: 'clear', label: 'Clear Skies', mood: 1 },
  { id: 'rain', label: 'Rainfall', mood: -0.1 },
  { id: 'storm', label: 'Thunderstorm', mood: -0.3 },
  { id: 'fog', label: 'Mystic Fog', mood: -0.05 },
  { id: 'heatwave', label: 'Heat Wave', mood: -0.2 },
  { id: 'aurora', label: 'Aurora Veil', mood: 0.3 },
];

export class WorldManager {
  constructor(eventBus, random, saveSystem) {
    this.eventBus = eventBus;
    this.random = random;
    this.saveSystem = saveSystem;
    this.time = 8 * 60;
    this.day = 1;
    this.weather = WEATHER_TYPES[0];
    this.weatherTimer = 0;
    this.prayers = [];
    this.events = [];
  }

  initialize(save) {
    if (save) {
      Object.assign(this, save);
    }
    this.eventBus.emit('world:updated', this.getSnapshot());
  }

  update(dt) {
    this.advanceTime(dt);
    this.tickWeather(dt);
    this.rollForEvents(dt);
  }

  advanceTime(dt) {
    this.time += dt * 10;
    if (this.time >= 24 * 60) {
      this.time -= 24 * 60;
      this.day += 1;
      this.eventBus.emit('world:newDay', this.day);
    }
    this.eventBus.emit('world:clock', this.getClock());
  }

  tickWeather(dt) {
    this.weatherTimer += dt;
    const duration = 60 + this.random.range(-20, 30);
    if (this.weatherTimer > duration) {
      this.weather = this.random.choice(WEATHER_TYPES);
      this.weatherTimer = 0;
      this.eventBus.emit('world:weatherChanged', this.weather);
      this.events.push({
        type: 'weather',
        label: `${this.weather.label} envelopes the world`,
        timestamp: Date.now(),
      });
    }
  }

  rollForEvents(dt) {
    if (this.random.next() < 0.001 * dt) {
      const event = {
        type: 'wild-migration',
        label: 'A wave of wild Pokémon migrates across the land',
        timestamp: Date.now(),
      };
      this.events.push(event);
      this.eventBus.emit('world:event', event);
    }

    if (this.random.next() < 0.002 * dt) {
      const prayer = {
        id: createId(),
        text: this.generatePrayer(),
        timestamp: Date.now(),
      };
      this.prayers.unshift(prayer);
      this.prayers = this.prayers.slice(0, 12);
      this.eventBus.emit('world:prayer', prayer);
    }
  }

  generatePrayer() {
    const wishes = [
      'May my partner grow stronger before the next gym!',
      'Let the rain grant us bountiful harvests.',
      'Please heal my weary Pokémon after that grueling battle.',
      'Bless our town with a new Pokémon Center.',
      'Grant me the courage to challenge the Elite Four.',
      'Spare our camp from the raging storm tonight.',
      'Guide my Pikachu to discover new techniques.',
    ];
    return this.random.choice(wishes);
  }

  getClock() {
    const hours = Math.floor(this.time / 60);
    const minutes = Math.floor(this.time % 60);
    return { hours, minutes, day: this.day };
  }

  getSnapshot() {
    return {
      time: this.time,
      day: this.day,
      weather: this.weather,
      prayers: this.prayers,
      events: this.events,
    };
  }

  setWeather(id) {
    const weather = WEATHER_TYPES.find((option) => option.id === id) ?? WEATHER_TYPES[0];
    this.weather = weather;
    this.weatherTimer = 0;
    this.eventBus.emit('world:weatherChanged', this.weather);
    this.events.push({
      type: 'weather',
      label: `${this.weather.label} called forth by divine intervention`,
      timestamp: Date.now(),
    });
    this.events = this.events.slice(-64);
  }

  toJSON() {
    return this.getSnapshot();
  }
}
