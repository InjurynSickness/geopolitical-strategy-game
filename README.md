# Geopolitical Strategy Game

A modern geopolitical strategy game inspired by Hearts of Iron IV's Millennium Dawn mod and OpenFront's simplified combat system.

## Features (Current)

- **Interactive World Map**: Click to select countries (USA, China, Russia)
- **Real-time Economic Simulation**: GDP growth, political power generation
- **Time Controls**: Play/pause and speed controls (1x, 2x, 4x)
- **Country Information**: Detailed economic, political, and military stats
- **Basic AI**: Simple economic growth and political changes

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Build TypeScript**:
   ```bash
   npm run build
   ```

3. **Open the Game**:
   - Open `index.html` in your web browser
   - Or use a local server:
     ```bash
     npx http-server . -p 8080
     ```
   - Then visit `http://localhost:8080`

## Development

- **Watch Mode**: `npm run watch` (automatically recompiles on changes)
- **Build**: `npm run build`

## Project Structure

```
/src
  ├── main.ts          # Main game engine and entry point
  ├── types.ts         # TypeScript interfaces and types
  ├── map.ts           # Map rendering and interaction
  └── data.json        # Initial country and alliance data
├── index.html         # Main HTML file with UI
├── package.json       # Dependencies and scripts
└── tsconfig.json      # TypeScript configuration
```

## Current Gameplay

1. Click **Play** to start time progression
2. Use **speed controls** to adjust game speed
3. **Click on countries** (colored circles) to view their stats
4. Watch **GDP grow** and **political power accumulate** over time
5. Observe **stability changes** based on economic performance

## Next Development Steps

1. **Enhanced Map**: Real territory borders instead of circles
2. **Diplomacy System**: Trade agreements, alliances, relations
3. **Combat System**: OpenFront-style territorial conquest
4. **Political System**: Laws, advisors, government changes
5. **Resource Trading**: Complex economic interactions
6. **Random Events**: Economic crises, political upheaval

## Controls

- **Mouse**: Click countries to select, hover for highlight
- **Time Controls**: Play/Pause, 1x/2x/4x speed
- **Sidebar**: Displays selected country information

## Data Notes

- All economic data is from the year 2000
- GDP values are in trillions USD
- Population in millions
- Military spending in billions USD
- Political power system based on HoI4 mechanics

## Future Features

- International organizations (UN, NATO, EU)
- Research trees (civilian and military)
- Nuclear weapons development
- Cyber warfare capabilities
- Economic sanctions and trade wars
- Immigration and border policies
- Climate change effects
- Space race and satellite infrastructure