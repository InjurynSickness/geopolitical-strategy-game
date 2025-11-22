// Enhanced HOI4-style terrain renderer
// Implements full layered terrain system: heightmap → normal map → lighting → final output

import { logger } from '../utils/Logger.js';
import { NormalMapGenerator } from './NormalMapGenerator.js';
import { TerrainLighting, LightingConfig } from './TerrainLighting.js';

export class EnhancedTerrainRenderer {
    private terrainCanvas: HTMLCanvasElement;
    private heightmapCanvas: HTMLCanvasElement;
    private normalMapCanvas?: HTMLCanvasElement;
    private litTerrainCanvas?: HTMLCanvasElement;
    private ready = false;

    constructor(
        private mapWidth: number,
        private mapHeight: number,
        private onReady: () => void
    ) {
        this.terrainCanvas = document.createElement('canvas');
        this.terrainCanvas.width = mapWidth;
        this.terrainCanvas.height = mapHeight;

        this.heightmapCanvas = document.createElement('canvas');
        this.heightmapCanvas.width = mapWidth;
        this.heightmapCanvas.height = mapHeight;
    }

    /**
     * Load and process terrain with full HOI4-style rendering
     */
    public async load(): Promise<void> {
        logger.info('EnhancedTerrainRenderer', '🗺️ Loading HOI4-style terrain system...');

        // Load base images
        await this.loadImages();

        // Generate normal map from heightmap
        logger.info('EnhancedTerrainRenderer', '🔨 Generating normal map from heightmap...');
        this.normalMapCanvas = NormalMapGenerator.generate(
            this.heightmapCanvas,
            1.5 // Strength - adjust for more/less pronounced terrain
        );

        // Apply lighting using normal map
        logger.info('EnhancedTerrainRenderer', '💡 Applying lighting to terrain...');
        this.litTerrainCanvas = TerrainLighting.applyLighting(
            this.terrainCanvas,
            this.normalMapCanvas,
            undefined, // No specular map yet
            undefined, // No roughness map yet
            {
                // HOI4-style lighting from top-left
                lightDirection: { x: -0.6, y: -0.6, z: 0.8 },
                lightIntensity: 0.75,
                ambientIntensity: 0.45,
                specularIntensity: 0.1,
            }
        );

        this.ready = true;
        this.onReady();
        logger.info('EnhancedTerrainRenderer', '✅ Enhanced terrain rendering complete!');
    }

    private async loadImages(): Promise<void> {
        const terrainImg = new Image();
        const heightmapImg = new Image();

        await Promise.all([
            this.loadImage(terrainImg, './terrain.png', 'Terrain'),
            this.loadImage(heightmapImg, './heightmap.png', 'Heightmap')
        ]);

        // Draw to canvases
        const terrainCtx = this.terrainCanvas.getContext('2d')!;
        terrainCtx.drawImage(terrainImg, 0, 0, this.mapWidth, this.mapHeight);

        const heightmapCtx = this.heightmapCanvas.getContext('2d')!;
        heightmapCtx.drawImage(heightmapImg, 0, 0, this.mapWidth, this.mapHeight);
    }

    private loadImage(img: HTMLImageElement, src: string, name: string): Promise<void> {
        return new Promise((resolve, reject) => {
            img.onload = () => {
                logger.info('EnhancedTerrainRenderer', `✓ ${name} loaded: ${img.width}x${img.height}`);
                resolve();
            };
            img.onerror = (e) => {
                logger.error('EnhancedTerrainRenderer', `✗ Failed to load ${name}`, e);
                reject(e);
            };
            img.src = src;
        });
    }

    /**
     * Get the final lit terrain canvas for rendering
     */
    public getTerrainCanvas(): HTMLCanvasElement {
        return this.litTerrainCanvas || this.terrainCanvas;
    }

    /**
     * Get the normal map (for debugging/visualization)
     */
    public getNormalMapCanvas(): HTMLCanvasElement | undefined {
        return this.normalMapCanvas;
    }

    /**
     * Get the heightmap canvas (for debugging/visualization)
     */
    public getHeightmapCanvas(): HTMLCanvasElement {
        return this.heightmapCanvas;
    }

    public isReady(): boolean {
        return this.ready;
    }

    /**
     * Update lighting configuration and re-render
     */
    public updateLighting(config: Partial<LightingConfig>): void {
        if (!this.normalMapCanvas) {
            logger.warn('EnhancedTerrainRenderer', 'Cannot update lighting - normal map not generated');
            return;
        }

        logger.info('EnhancedTerrainRenderer', '💡 Updating lighting...');
        this.litTerrainCanvas = TerrainLighting.applyLighting(
            this.terrainCanvas,
            this.normalMapCanvas,
            undefined,
            undefined,
            config
        );
    }
}
