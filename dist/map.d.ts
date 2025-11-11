import { Country } from './types.js';
export declare class MapRenderer {
    private canvas;
    private ctx;
    private countries;
    private selectedCountryId;
    private hoveredCountryId;
    private onCountrySelect;
    private camera;
    private isDragging;
    private lastMousePos;
    constructor(canvas: HTMLCanvasElement, onCountrySelect: (countryId: string) => void);
    private setupEventListeners;
    private resizeCanvas;
    private getCountryAtPosition;
    updateCountries(countries: Map<string, Country>): void;
    setSelectedCountry(countryId: string | null): void;
    render(): void;
    private drawGrid;
    private drawCountry;
    private drawCountryLabel;
    private drawUI;
    private lightenColor;
}
