// Find all unassigned land provinces
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const DEFINITION_CSV = path.join(projectRoot, 'map-data/definition.csv');
const ASSIGNMENTS_PATH = path.join(projectRoot, 'src', 'provinceAssignments.ts');

// Parse definition.csv to get all land provinces
async function getLandProvinces() {
    return new Promise((resolve, reject) => {
        const landProvinces = new Set();

        fs.createReadStream(DEFINITION_CSV)
            .pipe(csv({ separator: ';', headers: ['id', 'r', 'g', 'b', 'type', 'coastal', 'terrain', 'continent'] }))
            .on('data', (row) => {
                const type = row.type.toLowerCase();
                // Skip water provinces and invalid entries
                if (type !== 'sea' && type !== 'lake' && type !== 'ocean' && row.id && row.id !== '0') {
                    landProvinces.add(row.id);
                }
            })
            .on('end', () => resolve(landProvinces))
            .on('error', reject);
    });
}

// Parse provinceAssignments.ts to get assigned provinces
function getAssignedProvinces() {
    const content = fs.readFileSync(ASSIGNMENTS_PATH, 'utf-8');
    const matches = content.matchAll(/\["(\d+)",\s*"([A-Z]{3})"\]/g);
    const assigned = new Map();

    for (const match of matches) {
        assigned.set(match[1], match[2]);
    }

    return assigned;
}

// Main
console.log('=== Finding Unassigned Land Provinces ===\n');

try {
    const landProvinces = await getLandProvinces();
    const assignedProvinces = getAssignedProvinces();

    console.log(`Total land provinces in definition.csv: ${landProvinces.size}`);
    console.log(`Assigned provinces: ${assignedProvinces.size}`);

    const unassigned = [];
    for (const provinceId of landProvinces) {
        if (!assignedProvinces.has(provinceId)) {
            unassigned.push(provinceId);
        }
    }

    console.log(`Unassigned land provinces: ${unassigned.length}\n`);

    if (unassigned.length > 0) {
        console.log('First 50 unassigned province IDs:');
        console.log(unassigned.slice(0, 50).join(', '));

        // Save full list to file
        const outputPath = path.join(projectRoot, 'unassigned_provinces.txt');
        fs.writeFileSync(outputPath, unassigned.join('\n'), 'utf-8');
        console.log(`\n✓ Full list saved to: ${outputPath}`);
    } else {
        console.log('✓ All land provinces are assigned!');
    }
} catch (error) {
    console.error('Error:', error);
    process.exit(1);
}
