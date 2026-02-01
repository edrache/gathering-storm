# Gathering Storm - Digital Tabletop

**Gathering Storm** is a digital tabletop application designed to facilitate the play of a community-building role-playing game. It provides a visual and interactive environment for players to track their progress, draw cards, and manage the game state.

## Features

- **Interactive Map**: A Leaflet-based map interface with customizable filters and drawing capabilities.
- **Phase Management**: Step-by-step guidance through the game phases with bilingual (EN/PL) support.
- **Oracle Deck**: A built-in system for drawing cards and triggering events based on the game's mechanics.
- **Community Tracking**: UI for managing player roles and hidden information.
- **Customizable Aesthetics**: Map settings for parchment-like filters (sepia, contrast, brightness).

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, and JavaScript.
- **Maps**: [Leaflet.js](https://leafletjs.com/) for the interactive map engine.
- **Fonts**: Playfair Display, Courier Prime, and Inter from Google Fonts.

## How to Run

Simply open `index.html` in any modern web browser. No backend server is required as it runs entirely client-side.

## Project Structure

- `index.html`: The main entry point and UI structure.
- `app.js`: Core game logic, state management, and event handling.
- `data.js`: Bilingual game content, including character data, oracle tables, and phase descriptions.
- `style.css`: Visual styling and layout.
- `map_config.js/html`: Advanced configuration for the map appearance.

## License

This project is for personal RPG sessions. Rules are based on the "Gathering Storm" system.