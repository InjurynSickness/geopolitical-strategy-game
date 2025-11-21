// Find all colonial territories (owner != modern country based on cores)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const STATES_DIR = path.join(projectRoot, 'modern states');

// Colonial powers that should have decolonized by 2000
const COLONIAL_POWERS = ['POR', 'FRA', 'ENG', 'NET', 'BEL', 'ITA', 'SPA'];

// Parse a single state file
function parseStateFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract state ID
    const idMatch = content.match(/id\s*=\s*(\d+)/);
    if (!idMatch) return null;

    const stateId = idMatch[1];

    // Extract owner
    const ownerMatch = content.match(/owner\s*=\s*([A-Z]{3})/);
    if (!ownerMatch) return null;

    const owner = ownerMatch[1];

    // Extract all add_core_of tags
    const coreMatches = content.matchAll(/add_core_of\s*=\s*([A-Z]{3})/g);
    const cores = [];
    for (const match of coreMatches) {
        cores.push(match[1]);
    }

    // Extract provinces
    const provincesMatch = content.match(/provinces\s*=\s*\{([^}]+)\}/);
    const provinces = [];
    if (provincesMatch) {
        const provinceIds = provincesMatch[1].trim().split(/\s+/);
        provinces.push(...provinceIds);
    }

    return { stateId, owner, cores, provinces };
}

// Main
console.log('=== Finding Colonial Territories ===\n');

try {
    const files = fs.readdirSync(STATES_DIR).filter(f => f.endsWith('.txt'));
    const colonialTerritories = [];

    for (const file of files) {
        const filePath = path.join(STATES_DIR, file);
        const data = parseStateFile(filePath);

        if (!data) continue;

        const { stateId, owner, cores, provinces } = data;

        // Check if owned by colonial power but has different core
        if (COLONIAL_POWERS.includes(owner) && cores.length > 0) {
            // If any core is different from owner, it's likely a colonial territory
            const differentCores = cores.filter(c => c !== owner);

            if (differentCores.length > 0) {
                colonialTerritories.push({
                    file,
                    stateId,
                    owner,
                    cores: differentCores,
                    provinces
                });
            }
        }
    }

    console.log(`Found ${colonialTerritories.length} colonial territories:\n`);

    for (const territory of colonialTerritories) {
        console.log(`State ${territory.stateId}: ${territory.file}`);
        console.log(`  Owner: ${territory.owner}`);
        console.log(`  Cores: ${territory.cores.join(', ')}`);
        console.log(`  Provinces: ${territory.provinces.length} provinces`);
        console.log(`  Suggested: ${territory.owner} → ${territory.cores[0]}`);
        console.log('');
    }

    // Generate reassignments map
    console.log('\n=== Suggested COLONIAL_REASSIGNMENTS ===\n');
    console.log('const COLONIAL_REASSIGNMENTS = {');
    for (const territory of colonialTerritories) {
        const suggested = territory.cores[0];
        console.log(`    '${territory.stateId}': '${suggested}',  // ${territory.file.replace('.txt', '')} (${territory.owner} → ${suggested})`);
    }
    console.log('};');

} catch (error) {
    console.error('Error:', error);
    process.exit(1);
}
