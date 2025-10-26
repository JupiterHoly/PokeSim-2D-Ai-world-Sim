const STATES = ['EXPLORE', 'REST', 'TRAIN', 'TRAVEL', 'BATTLE'];

export class Trainer {
  constructor({ id, name, hometown, personality, party, random, map }) {
    this.id = id;
    this.name = name;
    this.hometown = hometown;
    this.personality = personality;
    this.party = party;
    this.state = 'EXPLORE';
    this.stateTimer = 0;
    this.energy = 1;
    this.money = 1000;
    this.fame = 0;
    this.relationships = new Map();
    this.memories = [];
    this.position = map.getRandomWalkableTile();
    this.destination = null;
    this.random = random;
    this.map = map;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      hometown: this.hometown,
      personality: this.personality,
      party: this.party.map((p) => p.toJSON()),
      state: this.state,
      energy: this.energy,
      money: this.money,
      fame: this.fame,
      relationships: Array.from(this.relationships.entries()),
      memories: this.memories,
      position: this.position,
      destination: this.destination,
    };
  }

  load(data) {
    this.state = data.state ?? this.state;
    this.energy = data.energy ?? this.energy;
    this.money = data.money ?? this.money;
    this.fame = data.fame ?? this.fame;
    this.memories = Array.isArray(data.memories) ? data.memories : [];
    this.relationships = new Map(data.relationships ?? []);
    this.position = data.position ? { ...data.position } : this.position;
    this.destination = data.destination ?? null;
  }

  update(dt, context) {
    this.stateTimer += dt;
    this.energy = Math.max(0, Math.min(1, this.energy));

    if (this.stateTimer > this.getStateDuration()) {
      this.transition();
    }

    switch (this.state) {
      case 'EXPLORE':
        this.seekPointOfInterest(context);
        break;
      case 'TRAVEL':
        this.travel(dt);
        break;
      case 'REST':
        this.energy = Math.min(1, this.energy + dt * 0.15);
        break;
      case 'TRAIN':
        this.train(dt);
        break;
      case 'BATTLE':
        this.handleBattle(context);
        break;
      default:
        break;
    }
  }

  getStateDuration() {
    const base = { EXPLORE: 120, REST: 80, TRAIN: 90, TRAVEL: 60, BATTLE: 30 };
    const personalityBias = this.personality.aggression * 20 - this.personality.calm * 10;
    return Math.max(30, base[this.state] + personalityBias);
  }

  transition() {
    this.stateTimer = 0;
    const weights = {
      EXPLORE: 3 + this.personality.curiosity * 2,
      REST: this.energy < 0.3 ? 3 : 1,
      TRAIN: 2 + this.personality.diligence,
      TRAVEL: 1 + this.personality.wanderlust * 2,
      BATTLE: this.personality.aggression + this.fame * 0.1,
    };

    const choices = STATES.filter((state) => weights[state] > 0);
    const total = choices.reduce((acc, state) => acc + weights[state], 0);
    let threshold = this.random.range(0, total);
    for (const state of choices) {
      threshold -= weights[state];
      if (threshold <= 0) {
        this.state = state;
        break;
      }
    }

    if (this.state === 'TRAVEL') {
      this.destination = this.map.getRandomWalkableTile();
    }
  }

  seekPointOfInterest({ trainers, map }) {
    if (!this.destination || this.random.next() < 0.05) {
      this.destination = map.getPointOfInterest(this.position);
    }
    this.travel(1 / 60);
    if (this.random.next() < 0.005 && trainers.length > 1) {
      this.state = 'BATTLE';
      this.stateTimer = 0;
    }
  }

  travel(dt) {
    if (!this.destination) return;
    const dx = this.destination.x - this.position.x;
    const dy = this.destination.y - this.position.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 0.1) {
      this.destination = null;
      this.state = 'EXPLORE';
      return;
    }
    const speed = 2 * (0.5 + this.personality.wanderlust * 0.5) * dt;
    this.position.x += (dx / distance) * speed;
    this.position.y += (dy / distance) * speed;
  }

  train(dt) {
    this.energy = Math.max(0, this.energy - dt * 0.1);
    for (const pokemon of this.party) {
      pokemon.gainExperience(dt * 5);
    }
  }

  handleBattle({ trainers }) {
    this.energy = Math.max(0, this.energy - 0.005);
    this.fame += 0.001;
    if (this.random.next() < 0.01) {
      const opponent = this.random.choice(trainers.filter((t) => t.id !== this.id));
      if (opponent) {
        this.recordMemory(`Battled ${opponent.name}`);
        opponent.recordMemory(`Battled ${this.name}`);
        this.adjustRelationship(opponent.id, 0.05);
        opponent.adjustRelationship(this.id, 0.05);
      }
    }
    if (this.random.next() < 0.02) {
      this.state = 'REST';
      this.stateTimer = 0;
    }
  }

  recordMemory(description) {
    this.memories.push({ description, timestamp: Date.now() });
    if (this.memories.length > 32) {
      this.memories.shift();
    }
  }

  adjustRelationship(trainerId, delta) {
    const value = this.relationships.get(trainerId) ?? 0;
    this.relationships.set(trainerId, Math.max(-1, Math.min(1, value + delta)));
  }
}
