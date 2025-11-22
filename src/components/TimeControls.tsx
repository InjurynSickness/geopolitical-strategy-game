// Time controls UI - displays current date and speed controls

import React, { useEffect, useState } from 'react';
import { gameLoop, GameSpeed } from '../core/GameLoop.js';
import { timeSystem } from '../core/TimeSystem.js';
import { eventBus } from '../core/EventBus.js';

export function TimeControls() {
    const [currentDate, setCurrentDate] = useState(timeSystem.getFormattedDate());
    const [currentSpeed, setCurrentSpeed] = useState(gameLoop.getSpeed());
    const [isPaused, setIsPaused] = useState(gameLoop.isPaused());

    useEffect(() => {
        // Update date display on time changes
        const unsubDate = eventBus.on('day_passed', () => {
            setCurrentDate(timeSystem.getFormattedDate());
        });

        // Update speed display on speed changes
        const unsubSpeed = eventBus.on('speed_changed', (data: { newSpeed: GameSpeed }) => {
            setCurrentSpeed(data.newSpeed);
            setIsPaused(data.newSpeed === GameSpeed.PAUSED);
        });

        return () => {
            unsubDate();
            unsubSpeed();
        };
    }, []);

    const getSpeedLabel = (speed: GameSpeed): string => {
        switch (speed) {
            case GameSpeed.PAUSED: return 'Paused';
            case GameSpeed.SLOW: return '>';
            case GameSpeed.NORMAL: return '>>';
            case GameSpeed.FAST: return '>>>';
            case GameSpeed.VERY_FAST: return '>>>>';
            default: return '?';
        }
    };

    const getSpeedColor = (speed: GameSpeed): string => {
        if (speed === GameSpeed.PAUSED) return 'bg-red-600';
        if (speed === GameSpeed.SLOW) return 'bg-yellow-600';
        if (speed === GameSpeed.NORMAL) return 'bg-green-600';
        if (speed === GameSpeed.FAST) return 'bg-blue-600';
        return 'bg-purple-600';
    };

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto">
            <div className="bg-black/80 border-2 border-amber-600 rounded-lg px-6 py-3 flex items-center gap-4">
                {/* Date display */}
                <div className="text-amber-100 font-semibold text-lg">
                    {currentDate}
                </div>

                {/* Speed controls */}
                <div className="flex items-center gap-2 border-l-2 border-amber-600/50 pl-4">
                    {/* Decrease speed */}
                    <button
                        onClick={() => gameLoop.decreaseSpeed()}
                        className="px-3 py-1 bg-amber-900/50 hover:bg-amber-800 text-amber-100 rounded border border-amber-600/50 transition-colors"
                        title="Decrease speed (-)"
                    >
                        -
                    </button>

                    {/* Speed indicator */}
                    <div
                        className={`px-4 py-1 ${getSpeedColor(currentSpeed)} text-white rounded font-mono font-bold min-w-[80px] text-center`}
                        title={`Speed: ${GameSpeed[currentSpeed]}`}
                    >
                        {getSpeedLabel(currentSpeed)}
                    </div>

                    {/* Increase speed */}
                    <button
                        onClick={() => gameLoop.increaseSpeed()}
                        className="px-3 py-1 bg-amber-900/50 hover:bg-amber-800 text-amber-100 rounded border border-amber-600/50 transition-colors"
                        title="Increase speed (+)"
                    >
                        +
                    </button>

                    {/* Pause/Play button */}
                    <button
                        onClick={() => gameLoop.togglePause()}
                        className={`px-4 py-1 rounded border transition-colors font-bold ${
                            isPaused
                                ? 'bg-green-700 hover:bg-green-600 text-white border-green-500'
                                : 'bg-red-700 hover:bg-red-600 text-white border-red-500'
                        }`}
                        title="Pause/Resume (Space)"
                    >
                        {isPaused ? '▶ Play' : '⏸ Pause'}
                    </button>
                </div>

                {/* Keyboard hints */}
                <div className="text-amber-100/60 text-xs border-l-2 border-amber-600/50 pl-4">
                    Space: Pause | +/-: Speed | 1-4: Set Speed
                </div>
            </div>
        </div>
    );
}
