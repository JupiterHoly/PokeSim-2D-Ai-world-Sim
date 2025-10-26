import { Trainer } from '../entities/Trainer.js';
import { Pokemon } from '../entities/Pokemon.js';
import { pokemonSpecies } from '../data/pokemonSpecies.js';
import { createId } from '../core/id.js';

const PERSONALITY_ARCHETYPES = [
  {
    id: 'wanderer',
    traits: { curiosity: 1, aggression: 0.4, diligence: 0.5, calm: 0.6, wanderlust: 1 },
  },
  {
    id: 'strategist',
    traits: { curiosity: 0.6, aggression: 0.5, diligence: 1, calm: 0.7, wanderlust: 0.3 },
  },
  {
    id: 'hothead',
    traits: { curiosity: 0.3, aggression: 1, diligence: 0.5, calm: 0.1, wanderlust: 0.7 },
  },
  {
    id: 'caretaker',
    traits: { curiosity: 0.7, aggression: 0.2, diligence: 0.8, calm: 1, wanderlust: 0.4 },
  },
];

const TRAINER_NAMES = [
  'Aiko',
  'Cassian',
  'Brock',
  'Sky',
  'Willow',
  'Kira',
  'Marcel',
  'Nia',
  'Seren',
  'Vale',
  'Rowan',
  'Noel',
];

export class TrainerManager {
  constructor(eventBus, random, worldManager, pokemonManager, mapManager) {
    this.eventBus = eventBus;
    this.random = random;
    this.worldManager = worldManager;
    this.pokemonManager = pokemonManager;
    this.mapManager = mapManager;
    this.trainers = [];
  }

  initialize(save) {
    if (save) {
      this.trainers = save.trainers.map((data) => this.createTrainerFromSave(data));
    } else {
      this.seedTrainers();
    }
  }

  seedTrainers() {
    for (let i = 0; i < 24; i += 1) {
      this.createTrainer();
    }
  }

  createTrainerFromSave(data) {
    const party = data.party.map((pokemonData) => {
      const pokemon = new Pokemon(pokemonData);
      pokemon.load(pokemonData);
      return pokemon;
    });
    const trainer = new Trainer({
      id: data.id,
      name: data.name,
      hometown: data.hometown,
      personality: data.personality,
      party,
      random: this.random,
      map: this.mapManager,
    });
    trainer.load(data);
    return trainer;
  }

  createTrainer(config = {}) {
    const id = createId();
    const name = config.name ?? this.random.choice(TRAINER_NAMES);
    const archetype = this.random.choice(PERSONALITY_ARCHETYPES);
    const personality = { ...archetype.traits, ...(config.personality ?? {}) };
    const partySize = config.partySize ?? this.random.integer(1, 3);
    const party = [];
    for (let i = 0; i < partySize; i += 1) {
      const species = this.random.choice(pokemonSpecies);
      party.push(
        new Pokemon({
          speciesId: species.id,
          level: this.random.integer(5, 20),
          nature: this.random.choice(['Brave', 'Calm', 'Modest', 'Adamant']),
        })
      );
    }

    const trainer = new Trainer({
      id,
      name,
      hometown: config.hometown ?? 'Indigo Outpost',
      personality,
      party,
      random: this.random,
      map: this.mapManager,
    });

    this.trainers.push(trainer);
    this.eventBus.emit('trainer:created', trainer);
    return trainer;
  }

  update(dt) {
    this.mapManager.updateFogOfWar(this.trainers);
    const context = {
      trainers: this.trainers,
      world: this.worldManager,
      map: this.mapManager,
    };
    for (const trainer of this.trainers) {
      trainer.update(dt, context);
    }
  }

  render(ctx) {
    if (!ctx) return;
    ctx.save();
    ctx.fillStyle = '#ffe28a';
    for (const trainer of this.trainers) {
      const { x, y } = this.mapManager.worldToScreen(trainer.position);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  getTrainerSummaries() {
    return this.trainers.map((trainer) => ({
      id: trainer.id,
      name: trainer.name,
      state: trainer.state,
      hometown: trainer.hometown,
      party: trainer.party.map((pokemon) => ({
        species: pokemon.species?.name,
        level: pokemon.level,
      })),
      fame: trainer.fame,
      energy: trainer.energy,
    }));
  }

  toJSON() {
    return {
      trainers: this.trainers.map((trainer) => trainer.toJSON()),
    };
  }
}
