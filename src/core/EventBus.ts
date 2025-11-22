// Central event bus for pub/sub messaging
// Decouples all game systems - any system can emit events, any system can listen

import { logger } from '../utils/Logger.js';

export type EventCallback = (data?: any) => void;

export class EventBus {
    private static instance: EventBus;
    private listeners: Map<string, EventCallback[]> = new Map();

    private constructor() {
        logger.info('EventBus', 'Event bus initialized');
    }

    public static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    /**
     * Subscribe to an event
     * @param event - Event name
     * @param callback - Function to call when event is emitted
     * @returns Unsubscribe function
     */
    public on(event: string, callback: EventCallback): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }

        this.listeners.get(event)!.push(callback);
        logger.debug('EventBus', `Subscribed to event: ${event}`);

        // Return unsubscribe function
        return () => {
            const callbacks = this.listeners.get(event);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                    logger.debug('EventBus', `Unsubscribed from event: ${event}`);
                }
            }
        };
    }

    /**
     * Subscribe to an event only once
     * @param event - Event name
     * @param callback - Function to call when event is emitted (once)
     */
    public once(event: string, callback: EventCallback): void {
        const onceCallback = (data?: any) => {
            callback(data);
            this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    }

    /**
     * Unsubscribe from an event
     * @param event - Event name
     * @param callback - Callback to remove
     */
    public off(event: string, callback: EventCallback): void {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
                logger.debug('EventBus', `Unsubscribed from event: ${event}`);
            }
        }
    }

    /**
     * Emit an event
     * @param event - Event name
     * @param data - Data to pass to listeners
     */
    public emit(event: string, data?: any): void {
        const callbacks = this.listeners.get(event);
        if (callbacks && callbacks.length > 0) {
            logger.debug('EventBus', `Emitting event: ${event}`, { listeners: callbacks.length, data });
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    logger.error('EventBus', `Error in event handler for ${event}`, error);
                }
            });
        }
    }

    /**
     * Remove all listeners for an event
     * @param event - Event name
     */
    public removeAllListeners(event?: string): void {
        if (event) {
            this.listeners.delete(event);
            logger.debug('EventBus', `Removed all listeners for event: ${event}`);
        } else {
            this.listeners.clear();
            logger.warn('EventBus', 'Removed ALL event listeners');
        }
    }

    /**
     * Get count of listeners for an event
     */
    public getListenerCount(event: string): number {
        return this.listeners.get(event)?.length || 0;
    }
}

// Export singleton instance
export const eventBus = EventBus.getInstance();
