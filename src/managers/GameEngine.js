import { EventBus } from '../core/EventBus.js';
import { GameLoop } from '../core/GameLoop.js';
import { SaveSystem } from '../core/SaveSystem.js';
import { WorldManager } from './WorldManager.js';
import { MapManager } from './MapManager.js';
import { TrainerManager } from './TrainerManager.js';
import { PokemonManager } from './PokemonManager.js';
import { UIManager } from './UIManager.js';
import { GodModeManager } from './GodModeManager.js';
import { Random } from '../core/Random.js';

export class GameEngine {
  constructor(ui) {
    this.eventBus = new EventBus();
    this.random = new Random();
    this.saveSystem = new SaveSystem('pokeSim2d_world');

    this.worldManager = new WorldManager(this.eventBus, this.random, this.saveSystem);
    this.mapManager = new MapManager(this.eventBus, this.random, ui.canvas, ui.minimap);
    this.pokemonManager = new PokemonManager(
      this.eventBus,
      this.random,
      this.worldManager,
      this.mapManager
    );
    this.trainerManager = new TrainerManager(
      this.eventBus,
      this.random,
      this.worldManager,
      this.pokemonManager,
      this.mapManager
    );

    this.uiManager = new UIManager(
      this.eventBus,
      this.worldManager,
      this.trainerManager,
      this.pokemonManager,
      this.mapManager,
      ui
    );

    this.godModeManager = new GodModeManager(
      this.eventBus,
      this.worldManager,
      this.trainerManager,
      this.pokemonManager,
      this.mapManager,
      ui
    );

    this.loop = new GameLoop({
      update: (dt) => this.update(dt),
      render: (ctx) => this.render(ctx),
      context: this.mapManager.getRenderContext(),
    });

    this.eventBus.on('simulation:save', (payload) => {
      this.saveSystem.save(payload);
    });
  }

  async initialize() {
    const save = this.saveSystem.load();
    await this.mapManager.initialize(save?.map);
    this.worldManager.initialize(save?.world);
    this.pokemonManager.initialize(save?.pokemon);
    this.trainerManager.initialize(save?.trainers);
    this.uiManager.initialize();
    this.godModeManager.initialize();
    this.eventBus.emit('simulation:initialized');
  }

  start() {
    this.loop.start();
    this.eventBus.emit('simulation:started');
  }

  stop() {
    this.loop.stop();
    this.eventBus.emit('simulation:stopped');
  }

  update(dt) {
    this.worldManager.update(dt);
    this.pokemonManager.update(dt);
    this.trainerManager.update(dt);
    this.uiManager.update(dt);
    this.godModeManager.update(dt);
  }

  render() {
    this.mapManager.render();
    this.trainerManager.render(this.mapManager.getRenderContext());
    this.pokemonManager.render(this.mapManager.getRenderContext());
    this.uiManager.render();
  }
}
