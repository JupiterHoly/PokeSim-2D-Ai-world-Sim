import { getSpeciesById } from '../data/pokemonSpecies.js';

export class Pokemon {
  constructor({ speciesId, level = 5, experience = 0, nature = 'Hardy' }) {
    this.speciesId = speciesId;
    this.level = level;
    this.experience = experience;
    this.nature = nature;
    this.health = 1;
  }

  get species() {
    return getSpeciesById(this.speciesId);
  }

  toJSON() {
    return {
      speciesId: this.speciesId,
      level: this.level,
      experience: this.experience,
      nature: this.nature,
      health: this.health,
    };
  }

  load(data) {
    Object.assign(this, data);
  }

  gainExperience(amount) {
    this.experience += amount;
    while (this.experience >= this.nextLevelThreshold()) {
      this.experience -= this.nextLevelThreshold();
      this.level += 1;
      this.health = 1;
      if (this.species?.evolvesTo && this.level >= 16) {
        this.speciesId = this.species.evolvesTo;
      }
    }
  }

  nextLevelThreshold() {
    return 50 + this.level * 25;
  }
}
