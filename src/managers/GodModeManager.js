import { pokemonSpecies } from '../data/pokemonSpecies.js';

export class GodModeManager {
  constructor(eventBus, worldManager, trainerManager, pokemonManager, mapManager, ui) {
    this.eventBus = eventBus;
    this.worldManager = worldManager;
    this.trainerManager = trainerManager;
    this.pokemonManager = pokemonManager;
    this.mapManager = mapManager;
    this.ui = ui;
    this.visible = false;
    this.dragState = null;
    this.activeTab = 'creation';
  }

  initialize() {
    this.buildWindow();
    this.bindToggle();
  }

  bindToggle() {
    this.ui.toggleGodModeButton.addEventListener('click', () => {
      this.visible = !this.visible;
      this.ui.godModeWindow.classList.toggle('hidden', !this.visible);
    });
  }

  buildWindow() {
    const root = this.ui.godModeWindow;
    root.innerHTML = `
      <header>
        <span>God Mode</span>
        <button id="close-god-mode">×</button>
      </header>
      <div class="tab-buttons">
        <button data-tab="creation" class="active">Creation</button>
        <button data-tab="world">World</button>
        <button data-tab="divine">Intervene</button>
      </div>
      <div class="tab-content" id="god-mode-content"></div>
    `;

    const close = root.querySelector('#close-god-mode');
    close.addEventListener('click', () => {
      this.visible = false;
      root.classList.add('hidden');
    });

    const buttons = root.querySelectorAll('.tab-buttons button');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((btn) => btn.classList.toggle('active', btn === button));
        this.activeTab = button.dataset.tab;
        this.renderTab();
      });
    });

    root.addEventListener('pointerdown', (event) => {
      if (event.target.tagName === 'BUTTON') return;
      this.dragState = { x: event.clientX, y: event.clientY, left: root.offsetLeft, top: root.offsetTop };
      root.setPointerCapture(event.pointerId);
    });

    root.addEventListener('pointermove', (event) => {
      if (!this.dragState) return;
      const dx = event.clientX - this.dragState.x;
      const dy = event.clientY - this.dragState.y;
      root.style.left = `${this.dragState.left + dx}px`;
      root.style.top = `${this.dragState.top + dy}px`;
    });

    root.addEventListener('pointerup', () => {
      this.dragState = null;
    });

    this.renderTab();
  }

  renderTab() {
    const container = document.getElementById('god-mode-content');
    switch (this.activeTab) {
      case 'creation':
        container.innerHTML = this.renderCreationTab();
        this.bindCreationForm(container);
        break;
      case 'world':
        container.innerHTML = this.renderWorldTab();
        this.bindWorldControls(container);
        break;
      case 'divine':
        container.innerHTML = this.renderDivineTab();
        this.bindDivineControls(container);
        break;
      default:
        break;
    }
  }

  renderCreationTab() {
    return `
      <form id="create-trainer-form" class="stack">
        <label>Name<input name="name" placeholder="Trainer name" /></label>
        <label>Hometown<input name="hometown" placeholder="Origin" /></label>
        <label>Party Size<input type="number" name="partySize" min="1" max="6" value="2" /></label>
        <button type="submit">Create Trainer</button>
      </form>
      <form id="spawn-pokemon-form" class="stack">
        <label>Pokémon<select name="species">${pokemonSpecies
          .map((species) => `<option value="${species.id}">${species.name}</option>`)
          .join('')}</select></label>
        <label>Level<input type="number" name="level" min="1" max="80" value="5" /></label>
        <button type="submit">Spawn Pokémon</button>
      </form>
    `;
  }

  bindCreationForm(container) {
    const trainerForm = container.querySelector('#create-trainer-form');
    trainerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(trainerForm);
      const trainer = this.trainerManager.createTrainer({
        name: formData.get('name') || undefined,
        hometown: formData.get('hometown') || undefined,
        partySize: Number.parseInt(formData.get('partySize'), 10) || 2,
      });
      this.eventBus.emit('godmode:trainerCreated', trainer);
      trainerForm.reset();
    });

    const pokemonForm = container.querySelector('#spawn-pokemon-form');
    pokemonForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(pokemonForm);
      const pokemon = this.pokemonManager.createPokemon(
        Number.parseInt(formData.get('species'), 10),
        Number.parseInt(formData.get('level'), 10)
      );
      this.eventBus.emit('godmode:pokemonSpawned', pokemon);
    });
  }

  renderWorldTab() {
    const snapshot = this.worldManager.getSnapshot();
    return `
      <div class="stack">
        <p>Current weather: ${snapshot.weather.label}</p>
        <button id="advance-time">Skip 3 Hours</button>
        <button id="change-weather">Change Weather</button>
      </div>
    `;
  }

  bindWorldControls(container) {
    container.querySelector('#advance-time').addEventListener('click', () => {
      this.worldManager.time += 180;
      this.eventBus.emit('world:clock', this.worldManager.getClock());
    });

    container.querySelector('#change-weather').addEventListener('click', () => {
      const options = ['clear', 'rain', 'storm', 'fog', 'heatwave', 'aurora'];
      const id = options[Math.floor(Math.random() * options.length)];
      this.worldManager.setWeather(id);
    });
  }

  renderDivineTab() {
    return `
      <div class="stack">
        <button id="heal-all">Heal All Pokémon</button>
        <button id="summon-miracle">Summon Miracle</button>
        <button id="trigger-storm">Trigger Storm</button>
      </div>
    `;
  }

  bindDivineControls(container) {
    container.querySelector('#heal-all').addEventListener('click', () => {
      for (const trainer of this.trainerManager.trainers) {
        trainer.party.forEach((pokemon) => (pokemon.health = 1));
      }
      this.eventBus.emit('godmode:healAll');
    });

    container.querySelector('#summon-miracle').addEventListener('click', () => {
      const event = {
        type: 'miracle',
        label: 'A soothing aurora calms the world.',
        timestamp: Date.now(),
      };
      this.worldManager.events.push(event);
      this.worldManager.events = this.worldManager.events.slice(-64);
      this.eventBus.emit('world:event', event);
    });

    container.querySelector('#trigger-storm').addEventListener('click', () => {
      const event = {
        type: 'disaster',
        label: 'A divine tempest sweeps the land!',
        timestamp: Date.now(),
      };
      this.worldManager.events.push(event);
      this.worldManager.events = this.worldManager.events.slice(-64);
      this.eventBus.emit('world:event', event);
    });
  }

  update() {}
}
