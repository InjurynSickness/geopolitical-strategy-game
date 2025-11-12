import React from 'react';
import { MainMenu } from './menu-ui/components/MainMenu';
import { SinglePlayerMenu } from './menu-ui/components/SinglePlayerMenu';
import { LoadGameMenu } from './menu-ui/components/LoadGameMenu';
import { CountrySelection } from './menu-ui/components/CountrySelection';
// --- IMPORT GAME TYPES ---
import { GameState } from './types.js';
import { LoadingScreen } from './loadingScreen.js';

// --- Define the props App will receive from main.tsx ---
interface AppProps {
  initializeGame: () => GameState;
  loadingScreen: LoadingScreen;
}

// --- App component ---
export default function App({ initializeGame, loadingScreen }: AppProps) {
  const [currentView, setCurrentView] = React.useState('main-menu');

  const onSinglePlayer = () => {
    setCurrentView('single-player');
  };

  const onNewGame = () => {
    setCurrentView('country-select');
  };

  const onLoadGame = () => {
    setCurrentView('load');
  };

  const onBackToMain = () => {
    setCurrentView('main-menu');
  };

  const onBackToSinglePlayer = () => {
    setCurrentView('single-player');
  };

  // --- START GAME function ---
  // This gets passed to CountrySelection
  const onStartGame = (country: any) => {
    console.log("Start Game clicked with country:", country);
    loadingScreen.show();
    loadingScreen.updateProgress(10, "Loading Game...");

    setTimeout(() => {
        initializeGame(); // Creates window.gameEngine
        loadingScreen.updateProgress(100, "Done");
        loadingScreen.hide();
        // Hide React UI
        const root = document.getElementById('root');
        if (root) (root as HTMLElement).style.display = 'none';
    }, 50);
  };

  // --- LOAD GAME function ---
  // This gets passed to LoadGameMenu
  const onConfirmLoad = () => {
     console.log("Load Game confirmed");
     loadingScreen.show();
     loadingScreen.updateProgress(10, "Initializing...");

     setTimeout(() => {
         initializeGame(); // Creates window.gameEngine
         (window as any).gameEngine?.showLoadDialog();
         loadingScreen.hide();
         // Hide React UI
         const root = document.getElementById('root');
         if (root) (root as HTMLElement).style.display = 'none';
     }, 50);
  };

  // --- Render the correct menu ---
  const renderView = () => {
    switch (currentView) {
      case 'main-menu':
        return (
          <MainMenu
            onSinglePlayer={onSinglePlayer}
            onInstructions={() => alert('Instructions coming soon!')}
            onOptions={() => alert('Options coming soon!')}
            onCredits={() => alert('Credits coming soon!')}
            onQuit={() => window.close()}
          />
        );

      case 'single-player':
        return <SinglePlayerMenu onNewGame={onNewGame} onLoadGame={onLoadGame} onBack={onBackToMain} />;

      case 'load':
        return <LoadGameMenu onBack={onBackToSinglePlayer} onConfirmLoad={onConfirmLoad} />;

      case 'country-select':
        return <CountrySelection onBack={onBackToSinglePlayer} onSelectCountry={onStartGame} />;

      default:
        return (
          <MainMenu
            onSinglePlayer={onSinglePlayer}
            onInstructions={() => alert('Instructions coming soon!')}
            onOptions={() => alert('Options coming soon!')}
            onCredits={() => alert('Credits coming soon!')}
            onQuit={() => window.close()}
          />
        );
    }
  };

  return renderView();
}