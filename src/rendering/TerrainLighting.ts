// Terrain lighting calculator using normal maps
// Implements realistic lighting similar to HOI4's terrain rendering

import { logger } from '../utils/Logger.js';

export interface LightingConfig {
    // Directional light (sun)
    lightDirection: { x: number; y: number; z: number };
    lightColor: { r: number; g: number; b: number };
    lightIntensity: number;

    // Ambient light
    ambientColor: { r: number; g: number; b: number };
    ambientIntensity: number;

    // Specular (shininess)
    specularIntensity: number;
    shininess: number;
}

export class TerrainLighting {
    private static readonly DEFAULT_CONFIG: LightingConfig = {
        // Sun from top-left (typical HOI4 lighting)
        lightDirection: { x: -0.5, y: -0.5, z: 0.7 },
        lightColor: { r: 255, g: 250, b: 240 }, // Slightly warm sunlight
        lightIntensity: 0.8,

        // Cool ambient for shadows
        ambientColor: { r: 180, g: 190, b: 200 },
        ambientIntensity: 0.4,

        // Subtle specular
        specularIntensity: 0.15,
        shininess: 32,
    };

    /**
     * Apply lighting to terrain using normal map
     *
     * @param terrainCanvas - Base terrain texture (diffuse)
     * @param normalCanvas - Normal map
     * @param specularCanvas - Optional specular map (brightness = specularity)
     * @param roughnessCanvas - Optional roughness map (brightness = roughness)
     * @param config - Lighting configuration
     * @returns Lit terrain canvas
     */
    public static applyLighting(
        terrainCanvas: HTMLCanvasElement,
        normalCanvas: HTMLCanvasElement,
        specularCanvas?: HTMLCanvasElement,
        roughnessCanvas?: HTMLCanvasElement,
        config: Partial<LightingConfig> = {}
    ): HTMLCanvasElement {
        const startTime = performance.now();

        const cfg = { ...this.DEFAULT_CONFIG, ...config };

        const width = terrainCanvas.width;
        const height = terrainCanvas.height;

        // Read input data
        const terrainCtx = terrainCanvas.getContext('2d')!;
        const terrainData = terrainCtx.getImageData(0, 0, width, height);

        const normalCtx = normalCanvas.getContext('2d')!;
        const normalData = normalCtx.getImageData(0, 0, width, height);

        let specularData: ImageData | null = null;
        if (specularCanvas) {
            const ctx = specularCanvas.getContext('2d')!;
            specularData = ctx.getImageData(0, 0, width, height);
        }

        let roughnessData: ImageData | null = null;
        if (roughnessCanvas) {
            const ctx = roughnessCanvas.getContext('2d')!;
            roughnessData = ctx.getImageData(0, 0, width, height);
        }

        // Create output canvas
        const outputCanvas = document.createElement('canvas');
        outputCanvas.width = width;
        outputCanvas.height = height;
        const outputCtx = outputCanvas.getContext('2d')!;
        const outputData = outputCtx.createImageData(width, height);

        // Normalize light direction
        const lightLen = Math.sqrt(
            cfg.lightDirection.x ** 2 +
            cfg.lightDirection.y ** 2 +
            cfg.lightDirection.z ** 2
        );
        const lightDir = {
            x: cfg.lightDirection.x / lightLen,
            y: cfg.lightDirection.y / lightLen,
            z: cfg.lightDirection.z / lightLen,
        };

        // Process each pixel
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;

                // Get base terrain color
                const baseR = terrainData.data[idx];
                const baseG = terrainData.data[idx + 1];
                const baseB = terrainData.data[idx + 2];

                // Skip transparent pixels
                if (terrainData.data[idx + 3] === 0) {
                    outputData.data[idx] = 0;
                    outputData.data[idx + 1] = 0;
                    outputData.data[idx + 2] = 0;
                    outputData.data[idx + 3] = 0;
                    continue;
                }

                // Decode normal from RGB (map from [0,255] to [-1,1])
                const normal = {
                    x: (normalData.data[idx] / 255) * 2 - 1,
                    y: (normalData.data[idx + 1] / 255) * 2 - 1,
                    z: (normalData.data[idx + 2] / 255) * 2 - 1,
                };

                // Calculate diffuse lighting (Lambertian)
                const dotProduct = Math.max(
                    0,
                    normal.x * lightDir.x +
                    normal.y * lightDir.y +
                    normal.z * lightDir.z
                );

                // Diffuse component
                const diffuse = dotProduct * cfg.lightIntensity;

                // Specular component (Blinn-Phong)
                let specular = 0;
                if (specularData && dotProduct > 0) {
                    // View direction (camera looking down -Z)
                    const viewDir = { x: 0, y: 0, z: 1 };

                    // Half vector
                    const halfX = lightDir.x + viewDir.x;
                    const halfY = lightDir.y + viewDir.y;
                    const halfZ = lightDir.z + viewDir.z;
                    const halfLen = Math.sqrt(halfX ** 2 + halfY ** 2 + halfZ ** 2);
                    const halfDir = {
                        x: halfX / halfLen,
                        y: halfY / halfLen,
                        z: halfZ / halfLen,
                    };

                    // Specular intensity from map
                    const specularAmount = specularData.data[idx] / 255;

                    // Roughness affects shininess
                    let shininess = cfg.shininess;
                    if (roughnessData) {
                        const roughness = roughnessData.data[idx] / 255;
                        shininess *= (1 - roughness * 0.8); // More rough = less shiny
                    }

                    const specDot = Math.max(
                        0,
                        normal.x * halfDir.x +
                        normal.y * halfDir.y +
                        normal.z * halfDir.z
                    );

                    specular = Math.pow(specDot, shininess) * cfg.specularIntensity * specularAmount;
                }

                // Combine lighting
                const totalLight = cfg.ambientIntensity + diffuse + specular;

                // Apply lighting to base color
                outputData.data[idx]     = Math.min(255, baseR * totalLight);
                outputData.data[idx + 1] = Math.min(255, baseG * totalLight);
                outputData.data[idx + 2] = Math.min(255, baseB * totalLight);
                outputData.data[idx + 3] = terrainData.data[idx + 3]; // Preserve alpha
            }
        }

        outputCtx.putImageData(outputData, 0, 0);

        const elapsed = performance.now() - startTime;
        logger.info('TerrainLighting', `✅ Lighting applied in ${elapsed.toFixed(0)}ms`);

        return outputCanvas;
    }
}
