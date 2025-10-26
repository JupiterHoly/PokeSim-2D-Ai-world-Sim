export const pokemonSpecies = [
  { id: 1, name: 'Bulbasaur', types: ['Grass', 'Poison'], emoji: '🌱', evolvesTo: 2 },
  { id: 2, name: 'Ivysaur', types: ['Grass', 'Poison'], emoji: '🌿', evolvesTo: 3 },
  { id: 3, name: 'Venusaur', types: ['Grass', 'Poison'], emoji: '🌳' },
  { id: 4, name: 'Charmander', types: ['Fire'], emoji: '🔥', evolvesTo: 5 },
  { id: 5, name: 'Charmeleon', types: ['Fire'], emoji: '🐉', evolvesTo: 6 },
  { id: 6, name: 'Charizard', types: ['Fire', 'Flying'], emoji: '🐲' },
  { id: 7, name: 'Squirtle', types: ['Water'], emoji: '💧', evolvesTo: 8 },
  { id: 8, name: 'Wartortle', types: ['Water'], emoji: '🐢', evolvesTo: 9 },
  { id: 9, name: 'Blastoise', types: ['Water'], emoji: '🛡️' },
  { id: 25, name: 'Pikachu', types: ['Electric'], emoji: '⚡', evolvesTo: 26 },
  { id: 26, name: 'Raichu', types: ['Electric'], emoji: '✨' },
  { id: 35, name: 'Clefairy', types: ['Fairy'], emoji: '🌙', evolvesTo: 36 },
  { id: 36, name: 'Clefable', types: ['Fairy'], emoji: '⭐' },
  { id: 39, name: 'Jigglypuff', types: ['Normal', 'Fairy'], emoji: '🎵', evolvesTo: 40 },
  { id: 40, name: 'Wigglytuff', types: ['Normal', 'Fairy'], emoji: '🎀' },
  { id: 52, name: 'Meowth', types: ['Normal'], emoji: '💰', evolvesTo: 53 },
  { id: 53, name: 'Persian', types: ['Normal'], emoji: '👑' },
  { id: 63, name: 'Abra', types: ['Psychic'], emoji: '🔮', evolvesTo: 64 },
  { id: 64, name: 'Kadabra', types: ['Psychic'], emoji: '🪄', evolvesTo: 65 },
  { id: 65, name: 'Alakazam', types: ['Psychic'], emoji: '🧠' },
  { id: 90, name: 'Shellder', types: ['Water'], emoji: '🐚', evolvesTo: 91 },
  { id: 91, name: 'Cloyster', types: ['Water', 'Ice'], emoji: '❄️' },
  { id: 129, name: 'Magikarp', types: ['Water'], emoji: '🎣', evolvesTo: 130 },
  { id: 130, name: 'Gyarados', types: ['Water', 'Flying'], emoji: '🐉' },
  { id: 133, name: 'Eevee', types: ['Normal'], emoji: '🦊', evolvesTo: 134 },
  { id: 134, name: 'Vaporeon', types: ['Water'], emoji: '💠' },
  { id: 135, name: 'Jolteon', types: ['Electric'], emoji: '⚡️' },
  { id: 136, name: 'Flareon', types: ['Fire'], emoji: '🔥' },
  { id: 143, name: 'Snorlax', types: ['Normal'], emoji: '😴' },
];

export function getSpeciesById(id) {
  return pokemonSpecies.find((species) => species.id === id);
}

export function getSpeciesByName(name) {
  return pokemonSpecies.find((species) => species.name === name);
}
