// /src/game/GameEngine.ts

import { GameState, GameDate, Country } from '../types.js';

export class GameEngine {
    private gameState: GameState;
    private gameLoop: number | null = null;
    private lastUpdateTime: number = 0;
    private updateInterval: number = 500;

    constructor(gameState: GameState) {
        this.gameState = gameState;
    }

    public startGameLoop(onUpdate: () => void): void {
        const gameLoop = (currentTime: number) => {
            if (currentTime - this.lastUpdateTime >= this.updateInterval) {
                if (!this.gameState.isPaused) {
                    this.updateGame();
                }
                onUpdate();
                this.lastUpdateTime = currentTime;
            }
            this.gameLoop = requestAnimationFrame(gameLoop);
        };
        this.gameLoop = requestAnimationFrame(gameLoop);
    }

    public stopGameLoop(): void {
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = null;
        }
    }

    public setGameSpeed(speed: number): void {
        this.gameState.gameSpeed = speed;
        this.updateInterval = 500 / speed;
    }

    public togglePause(): void {
        this.gameState.isPaused = !this.gameState.isPaused;
    }

    private updateGame(): void {
        this.advanceDate();
        for (const country of this.gameState.countries.values()) {
            this.updateCountryEconomy(country);
            this.updateCountryPolitics(country);
        }
    }

    private advanceDate(): void {
        const date = this.gameState.currentDate;
        date.hour++;
        if (date.hour >= 24) {
            date.hour = 0;
            date.day++;
            const daysInMonth = this.getDaysInMonth(date.year, date.month);
            if (date.day > daysInMonth) {
                date.day = 1;
                date.month++;
                if (date.month > 12) {
                    date.month = 1;
                    date.year++;
                }
            }
        }
    }

    private getDaysInMonth(year: number, month: number): number {
        return new Date(year, month, 0).getDate();
    }

    private updateCountryEconomy(country: Country): void {
        if (country.gdp > 0) {
            const growthRate = country.economicGrowthRate ?? 0;
            const hourlyGrowthRate = growthRate / (365 * 24) / 100;
            country.gdp = (country.gdp ?? 0) * (1 + hourlyGrowthRate);
            if (country.gdp > 0 && country.population > 0) {
                country.gdpPerCapita = (country.gdp * 1000000000) / (country.population * 1000000);
            } else {
                country.gdpPerCapita = 0;
            }
        }
        const ppGain = country.politicalPowerGain ?? 0;
        country.politicalPower = (country.politicalPower ?? 0) + (ppGain / 24);
        country.politicalPower = Math.min(country.politicalPower, 999);
    }

    private updateCountryPolitics(country: Country): void {
        if (country.gdp > 0) {
            const growthRate = country.economicGrowthRate ?? 0;
            const currentStability = country.stability ?? 50;
            if (growthRate > 5) {
                country.stability = Math.min(100, currentStability + 0.01);
            } else if (growthRate < 0) {
                country.stability = Math.max(0, currentStability - 0.02);
            }
            const corruption = country.corruptionLevel ?? 0;
            if (corruption > 30) {
                country.politicalPowerGain = (country.politicalPowerGain ?? 0) * 0.999;
            }
        }
    }

    public getGameState(): GameState {
        return this.gameState;
    }

    public getCurrentMonth(): number {
        return this.gameState.currentDate.month;
    }
}