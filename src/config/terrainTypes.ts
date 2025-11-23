/**
 * HOI4-style terrain type definitions
 * Maps terrain.bmp palette indices to atlas texture tiles
 *
 * Based on HOI4 terrain system:
 * - terrain.bmp is an 8-bit indexed bitmap (palette indices 0-255)
 * - Each palette index represents a graphical terrain type
 * - Each terrain type references a texture tile from the atlas
 * - Atlas is 2048x2048 divided into 4x4 grid = 512x512 per tile
 */

export interface TerrainType {
    /** Palette index from terrain.bmp (0-255) */
    colorIndex: number;
    /** RGB color value for identification */
    color: { r: number; g: number; b: number };
    /** Atlas tile index (0-15 for 4x4 grid) */
    atlasIndex: number;
    /** Terrain name for debugging */
    name: string;
}

/**
 * Atlas tile layout (4x4 grid):
 *
 *   0  |  1  |  2  |  3
 * -----+-----+-----+-----
 *   4  |  5  |  6  |  7
 * -----+-----+-----+-----
 *   8  |  9  | 10  | 11
 * -----+-----+-----+-----
 *  12  | 13  | 14  | 15
 */

export const TERRAIN_TYPES: TerrainType[] = [
    // Plains/grassland (green tones)
    { colorIndex: 0, color: { r: 86, g: 124, b: 27 }, atlasIndex: 0, name: 'plains' },
    { colorIndex: 4, color: { r: 6, g: 200, b: 11 }, atlasIndex: 0, name: 'plains_light' },
    { colorIndex: 17, color: { r: 132, g: 255, b: 0 }, atlasIndex: 0, name: 'plains_bright' },

    // Forest (dark green tones)
    { colorIndex: 1, color: { r: 0, g: 86, b: 6 }, atlasIndex: 1, name: 'forest' },
    { colorIndex: 20, color: { r: 58, g: 131, b: 82 }, atlasIndex: 1, name: 'forest_dense' },
    { colorIndex: 19, color: { r: 114, g: 137, b: 105 }, atlasIndex: 1, name: 'forest_light' },

    // Hills (brown tones)
    { colorIndex: 2, color: { r: 112, g: 74, b: 31 }, atlasIndex: 2, name: 'hills' },
    { colorIndex: 6, color: { r: 134, g: 84, b: 30 }, atlasIndex: 2, name: 'hills_light' },
    { colorIndex: 8, color: { r: 73, g: 59, b: 15 }, atlasIndex: 2, name: 'hills_dark' },

    // Desert/sand (tan/yellow tones)
    { colorIndex: 3, color: { r: 206, g: 169, b: 99 }, atlasIndex: 3, name: 'desert' },
    { colorIndex: 7, color: { r: 252, g: 255, b: 0 }, atlasIndex: 3, name: 'desert_sand' },
    { colorIndex: 13, color: { r: 240, g: 255, b: 0 }, atlasIndex: 3, name: 'desert_light' },

    // Mountains (gray tones)
    { colorIndex: 11, color: { r: 92, g: 83, b: 76 }, atlasIndex: 4, name: 'mountain' },

    // Snow/tundra (white tones)
    { colorIndex: 16, color: { r: 255, g: 255, b: 255 }, atlasIndex: 5, name: 'snow' },

    // Jungle/tropical (bright green)
    { colorIndex: 10, color: { r: 174, g: 0, b: 255 }, atlasIndex: 6, name: 'jungle' },
    { colorIndex: 5, color: { r: 255, g: 0, b: 24 }, atlasIndex: 6, name: 'jungle_dense' },

    // Water/ocean (blue tones)
    { colorIndex: 9, color: { r: 75, g: 147, b: 174 }, atlasIndex: 7, name: 'water' },
    { colorIndex: 15, color: { r: 8, g: 31, b: 130 }, atlasIndex: 7, name: 'water_deep' },

    // Urban/wasteland
    { colorIndex: 12, color: { r: 255, g: 0, b: 240 }, atlasIndex: 8, name: 'urban' },
    { colorIndex: 21, color: { r: 255, g: 0, b: 127 }, atlasIndex: 8, name: 'wasteland' },
];

/**
 * Create a lookup map: colorIndex -> TerrainType
 */
export const TERRAIN_BY_INDEX = new Map<number, TerrainType>(
    TERRAIN_TYPES.map(t => [t.colorIndex, t])
);

/**
 * Default terrain type for unmapped indices
 */
export const DEFAULT_TERRAIN: TerrainType = {
    colorIndex: 0,
    color: { r: 86, g: 124, b: 27 },
    atlasIndex: 0,
    name: 'default_plains'
};

/**
 * Get terrain type by palette index
 */
export function getTerrainByIndex(colorIndex: number): TerrainType {
    return TERRAIN_BY_INDEX.get(colorIndex) || DEFAULT_TERRAIN;
}

/**
 * Get atlas tile coordinates from tile index
 * Returns { x, y } in pixel coordinates for 2048x2048 atlas
 */
export function getAtlasTileCoords(atlasIndex: number): { x: number; y: number } {
    const TILES_PER_ROW = 4;
    const TILE_SIZE = 512;

    const tileX = atlasIndex % TILES_PER_ROW;
    const tileY = Math.floor(atlasIndex / TILES_PER_ROW);

    return {
        x: tileX * TILE_SIZE,
        y: tileY * TILE_SIZE
    };
}
