// Normal map generator from heightmap
// Converts heightmap grayscale values into RGB normal vectors for lighting calculations

import { logger } from '../utils/Logger.js';

export class NormalMapGenerator {
    /**
     * Generate a normal map from a heightmap
     * Normal maps encode surface normals as RGB values for lighting calculations
     *
     * @param heightmapCanvas - Canvas containing heightmap (grayscale, 0=low, 255=high)
     * @param strength - Normal map strength/intensity (default 1.0)
     * @returns Canvas containing the generated normal map
     */
    public static generate(
        heightmapCanvas: HTMLCanvasElement,
        strength: number = 1.0
    ): HTMLCanvasElement {
        const startTime = performance.now();

        const width = heightmapCanvas.width;
        const height = heightmapCanvas.height;

        // Read heightmap data
        const ctx = heightmapCanvas.getContext('2d')!;
        const heightData = ctx.getImageData(0, 0, width, height);

        // Create normal map canvas
        const normalCanvas = document.createElement('canvas');
        normalCanvas.width = width;
        normalCanvas.height = height;
        const normalCtx = normalCanvas.getContext('2d')!;
        const normalImageData = normalCtx.createImageData(width, height);

        // Generate normals using Sobel filter
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;

                // Sample neighboring heights (with edge wrapping)
                const h = {
                    tl: this.getHeight(heightData, x - 1, y - 1, width, height),
                    t:  this.getHeight(heightData, x,     y - 1, width, height),
                    tr: this.getHeight(heightData, x + 1, y - 1, width, height),
                    l:  this.getHeight(heightData, x - 1, y,     width, height),
                    c:  this.getHeight(heightData, x,     y,     width, height),
                    r:  this.getHeight(heightData, x + 1, y,     width, height),
                    bl: this.getHeight(heightData, x - 1, y + 1, width, height),
                    b:  this.getHeight(heightData, x,     y + 1, width, height),
                    br: this.getHeight(heightData, x + 1, y + 1, width, height),
                };

                // Sobel operator for gradients
                const dx = (h.tr + 2 * h.r + h.br) - (h.tl + 2 * h.l + h.bl);
                const dy = (h.bl + 2 * h.b + h.br) - (h.tl + 2 * h.t + h.tr);

                // Calculate normal vector
                // Z is always pointing up, X and Y are the gradients
                const nx = -dx * strength / 255;
                const ny = -dy * strength / 255;
                const nz = 1.0;

                // Normalize the vector
                const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
                const normX = nx / len;
                const normY = ny / len;
                const normZ = nz / len;

                // Encode normal as RGB (map from [-1,1] to [0,255])
                // R = X direction (East-West)
                // G = Y direction (North-South)
                // B = Z direction (Up)
                normalImageData.data[idx]     = Math.floor((normX * 0.5 + 0.5) * 255);
                normalImageData.data[idx + 1] = Math.floor((normY * 0.5 + 0.5) * 255);
                normalImageData.data[idx + 2] = Math.floor((normZ * 0.5 + 0.5) * 255);
                normalImageData.data[idx + 3] = 255; // Alpha
            }
        }

        normalCtx.putImageData(normalImageData, 0, 0);

        const elapsed = performance.now() - startTime;
        logger.info('NormalMapGenerator', `✅ Normal map generated in ${elapsed.toFixed(0)}ms`);

        return normalCanvas;
    }

    /**
     * Get height value at coordinates (with edge wrapping)
     */
    private static getHeight(
        imageData: ImageData,
        x: number,
        y: number,
        width: number,
        height: number
    ): number {
        // Wrap coordinates at edges
        x = (x + width) % width;
        y = (y + height) % height;

        const idx = (y * width + x) * 4;

        // Use red channel as height (grayscale so all channels are same)
        return imageData.data[idx];
    }
}
