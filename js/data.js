export const trainerNames = ['Mira', 'Ash', 'Bianca', 'Cedric', 'Diantha', 'Ethan', 'Fenn', 'Gloria', 'Hiro', 'Iris'];
export const trainerPersonas = ['Calm', 'Aggressive', 'Curious', 'Strategist', 'Dreamer'];
export const trainerRoles = ['Explorer', 'Gym Leader', 'Breeder', 'Researcher', 'Rival'];
export const trainerStarters = ['Bulbasaur', 'Charmander', 'Squirtle', 'Pikachu', 'Eevee'];

export const pokemonDex = [
  { name: 'Bulbasaur', type: 'Grass/Poison', emoji: '🌿', level: 12 },
  { name: 'Charmander', type: 'Fire', emoji: '🔥', level: 11 },
  { name: 'Squirtle', type: 'Water', emoji: '💧', level: 11 },
  { name: 'Pikachu', type: 'Electric', emoji: '⚡', level: 14 },
  { name: 'Eevee', type: 'Normal', emoji: '🦊', level: 13 },
  { name: 'Jigglypuff', type: 'Fairy', emoji: '🎵', level: 10 },
  { name: 'Geodude', type: 'Rock/Ground', emoji: '🪨', level: 15 },
  { name: 'Gastly', type: 'Ghost/Poison', emoji: '👻', level: 16 },
  { name: 'Magikarp', type: 'Water', emoji: '🐟', level: 7 },
  { name: 'Onix', type: 'Rock/Ground', emoji: '🪨', level: 18 },
  { name: 'Abra', type: 'Psychic', emoji: '🔮', level: 17 },
  { name: 'Lapras', type: 'Water/Ice', emoji: '🐚', level: 22 },
  { name: 'Snorlax', type: 'Normal', emoji: '😴', level: 24 },
  { name: 'Dragonite', type: 'Dragon/Flying', emoji: '🐉', level: 28 }
];

export const prayerPhrases = [
  'May my Pikachu find a friendly rival today.',
  'Let the rains cleanse Route 3.',
  'Grant me a sign before I challenge the gym.',
  'Please guide lost travelers through the fog.',
  'Bless the berries in Viridian Forest.',
  'Send a worthy opponent to test my team.',
  'Keep my Eevee safe through the night.',
  'Let the winds carry tales of my victories.'
];

export const eventPhrases = [
  'A sudden flock of Pidgey shifted the skies.',
  'Trainers spotted rare footprints near the river.',
  'A healing festival brightened Lavender Town.',
  'An electrical storm charged the power plant.',
  'Mysterious lights danced across the midnight dunes.',
  'A migrating herd of Tauros thundered through Route 5.',
  'Archaeologists uncovered ancient Pokéball relics.'
];

export function createTrainerData(overrides = {}) {
  const name =
    overrides.name ||
    `${trainerNames[Math.floor(Math.random() * trainerNames.length)]} #${Math.floor(Math.random() * 90 + 10)}`;

  return {
    name,
    personality: overrides.personality || trainerPersonas[Math.floor(Math.random() * trainerPersonas.length)],
    role: overrides.role || trainerRoles[Math.floor(Math.random() * trainerRoles.length)],
    starter: overrides.starter || trainerStarters[Math.floor(Math.random() * trainerStarters.length)],
    control: overrides.control || ['AI', 'Hybrid', 'Observer'][Math.floor(Math.random() * 3)],
    intelligence: overrides.intelligence || Math.floor(Math.random() * 40) + 60,
    mood: ['Focused', 'Restless', 'Inspired', 'Tired'][Math.floor(Math.random() * 4)]
  };
}
