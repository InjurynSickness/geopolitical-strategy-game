// /src/political/PoliticalMapBuilder.ts

import { provinceColorMap } from '../provinceData.js';
import { CountryData } from '../countryData.js';
import { Color } from '../types.js';

export class PoliticalMapBuilder {
    constructor(
        private mapWidth: number,
        private mapHeight: number,
        private hiddenCtx: CanvasRenderingContext2D,
        private allCountryData: Map<string, CountryData>
    ) {}

    public buildPoliticalMap(
        politicalCtx: CanvasRenderingContext2D,
        provinceOwnerMap: Map<string, string>
    ): void {
        console.log("Building political map texture...");

        politicalCtx.clearRect(0, 0, this.mapWidth, this.mapHeight);
        
        const imageData = this.hiddenCtx.getImageData(0, 0, this.mapWidth, this.mapHeight);
        const data = imageData.data;
        
        const politicalImageData = politicalCtx.createImageData(this.mapWidth, this.mapHeight);
        const polData = politicalImageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            if (data[i+3] === 0) continue;

            const colorKey = `${r},${g},${b}`;
            const province = provinceColorMap.get(colorKey);
            
            if (province && province.id !== 'OCEAN') {
                const ownerCountryId = provinceOwnerMap.get(province.id);
                
                if (ownerCountryId) {
                    const country = this.allCountryData.get(ownerCountryId);
                    if (country) {
                        const countryColor = this.hexToRgb(country.color);
                        polData[i] = countryColor[0];
                        polData[i + 1] = countryColor[1];
                        polData[i + 2] = countryColor[2];
                        polData[i + 3] = 255;
                    }
                } 
            }
        }
        
        politicalCtx.putImageData(politicalImageData, 0, 0);
        console.log("Political map texture is built.");
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