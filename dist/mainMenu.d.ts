import { GameDate } from './types.js';
export interface SaveSlotData {
    slotNumber: number;
    exists: boolean;
    saveTime?: string;
    gameDate?: GameDate;
    version?: string;
    countries?: number;
}
export declare class MainMenu {
    private container;
    private menuElement;
    private onNewGame;
    private onLoadGame;
    private onContinue?;
    constructor(container: HTMLElement, onNewGame: () => void, onLoadGame: (slotNumber: number) => void, onContinue?: () => void);
    private createMenu;
    private setupEventListeners;
    private showSaveSelector;
    private hideSaveSelector;
    private getSaveData;
    private createSaveSlotElement;
    private formatGameDate;
    private animateBackground;
    private showNotification;
    hide(): void;
    show(): void;
    destroy(): void;
}
