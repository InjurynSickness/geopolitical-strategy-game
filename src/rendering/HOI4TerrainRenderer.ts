/**
 * HOI4-style Terrain Renderer
 *
 * Implements the full HOI4 terrain rendering pipeline:
 * 1. Load terrain.bmp (8-bit indexed) - palette indices determine terrain type
 * 2. Load atlas0.png (2048x2048 texture atlas with 4x4 grid of 512x512 tiles)
 * 3. For each pixel, map palette index -> terrain type -> atlas tile -> sample texture
 * 4. Apply colormap tinting for realistic colors
 * 5. Apply water masking (water areas transparent so water colormap shows through)
 *
 * This is how HOI4 "paints" the map with actual terrain textures!
 */

import { logger } from '../utils/Logger.js';
import { getTerrainByIndex, getAtlasTileCoords, TERRAIN_TYPES } from '../config/terrainTypes.js';

export class HOI4TerrainRenderer {
    private terrainIndexedImage = new Image();
    private atlasImage = new Image();
    private colormapLandImage = new Image();
    private provincesImage = new Image(); // For water masking

    private terrainCanvas: HTMLCanvasElement;
    private terrainCtx: CanvasRenderingContext2D;
    private ready = false;

    // Tile settings for atlas (HOI4 standard: 4x4 grid of 512x512 tiles)
    private readonly TILE_SIZE = 512;
    private readonly TILES_PER_ROW = 4;

    constructor(
        private mapWidth: number,
        private mapHeight: number,
        private onReady: () => void
    ) {
        this.terrainCanvas = document.createElement('canvas');
        this.terrainCanvas.width = mapWidth;
        this.terrainCanvas.height = mapHeight;
        this.terrainCtx = this.terrainCanvas.getContext('2d', { willReadFrequently: true })!;
    }

    public async load(): Promise<void> {
        logger.info('HOI4TerrainRenderer', '🗺️ Loading HOI4-style terrain system...');

        // Load all required images
        await Promise.all([
            this.loadImage(this.terrainIndexedImage, './terrain_indexed.png', 'Terrain Index Map'),
            this.loadImage(this.atlasImage, './atlas0.png', 'Terrain Atlas'),
            this.loadImage(this.colormapLandImage, './colormap_land.png', 'Land Colormap'),
            this.loadImage(this.provincesImage, './provinces.png', 'Provinces (for water mask)')
        ]);

        logger.info('HOI4TerrainRenderer', '🎨 Generating terrain from atlas...');
        await this.generateTerrainFromAtlas();

        logger.info('HOI4TerrainRenderer', '🌊 Applying water mask...');
        this.applyWaterMask();

        logger.info('HOI4TerrainRenderer', '🎨 Applying colormap tinting...');
        this.applyColormapTinting();

        this.ready = true;
        this.onReady();
        logger.info('HOI4TerrainRenderer', '✅ HOI4 terrain rendering complete!');
    }

    private loadImage(img: HTMLImageElement, src: string, name: string): Promise<void> {
        return new Promise((resolve, reject) => {
            img.onload = () => {
                logger.info('HOI4TerrainRenderer', `✓ ${name} loaded: ${img.width}x${img.height}`);
                resolve();
            };
            img.onerror = (e) => {
                logger.error('HOI4TerrainRenderer', `✗ Failed to load ${name}`, e);
                reject(e);
            };
            img.src = src;
        });
    }

