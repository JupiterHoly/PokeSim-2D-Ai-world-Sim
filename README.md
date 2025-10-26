# Unofficial Poke Sim

This project renders a retro-inspired Pokémon world simulation with autonomous trainers, prayers, and a tile-inspired canvas map.

## Running locally

Open `index.html` in any modern browser. All assets load locally and the audio stream is pulled from a CDN.

## Project structure

- `index.html` – base layout, loader, sidebar, canvases, modals, and audio element.
- `styles/main.css` – retro UI theme, loader animation, sidebar, map, modal, and toast styling.
- `js/config.js` – shared configuration constants and weather definitions.
- `js/state.js` – central simulation state and helpers for adjusting runtime config.
- `js/data.js` – seed data for trainers, Pokémon, events, and helper factories.
- `js/ui.js` – sidebar/tab controls, stat rendering, toast handling, and display updates.
- `js/world.js` – simulation loop, tick logic, and seed helpers.
- `js/map.js` – canvas world renderer, minimap, and camera controls.
- `js/neural.js` – animated neural network canvas for flair.
- `js/godMode.js` – modal workflows and god-mode actions.
- `js/main.js` – bootstraps loading, initializes modules, and exposes UI handlers.

## Features

- Animated loading screen with floating Pokéball and sparkles.
- Modular JS architecture for world ticking, map rendering, and UI updates.
- God Mode controls to create trainers/NPCs, spawn Pokémon, alter weather, and trigger events.
- Responsive layout with minimap toggle, prayers/events feeds, and neural visualizer.

