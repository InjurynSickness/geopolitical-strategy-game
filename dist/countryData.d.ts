/**
 * Defines the basic data structure for a country,
 * primarily used for map rendering and identification.
 */
export interface CountryData {
    name: string;
    color: string;
}
/**
 * Master map of all countries in the game.
 * The key is the 3-letter ISO code (e.g., "USA")
 * The value is the CountryData object.
 */
export declare const countryData: Map<string, CountryData>;
