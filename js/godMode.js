import { state } from './state.js';
import { createTrainerData, pokemonDex, eventPhrases } from './data.js';
import { changeWeatherRandomly, timeSkipHour } from './world.js';
import { addEvent, renderPokemon, renderTrainers, showToast, updateTimeDisplay } from './ui.js';

export function initGodMode() {
  ['god-modal', 'trainer-modal', 'npc-modal'].forEach(id => {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.addEventListener('click', event => {
      if (event.target === overlay) {
        closeModal(id);
      }
    });
  });

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal('god-modal');
      closeModal('trainer-modal');
      closeModal('npc-modal');
    }
  });
}

export function openCreateTrainer() {
  document.getElementById('trainer-modal')?.classList.add('active');
}

export function openCreateNPC() {
  document.getElementById('npc-modal')?.classList.add('active');
}

export function closeModal(id) {
  document.getElementById(id)?.classList.remove('active');
}

export function createTrainer(event) {
  event.preventDefault();
  const data = {
    name: document.getElementById('trainer-name').value,
    personality: document.getElementById('trainer-personality').value,
    role: document.getElementById('trainer-role').value,
    starter: document.getElementById('trainer-starter').value,
    control: document.getElementById('trainer-control').value,
    intelligence: document.getElementById('trainer-intelligence').value
  };

  state.trainers.unshift(createTrainerData(data));
  renderTrainers();
  addEvent(`${data.name} joined the world.`);
  showToast('Trainer created successfully.');

  event.target.reset();
  document.getElementById('trainer-intelligence').value = 60;
  document.getElementById('intel-value').textContent = '60';
  closeModal('trainer-modal');
}

export function createNPC(event) {
  event.preventDefault();
  const npc = {
    name: document.getElementById('npc-name').value,
    type: document.getElementById('npc-type').value,
    behavior: document.getElementById('npc-behavior').value
  };
  state.npcs.unshift(npc);
  addEvent(`${npc.name} the ${npc.type.toLowerCase()} arrived (${npc.behavior}).`);
  showToast('NPC created.');
  event.target.reset();
  closeModal('npc-modal');
}

export function createRandomNPC() {
  const npc = {
    name: `NPC ${Math.floor(Math.random() * 900 + 100)}`,
    type: ['Merchant', 'Healer', 'Guide', 'Scientist'][Math.floor(Math.random() * 4)],
    behavior: ['Wanders', 'Stationary', 'Quest Giver'][Math.floor(Math.random() * 3)]
  };
  state.npcs.unshift(npc);
  addEvent(`${npc.name} drifted into town as a ${npc.type.toLowerCase()}.`);
  showToast('Random NPC spawned.');
}

export function healAll() {
  addEvent('A wave of light restored every party to full health.');
  showToast('All Pokémon healed.');
}

export function spawnPokemon() {
  const base = pokemonDex[Math.floor(Math.random() * pokemonDex.length)];
  const newcomer = { ...base, level: base.level + Math.floor(Math.random() * 4) };
  state.pokemon.unshift(newcomer);
  renderPokemon();
  addEvent(`${newcomer.name} appeared nearby at level ${newcomer.level}.`);
  showToast(`${newcomer.name} spawned.`);
}

export function changeWeather() {
  changeWeatherRandomly();
  showToast(`Weather shifted to ${state.weather.name}.`);
}

export function timeSkip() {
  timeSkipHour();
  updateTimeDisplay();
  showToast('Hour skipped.');
}

export function triggerEvent() {
  const phrase = eventPhrases[Math.floor(Math.random() * eventPhrases.length)];
  addEvent(`Divine event: ${phrase}`);
  showToast('Miracle unleashed.');
}