    /**
     * Generate terrain texture by sampling from atlas based on terrain indices
     *
     * This is the core HOI4 terrain rendering algorithm:
     * - Read each pixel's palette index from terrain.bmp
     * - Look up which atlas tile to use for that terrain type
     * - Sample from the atlas tile with tiling/wrapping
     * - Build final terrain texture
     */
    private async generateTerrainFromAtlas(): Promise<void> {
        try {
            const startTime = performance.now();

            // Create temp canvas to read terrain indices
            const terrainIndexCanvas = document.createElement('canvas');
            terrainIndexCanvas.width = this.mapWidth;
            terrainIndexCanvas.height = this.mapHeight;
            const terrainIndexCtx = terrainIndexCanvas.getContext('2d', { willReadFrequently: true })!;
            terrainIndexCtx.drawImage(this.terrainIndexedImage, 0, 0, this.mapWidth, this.mapHeight);
            const terrainIndexData = terrainIndexCtx.getImageData(0, 0, this.mapWidth, this.mapHeight);

            // Create temp canvas to read atlas pixels
            const atlasCanvas = document.createElement('canvas');
            atlasCanvas.width = this.atlasImage.width;
            atlasCanvas.height = this.atlasImage.height;
            const atlasCtx = atlasCanvas.getContext('2d', { willReadFrequently: true })!;
            atlasCtx.drawImage(this.atlasImage, 0, 0);
            const atlasData = atlasCtx.getImageData(0, 0, this.atlasImage.width, this.atlasImage.height);

            // Create output terrain texture
            const terrainData = this.terrainCtx.createImageData(this.mapWidth, this.mapHeight);

            let pixelsProcessed = 0;
            const totalPixels = this.mapWidth * this.mapHeight;
            const CHUNK_SIZE = 100; // Process 100 rows at a time, then yield

            // Process each pixel in the terrain map
            for (let y = 0; y < this.mapHeight; y++) {
                for (let x = 0; x < this.mapWidth; x++) {
                    const pixelIdx = (y * this.mapWidth + x) * 4;

                    // Read the terrain index from the indexed terrain image
                    // Since PNG may have converted indexed to RGB, we need to map RGB back to palette index
                    const r = terrainIndexData.data[pixelIdx];
                    const g = terrainIndexData.data[pixelIdx + 1];
                    const b = terrainIndexData.data[pixelIdx + 2];

                    // Get terrain type for this color
                    const terrainType = this.getTerrainTypeByRGB(r, g, b);

                    // Get atlas tile coordinates for this terrain type
                    const tileCoords = getAtlasTileCoords(terrainType.atlasIndex);

                    // Add variation to prevent obvious tiling pattern
                    // Use both map coordinates AND terrain RGB as seed for variation
                    // This creates natural-looking variation while keeping it deterministic
                    const variationSeed = (x * 73 + y * 151 + r + g + b) % 512;
                    const offsetX = (variationSeed * 7) % this.TILE_SIZE;
                    const offsetY = (variationSeed * 13) % this.TILE_SIZE;

                    // Sample from atlas with variation offset to break up tiling
                    const tileLocalX = (x + offsetX) % this.TILE_SIZE;
                    const tileLocalY = (y + offsetY) % this.TILE_SIZE;

                    const atlasSampleX = tileCoords.x + tileLocalX;
                    const atlasSampleY = tileCoords.y + tileLocalY;
                    const atlasSampleIdx = (atlasSampleY * this.atlasImage.width + atlasSampleX) * 4;

                    // Copy pixel from atlas to terrain
                    terrainData.data[pixelIdx] = atlasData.data[atlasSampleIdx];         // R
                    terrainData.data[pixelIdx + 1] = atlasData.data[atlasSampleIdx + 1]; // G
                    terrainData.data[pixelIdx + 2] = atlasData.data[atlasSampleIdx + 2]; // B
                    terrainData.data[pixelIdx + 3] = 255; // Full opacity (water mask applied later)

                    pixelsProcessed++;
                }

                // Log progress every 10%
                if (y % Math.floor(this.mapHeight / 10) === 0) {
                    const progress = Math.floor((pixelsProcessed / totalPixels) * 100);
                    logger.info('HOI4TerrainRenderer', `Progress: ${progress}%`);
                }

                // Yield to browser every CHUNK_SIZE rows to prevent blocking
                if (y % CHUNK_SIZE === 0) {
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
            }

            this.terrainCtx.putImageData(terrainData, 0, 0);

            const elapsed = performance.now() - startTime;
            logger.info('HOI4TerrainRenderer', `Terrain generated in ${elapsed.toFixed(0)}ms`);
        } catch (error) {
            logger.error('HOI4TerrainRenderer', 'Failed to generate terrain from atlas', error);
            throw error;
        }
    }

    /**
     * Map RGB color from terrain image back to terrain type
     * (PNG conversion may have converted indexed colors to RGB)
     */
    private getTerrainTypeByRGB(r: number, g: number, b: number) {
        // Check all terrain types for RGB match (exact match first)
        for (const t of TERRAIN_TYPES) {
            if (t.color.r === r && t.color.g === g && t.color.b === b) {
                return t;
            }
        }

        // If no exact match, find closest color (Euclidean distance)
        let closestTerrain = TERRAIN_TYPES[0];
        let minDistance = Infinity;

        for (const t of TERRAIN_TYPES) {
            const dr = t.color.r - r;
            const dg = t.color.g - g;
            const db = t.color.b - b;
            const distance = dr * dr + dg * dg + db * db;

            if (distance < minDistance) {
                minDistance = distance;
                closestTerrain = t;
            }
        }

        return closestTerrain;
    }

    /**
     * Make water provinces transparent so water colormap shows through
     */
    private applyWaterMask(): void {
        const provincesCanvas = document.createElement('canvas');
        provincesCanvas.width = this.mapWidth;
        provincesCanvas.height = this.mapHeight;
        const provincesCtx = provincesCanvas.getContext('2d', { willReadFrequently: true })!;
        provincesCtx.drawImage(this.provincesImage, 0, 0, this.mapWidth, this.mapHeight);
        const provincesData = provincesCtx.getImageData(0, 0, this.mapWidth, this.mapHeight);

        const terrainData = this.terrainCtx.getImageData(0, 0, this.mapWidth, this.mapHeight);

        let waterPixels = 0;
        let landPixels = 0;

        // Make water areas transparent (in provinces.bmp, water is typically black/dark)
        for (let i = 0; i < terrainData.data.length; i += 4) {
            const r = provincesData.data[i];
            const g = provincesData.data[i + 1];
            const b = provincesData.data[i + 2];

            // Ocean/water in provinces is typically very dark
            if (r < 10 && g < 10 && b < 10) {
                terrainData.data[i + 3] = 0;  // Make transparent
                waterPixels++;
            } else {
                landPixels++;
            }
        }

        this.terrainCtx.putImageData(terrainData, 0, 0);
        logger.info('HOI4TerrainRenderer', `Water mask applied - ${waterPixels} water, ${landPixels} land pixels`);
    }

    /**
     * Apply colormap tinting to terrain for realistic colors
     * Uses overlay blend mode for better color preservation (industry standard)
     */
    private applyColormapTinting(): void {
        const colormapCanvas = document.createElement('canvas');
        colormapCanvas.width = this.mapWidth;
        colormapCanvas.height = this.mapHeight;
        const colormapCtx = colormapCanvas.getContext('2d', { willReadFrequently: true })!;
        colormapCtx.drawImage(this.colormapLandImage, 0, 0, this.mapWidth, this.mapHeight);
        const colormapData = colormapCtx.getImageData(0, 0, this.mapWidth, this.mapHeight);

        const terrainData = this.terrainCtx.getImageData(0, 0, this.mapWidth, this.mapHeight);

        // Apply colormap using OVERLAY blend mode (better than multiply)
        // Overlay preserves both highlights and shadows while adding color
        for (let i = 0; i < terrainData.data.length; i += 4) {
            // Skip transparent pixels (water)
            if (terrainData.data[i + 3] === 0) continue;

            // Overlay blend for each channel
            // If base < 0.5: 2 * base * blend
            // If base >= 0.5: 1 - 2 * (1 - base) * (1 - blend)
            for (let c = 0; c < 3; c++) {
                const base = terrainData.data[i + c] / 255;
                const blend = colormapData.data[i + c] / 255;

                let result;
                if (base < 0.5) {
                    result = 2 * base * blend;
                } else {
                    result = 1 - 2 * (1 - base) * (1 - blend);
                }

                terrainData.data[i + c] = Math.floor(result * 255);
            }
        }

        // Apply brightness compensation to prevent darkening
        // Boost overall brightness by 15% to compensate for blend darkening
        for (let i = 0; i < terrainData.data.length; i += 4) {
            if (terrainData.data[i + 3] === 0) continue; // Skip transparent

            terrainData.data[i] = Math.min(255, terrainData.data[i] * 1.15);     // R
            terrainData.data[i + 1] = Math.min(255, terrainData.data[i + 1] * 1.15); // G
            terrainData.data[i + 2] = Math.min(255, terrainData.data[i + 2] * 1.15); // B
        }

        this.terrainCtx.putImageData(terrainData, 0, 0);
        logger.info('HOI4TerrainRenderer', 'Colormap tinting applied (overlay blend + brightness compensation)');
    }

    public getTerrainCanvas(): HTMLCanvasElement {
        return this.terrainCanvas;
    }

    public isReady(): boolean {
        return this.ready;
    }
}
