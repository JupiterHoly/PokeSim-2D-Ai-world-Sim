# PokeSim 2D – AI World Simulator

A modular HTML5 canvas simulation that renders a living Pokémon-inspired world. Trainers and Pokémon roam a procedurally generated biome map while weather, day/night cycles, events, and prayers unfold autonomously. Players can observe the simulation or step into "God Mode" to intervene, create NPCs, and reshape the world.

## Features

- **Modular engine** powered by an event bus with dedicated managers for world time & weather, trainers, Pokémon ecosystems, UI, map rendering, and divine interventions.
- **Procedural tilemap** generated with Perlin noise biomes, fog-of-war exploration, zoom & camera controls, and minimap overlay.
- **Trainer AI** with personality-driven finite states (explore, travel, train, rest, battle), memory tracking, relationships, and autonomous movement.
- **Wild Pokémon ecology** with roaming behaviour influenced by weather, lightweight leveling & evolution logic, and spawning tied to biome distribution.
- **Dynamic UI** that mirrors simulation state, includes tabbed dashboards, activity ticker, prayer feed, and persistent world-saving to `localStorage`.
- **Enhanced God Mode** window for creating trainers, spawning Pokémon, fast-forwarding time, and triggering miracles or disasters.

## Getting Started

1. Open `index.html` in any modern browser. No build step is required.
2. Wait for the loading screen to disappear—the simulation starts automatically.
3. Use the left sidebar tabs to inspect the world, trainers, Pokémon, events, prayers, and settings.
4. Toggle music, God Mode, or save the world using the top-bar buttons. Saved data is stored in the browser under the `pokeSim2d_world` key.
5. In God Mode you can drag the control window, create trainers, spawn Pokémon, tweak weather, and fire divine interventions.

## Modding Hooks

The codebase is organized into discrete modules under `src/` so it’s easy to extend:

- Add new biomes in `src/data/biomes.js`.
- Expand the Pokédex in `src/data/pokemonSpecies.js`.
- Introduce new AI behaviours inside `src/entities/Trainer.js` or by extending `TrainerManager`.
- Register new UI panels by enhancing `UIManager`.

Enjoy shaping your own retro-inspired Pokémon simulation sandbox!
