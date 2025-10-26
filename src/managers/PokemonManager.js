import { Pokemon } from '../entities/Pokemon.js';
import { pokemonSpecies } from '../data/pokemonSpecies.js';

export class PokemonManager {
  constructor(eventBus, random, worldManager, mapManager) {
    this.eventBus = eventBus;
    this.random = random;
    this.worldManager = worldManager;
    this.mapManager = mapManager;
    this.wildPokemon = [];
  }

  initialize(save) {
    if (save) {
      this.wildPokemon = save.wildPokemon.map((data) => {
        const pokemon = new Pokemon(data);
        pokemon.load(data);
        pokemon.position = data.position
          ? { ...data.position }
          : this.mapManager.getRandomWalkableTile();
        return pokemon;
      });
    } else {
      this.seedWildPokemon();
    }
  }

  seedWildPokemon() {
    for (let i = 0; i < 64; i += 1) {
      const species = this.random.choice(pokemonSpecies);
      this.wildPokemon.push(
        new Pokemon({
          speciesId: species.id,
          level: this.random.integer(3, 24),
          nature: this.random.choice(['Brave', 'Calm', 'Timid', 'Bold', 'Jolly', 'Quiet']),
        })
      );
      this.wildPokemon[this.wildPokemon.length - 1].position = this.mapManager.getRandomWalkableTile();
    }
  }

  update(dt) {
    const weatherMood = this.worldManager.weather?.mood ?? 0;
    for (const pokemon of this.wildPokemon) {
      pokemon.health = Math.max(0, Math.min(1, pokemon.health + dt * (0.02 + weatherMood * 0.01)));
      if (this.random.next() < 0.0005 * dt) {
        pokemon.gainExperience(10);
      }
      this.roam(pokemon, dt);
    }

    if (this.random.next() < 0.0005 * dt) {
      const species = this.random.choice(pokemonSpecies);
      const spawn = new Pokemon({ speciesId: species.id, level: this.random.integer(1, 15) });
      spawn.position = this.mapManager.getRandomWalkableTile();
      this.wildPokemon.push(spawn);
      this.eventBus.emit('pokemon:spawned', spawn);
    }
  }

  render(ctx) {
    if (!ctx) return;
    ctx.save();
    ctx.globalAlpha = 0.8;
    for (const pokemon of this.wildPokemon.slice(0, 100)) {
      const { x, y } = this.mapManager.worldToScreen(pokemon.position ?? { x: 0, y: 0 });
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x - 2, y - 2, 4, 4);
    }
    ctx.restore();
  }

  createPokemon(speciesId, level = 5) {
    const pokemon = new Pokemon({ speciesId, level });
    pokemon.position = this.mapManager.getRandomWalkableTile();
    this.wildPokemon.push(pokemon);
    return pokemon;
  }

  toJSON() {
    return {
      wildPokemon: this.wildPokemon.map((pokemon) => ({
        ...pokemon.toJSON(),
        position: pokemon.position,
      })),
    };
  }

  roam(pokemon, dt) {
    if (!pokemon.position) {
      pokemon.position = this.mapManager.getRandomWalkableTile();
      return;
    }
    const target = pokemon.roamTarget ?? this.mapManager.getRandomWalkableTile();
    pokemon.roamTarget = target;
    const dx = target.x - pokemon.position.x;
    const dy = target.y - pokemon.position.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 0.2) {
      pokemon.roamTarget = this.mapManager.getRandomWalkableTile();
      return;
    }
    const speed = 0.5 * dt;
    pokemon.position.x += (dx / distance) * speed;
    pokemon.position.y += (dy / distance) * speed;
  }
}
