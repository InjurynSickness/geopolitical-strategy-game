// Extract all water province IDs from definition.csv and generate a TypeScript Set
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const DEFINITION_CSV = path.join(projectRoot, 'map-data/definition.csv');
const OUTPUT_PATH = path.join(projectRoot, 'src', 'waterProvinces.ts');

// Parse definition.csv to get all water provinces
async function getWaterProvinces() {
    return new Promise((resolve, reject) => {
        const waterProvinces = new Set();

        fs.createReadStream(DEFINITION_CSV)
            .pipe(csv({ separator: ';', headers: ['id', 'r', 'g', 'b', 'type', 'coastal', 'terrain', 'continent'] }))
            .on('data', (row) => {
                const type = row.type.toLowerCase();
                // Include all water types
                if (type === 'sea' || type === 'lake' || type === 'ocean') {
                    if (row.id && row.id !== '0') {
                        waterProvinces.add(row.id);
                    }
                }
            })
            .on('end', () => resolve(waterProvinces))
            .on('error', reject);
    });
}

// Main
console.log('=== Extracting Water Provinces ===\n');

try {
    const waterProvinces = await getWaterProvinces();
    const sortedIds = Array.from(waterProvinces).sort((a, b) => parseInt(a) - parseInt(b));

    console.log(`Total water provinces: ${waterProvinces.size}`);
    console.log(`First 10: ${sortedIds.slice(0, 10).join(', ')}`);
    console.log(`Last 10: ${sortedIds.slice(-10).join(', ')}`);

    // Generate TypeScript file
    const timestamp = new Date().toISOString();

    const output = `// Auto-generated from definition.csv
// Generated on: ${timestamp}
// Source: definition.csv
//
// Total water provinces: ${waterProvinces.size}
// Includes: sea, lake, ocean

/**
 * Set of all water province IDs (sea, lake, ocean)
 * Used to render water provinces in blue on the political map
 */
export const waterProvinceIds = new Set<string>([
${sortedIds.map(id => `    "${id}"`).join(',\n')}
]);
`;

    fs.writeFileSync(OUTPUT_PATH, output, 'utf-8');
    console.log(`\n✓ Written to: ${OUTPUT_PATH}`);
    console.log(`✓ ${waterProvinces.size} water province IDs exported`);

} catch (error) {
    console.error('Error:', error);
    process.exit(1);
}
