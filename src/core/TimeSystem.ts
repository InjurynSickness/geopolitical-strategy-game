// Time system for tracking game date and progression
// Handles days, months, years and fires time-based events

import { eventBus } from './EventBus.js';
import { logger } from '../utils/Logger.js';

export interface GameDate {
    year: number;
    month: number;   // 1-12
    day: number;     // 1-30 (simplified calendar)
}

export class TimeSystem {
    private static instance: TimeSystem;
    private currentDate: GameDate;
    private startDate: GameDate;

    // Calendar constants
    private readonly DAYS_PER_MONTH = 30;  // Simplified calendar
    private readonly MONTHS_PER_YEAR = 12;

    private constructor(startYear: number = 1936, startMonth: number = 1, startDay: number = 1) {
        this.startDate = { year: startYear, month: startMonth, day: startDay };
        this.currentDate = { ...this.startDate };
        logger.info('TimeSystem', `Time system initialized`, this.currentDate);
    }

    public static getInstance(): TimeSystem {
        if (!TimeSystem.instance) {
            TimeSystem.instance = new TimeSystem();
        }
        return TimeSystem.instance;
    }

    /**
     * Advance time by one day
     */
    public advanceDay(): void {
        this.currentDate.day++;

        if (this.currentDate.day > this.DAYS_PER_MONTH) {
            this.currentDate.day = 1;
            this.advanceMonth();
        }

        eventBus.emit('day_passed', this.getDate());
        logger.debug('TimeSystem', `Day advanced`, this.currentDate);
    }

    /**
     * Advance time by one month
     */
    private advanceMonth(): void {
        this.currentDate.month++;

        if (this.currentDate.month > this.MONTHS_PER_YEAR) {
            this.currentDate.month = 1;
            this.advanceYear();
        }

        eventBus.emit('month_passed', this.getDate());
        logger.info('TimeSystem', `Month advanced`, this.currentDate);
    }

    /**
     * Advance time by one year
     */
    private advanceYear(): void {
        this.currentDate.year++;
        eventBus.emit('year_passed', this.getDate());
        logger.info('TimeSystem', `Year advanced`, this.currentDate);
    }

    /**
     * Get current game date
     */
    public getDate(): Readonly<GameDate> {
        return { ...this.currentDate };
    }

    /**
     * Get formatted date string
     */
    public getFormattedDate(): string {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const month = monthNames[this.currentDate.month - 1];
        return `${month} ${this.currentDate.day}, ${this.currentDate.year}`;
    }

    /**
     * Get short date string (e.g., "1936.01.01")
     */
    public getShortDate(): string {
        const year = this.currentDate.year;
        const month = this.currentDate.month.toString().padStart(2, '0');
        const day = this.currentDate.day.toString().padStart(2, '0');
        return `${year}.${month}.${day}`;
    }

    /**
     * Get total days elapsed since start
     */
    public getDaysElapsed(): number {
        const daysSinceStart =
            (this.currentDate.year - this.startDate.year) * this.MONTHS_PER_YEAR * this.DAYS_PER_MONTH +
            (this.currentDate.month - this.startDate.month) * this.DAYS_PER_MONTH +
            (this.currentDate.day - this.startDate.day);

        return daysSinceStart;
    }

    /**
     * Set date (for loading saves)
     */
    public setDate(year: number, month: number, day: number): void {
        this.currentDate = { year, month, day };
        logger.info('TimeSystem', `Date set`, this.currentDate);
        eventBus.emit('date_changed', this.getDate());
    }

    /**
     * Reset to start date
     */
    public reset(): void {
        this.currentDate = { ...this.startDate };
        logger.info('TimeSystem', 'Time reset to start date', this.currentDate);
        eventBus.emit('date_changed', this.getDate());
    }
}

// Export singleton instance
export const timeSystem = TimeSystem.getInstance();
