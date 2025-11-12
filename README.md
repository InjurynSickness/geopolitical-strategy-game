# World Politiks - HOI4-Style Strategy Game

A browser-based geopolitical strategy game inspired by Hearts of Iron IV, built with React, TypeScript, and HTML5 Canvas.

## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/InjurynSickness/worldpolitik.git
   cd worldpolitik
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

   The game will be available at: **http://localhost:3000/**

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `build/` directory.

## 🎮 Features

### Menu System
- **Main Menu** - HOI4-style interface with New Game, Load Game options
- **Country Selection** - Choose from 8 major powers:
  - France
  - United States
  - United Kingdom
  - German Reich
  - Italy
  - Japan
  - Soviet Union
  - Other countries
- **Figma-designed UI** - Professional HOI4-inspired aesthetics with amber/gold theme

### Game Features
- Custom HTML5 Canvas rendering engine
- Multi-layered map system (terrain, provinces, borders, rivers)
- Political map with country territories
- Camera controls (pan, zoom)
- Province interaction system
- Economic and political systems
- Event management
- Save/Load functionality

## 📁 Project Structure

```
worldpolitik/
├── src/
│   ├── App.tsx                    # Main React app
│   ├── main.tsx                   # Entry point
│   ├── menu-ui/                   # Figma-designed menu components
│   │   ├── components/            # Menu UI components
│   │   │   ├── SinglePlayerMenu.tsx
│   │   │   ├── CountrySelection.tsx
│   │   │   ├── LoadGameMenu.tsx
│   │   │   └── MenuButton.tsx
│   │   └── styles/
│   │       └── globals.css        # Figma design system
│   ├── game/                      # Core game logic
│   │   ├── GameEngine.ts
│   │   ├── GameStateInitializer.ts
│   │   └── SaveLoadManager.ts
│   ├── rendering/                 # Canvas rendering
│   │   ├── CanvasManager.ts
│   │   └── MapRenderer.ts
│   ├── ui/                        # In-game UI
│   ├── interaction/               # Input handling
│   ├── camera/                    # Camera system
│   └── types.ts                   # TypeScript definitions
├── public/                        # Static assets
├── terrain.png                    # Map textures
├── provinces.png                  # Province boundaries
├── rivers.png                     # River overlay
└── definition.csv                 # Province definitions
```

## 🛠️ Technology Stack

- **React 18.3.1** - UI framework
- **TypeScript** - Type-safe development
- **Vite 6.3.5** - Build tool and dev server
- **Tailwind CSS 4** - Styling framework
- **Radix UI** - Accessible component library
- **HTML5 Canvas** - Game rendering
- **Custom Game Engine** - Built from scratch

## 🎨 Design System

The UI uses a Figma-designed system with:
- HOI4-inspired aesthetics
- Amber/gold color scheme (#030213, amber-700, amber-900)
- Dark theme support
- Custom CSS variables for theming
- Professional military-style typography

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production

## 🐛 Troubleshooting

### ❗ "Cannot find module 'tailwindcss'" or "Cannot find module '@tailwindcss/postcss'"

**This is the most common issue!** It means dependencies aren't installed properly.

**Solution:**
1. Delete `node_modules` and `package-lock.json`:
   ```bash
   # Windows Command Prompt
   rmdir /s /q node_modules
   del package-lock.json

   # Windows PowerShell / Git Bash / Mac / Linux
   rm -rf node_modules package-lock.json
   ```

2. Reinstall everything:
   ```bash
   npm install
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```

### Blank white screen
This happens when CSS fails to load. Follow the steps above to fix dependencies.

### Dev server won't start (Permission errors on Linux/Mac)
Try running Vite directly:
```bash
node node_modules/vite/bin/vite.js
```

Or fix permissions:
```bash
chmod +x node_modules/.bin/vite
```

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For issues or questions, contact the repository owner.
