// /src/political/PoliticalMapBuilder.ts

import { provinceColorMap } from '../provinceData.js';
import { CountryData } from '../countryData.js';
import { Color } from '../types.js';
import { waterProvinceIds } from '../waterProvinces.js';

export class PoliticalMapBuilder {
    // Ocean/sea color (standard blue)
    private static readonly WATER_COLOR: Color = [30, 77, 139]; // #1e4d8b

    constructor(
        private mapWidth: number,
        private mapHeight: number,
        private hiddenCtx: CanvasRenderingContext2D
    ) {}

    public buildPoliticalMap(
        politicalCtx: CanvasRenderingContext2D,
        provinceOwnerMap: Map<string, string>,
        allCountryData: Map<string, CountryData>
    ): void {
        console.log("Building political map texture...");
        console.log("Country data size:", allCountryData.size);

        politicalCtx.clearRect(0, 0, this.mapWidth, this.mapHeight);

        const imageData = this.hiddenCtx.getImageData(0, 0, this.mapWidth, this.mapHeight);
        const data = imageData.data;

        const politicalImageData = politicalCtx.createImageData(this.mapWidth, this.mapHeight);
        const polData = politicalImageData.data;

        // Pre-compute color cache: province color -> country RGB color
        // This avoids repeated Map lookups and hex-to-RGB conversions
        const colorCache = new Map<string, [number, number, number] | null>();

        let pixelsColored = 0;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            if (data[i+3] === 0) continue;

            const colorKey = `${r},${g},${b}`;

            // Check cache first
            let countryRgb = colorCache.get(colorKey);

            if (countryRgb === undefined) {
                // Not in cache, compute it
                const province = provinceColorMap.get(colorKey);

                if (province && province.id !== 'OCEAN') {
                    // Check if this is a water province first
                    if (waterProvinceIds.has(province.id)) {
                        // Water province - color it blue
                        countryRgb = PoliticalMapBuilder.WATER_COLOR;
                    } else {
                        // Land province - get country color
                        const ownerCountryId = provinceOwnerMap.get(province.id);
                        if (ownerCountryId) {
                            const country = allCountryData.get(ownerCountryId);
                            if (country) {
                                countryRgb = this.hexToRgb(country.color);
                            } else {
                                countryRgb = null;
                            }
                        } else {
                            countryRgb = null;
                        }
                    }
                } else {
                    countryRgb = null;
                }

                colorCache.set(colorKey, countryRgb);
            }

            if (countryRgb) {
                polData[i] = countryRgb[0];
                polData[i + 1] = countryRgb[1];
                polData[i + 2] = countryRgb[2];
                polData[i + 3] = 255;
                pixelsColored++;
            }
        }

        politicalCtx.putImageData(politicalImageData, 0, 0);
        console.log("Political map texture is built. Pixels colored:", pixelsColored);
    }

    private hexToRgb(hex: string): Color {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    }
}