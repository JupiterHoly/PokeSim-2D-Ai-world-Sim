export class UIManager {
  constructor(eventBus, worldManager, trainerManager, pokemonManager, mapManager, ui) {
    this.eventBus = eventBus;
    this.worldManager = worldManager;
    this.trainerManager = trainerManager;
    this.pokemonManager = pokemonManager;
    this.mapManager = mapManager;
    this.ui = ui;
    this.activeTab = 'world';
  }

  initialize() {
    this.bindTabs();
    this.bindAudio();
    this.bindSave();
    this.renderWorldPanel();
    this.renderTrainerPanel();
    this.renderPokemonPanel();
    this.renderSettingsPanel();

    this.eventBus.on('world:clock', () => this.updateTopBar());
    this.eventBus.on('world:weatherChanged', () => this.updateTopBar());
    this.eventBus.on('world:event', (event) => this.pushTicker(event));
    this.eventBus.on('world:prayer', (prayer) => this.pushPrayer(prayer));
    this.eventBus.on('trainer:created', () => this.renderTrainerPanel());
    this.eventBus.on('simulation:initialized', () => {
      this.updateTopBar();
      this.renderWorldPanel();
    });
  }

  bindTabs() {
    this.ui.tabs.addEventListener('click', (event) => {
      if (!(event.target instanceof HTMLButtonElement)) return;
      const tab = event.target.dataset.tab;
      if (!tab) return;
      this.activeTab = tab;
      for (const button of this.ui.tabs.querySelectorAll('button')) {
        button.classList.toggle('active', button.dataset.tab === tab);
      }
      for (const panel of this.ui.tabPanels) {
        panel.classList.toggle('active', panel.id === `tab-${tab}`);
      }
      switch (tab) {
        case 'world':
          this.renderWorldPanel();
          break;
        case 'trainers':
          this.renderTrainerPanel();
          break;
        case 'pokemon':
          this.renderPokemonPanel();
          break;
        case 'events':
          this.renderEventPanel();
          break;
        case 'prayers':
          this.renderPrayerPanel();
          break;
        case 'settings':
          this.renderSettingsPanel();
          break;
        default:
          break;
      }
    });
  }

  bindAudio() {
    if (!this.ui.bgm) return;
    this.ui.toggleAudioButton.addEventListener('click', () => {
      if (this.ui.bgm.paused) {
        this.ui.bgm.volume = 0.35;
        this.ui.bgm.play();
        this.ui.toggleAudioButton.classList.add('active');
      } else {
        this.ui.bgm.pause();
        this.ui.toggleAudioButton.classList.remove('active');
      }
    });
  }

  bindSave() {
    this.ui.saveButton.addEventListener('click', () => {
      const payload = {
        world: this.worldManager.toJSON(),
        trainers: this.trainerManager.toJSON(),
        pokemon: this.pokemonManager.toJSON(),
        map: this.mapManager.toJSON(),
      };
      this.eventBus.emit('simulation:save', payload);
      this.pushTicker({ label: 'World state archived to local storage.' });
    });
  }

  updateTopBar() {
    const clock = this.worldManager.getClock();
    const weather = this.worldManager.weather;
    const pad = (value) => value.toString().padStart(2, '0');
    this.ui.timeReadout.textContent = `Day ${clock.day} - ${pad(clock.hours)}:${pad(clock.minutes)}`;
    this.ui.weatherReadout.textContent = weather?.label ?? 'Unknown';
    const lastEvent = this.worldManager.events[this.worldManager.events.length - 1];
    this.ui.eventReadout.textContent = lastEvent ? lastEvent.label : 'Awaiting events';
  }

  renderWorldPanel() {
    const panel = document.getElementById('tab-world');
    const snapshot = this.worldManager.getSnapshot();
    panel.innerHTML = `
      <h3>World Overview</h3>
      <p>Day ${snapshot.day}, time ${this.formatClock(snapshot.time)}</p>
      <p>Weather: ${snapshot.weather?.label ?? 'Unknown'}</p>
      <p>Trainers active: ${this.trainerManager.trainers.length}</p>
      <p>Wild Pokémon tracked: ${this.pokemonManager.wildPokemon.length}</p>
    `;
  }

  renderTrainerPanel() {
    const panel = document.getElementById('tab-trainers');
    const trainers = this.trainerManager.getTrainerSummaries();
    panel.innerHTML = `
      <h3>Trainer Roster</h3>
      <div class="list">
        ${trainers
          .map(
            (trainer) => `
              <article class="card">
                <header>
                  <h4>${trainer.name}</h4>
                  <span>${trainer.state}</span>
                </header>
                <p>Hometown: ${trainer.hometown}</p>
                <p>Energy: ${(trainer.energy * 100).toFixed(0)}%</p>
                <p>Fame: ${(trainer.fame * 100).toFixed(1)}</p>
                <ul>
                  ${trainer.party
                    .map((pokemon) => `<li>${pokemon.species} Lv.${pokemon.level}</li>`)
                    .join('')}
                </ul>
              </article>
            `
          )
          .join('')}
      </div>
    `;
  }

  renderPokemonPanel() {
    const panel = document.getElementById('tab-pokemon');
    panel.innerHTML = `
      <h3>Wild Pokémon Populations</h3>
      <p>Tracked species: ${this.pokemonManager.wildPokemon.length}</p>
      <ul>
        ${this.pokemonManager.wildPokemon
          .slice(0, 20)
          .map((pokemon) => `<li>${pokemon.species?.name ?? 'Unknown'} - Lv.${pokemon.level}</li>`)
          .join('')}
      </ul>
    `;
  }

  renderEventPanel() {
    const panel = document.getElementById('tab-events');
    panel.innerHTML = `
      <h3>Recent Events</h3>
      <ul>
        ${this.worldManager.events
          .slice(-10)
          .reverse()
          .map((event) => `<li>${event.label}</li>`)
          .join('')}
      </ul>
    `;
  }

  renderPrayerPanel() {
    const panel = document.getElementById('tab-prayers');
    panel.innerHTML = `
      <h3>Prayer Log</h3>
      <ul>
        ${this.worldManager.prayers
          .map((prayer) => `<li>${new Date(prayer.timestamp).toLocaleTimeString()}: ${prayer.text}</li>`)
          .join('')}
      </ul>
    `;
  }

  renderSettingsPanel() {
    const panel = document.getElementById('tab-settings');
    panel.innerHTML = `
      <h3>Display Options</h3>
      <div class="toggle"><span>Minimap</span><input type="checkbox" id="toggle-minimap" checked /></div>
      <div class="toggle"><span>Trainer Paths</span><input type="checkbox" id="toggle-trainer-paths" /></div>
    `;
    const minimapToggle = panel.querySelector('#toggle-minimap');
    minimapToggle.addEventListener('change', (event) => {
      this.ui.minimap.classList.toggle('hidden', !event.target.checked);
    });
  }

  pushTicker(event) {
    const entry = document.createElement('div');
    entry.textContent = event.label;
    this.ui.ticker.prepend(entry);
    while (this.ui.ticker.childElementCount > 6) {
      this.ui.ticker.removeChild(this.ui.ticker.lastElementChild);
    }
  }

  pushPrayer(prayer) {
    const entry = document.createElement('div');
    entry.textContent = prayer.text;
    this.ui.prayerFeed.prepend(entry);
    while (this.ui.prayerFeed.childElementCount > 6) {
      this.ui.prayerFeed.removeChild(this.ui.prayerFeed.lastElementChild);
    }
  }

  update() {
    if (!this.ui.infoPanel) return;
    const clock = this.worldManager.getClock();
    this.ui.infoPanel.innerHTML = `
      <h3>World Status</h3>
      <p>Day ${clock.day} ${clock.hours.toString().padStart(2, '0')}:${clock.minutes
        .toString()
        .padStart(2, '0')}</p>
      <p>Weather: ${this.worldManager.weather.label}</p>
      <p>Trainers: ${this.trainerManager.trainers.length}</p>
      <p>Wild Pokémon: ${this.pokemonManager.wildPokemon.length}</p>
    `;
  }

  render() {}

  formatClock(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
}
