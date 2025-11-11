// /src/borders/BorderMapBuilder.ts

import { provinceBorders } from '../provinceBorders.js';
import { Province } from '../provinceData.js';

export class BorderMapBuilder {
    constructor(
        private mapWidth: number,
        private mapHeight: number
    ) {}

    public buildBorderMap(
        borderCtx: CanvasRenderingContext2D,
        provinceOwnerMap: Map<string, string>,
        getProvinceAt: (x: number, y: number) => Province | null
    ): void {
        console.log("Building static COUNTRY border map...");

        borderCtx.clearRect(0, 0, this.mapWidth, this.mapHeight);
        
        borderCtx.fillStyle = '#000000';
        borderCtx.globalAlpha = 0.7;

        const neighbors = [[1, 0], [-1, 0], [0, 1], [0, -1]];

        for (const [provinceId, borders] of provinceBorders.entries()) {
            if (provinceId === 'OCEAN') continue;

            const owner1 = provinceOwnerMap.get(provinceId);
            
            for (const [x, y] of borders) {
                let isCountryBorder = false;

                for (const [dx, dy] of neighbors) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (nx < 0 || nx >= this.mapWidth || ny < 0 || ny >= this.mapHeight) continue;

                    const neighborProv = getProvinceAt(nx, ny);

                    if (!neighborProv || neighborProv.id === 'OCEAN') continue;
                    if (neighborProv.id === provinceId) continue;

                    const owner2 = provinceOwnerMap.get(neighborProv.id);

                    if (owner1 !== owner2) {
                        isCountryBorder = true;
                        break; 
                    }
                }

                if (isCountryBorder) {
                    borderCtx.fillRect(x, y, 2, 2);
                }
            }
        }
        
        borderCtx.globalAlpha = 1.0;
        console.log("Static COUNTRY border map is built.");
    }
}