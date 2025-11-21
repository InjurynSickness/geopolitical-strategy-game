// Parse HOI4 state files to generate province-to-country assignments
// This script reads HOI4 history/states/*.txt files and extracts province ownership
//
// Usage: node scripts/parse-hoi4-states.js [states-directory]
//
// Example: node scripts/parse-hoi4-states.js ./hoi4-states

import fs from 'fs';
import path from 'path';

const statesDir = process.argv[2] || './states';

console.log('HOI4 State Parser');
console.log('=================\n');
console.log(`Reading state files from: ${statesDir}\n`);

// Map of province ID -> country ISO code
const provinceOwnership = new Map();

// Statistics
let filesProcessed = 0;
let totalProvinces = 0;
let statesParsed = 0;

function parseStateFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');

        // Extract state ID
        const stateIdMatch = content.match(/id\s*=\s*(\d+)/);
        if (!stateIdMatch) {
            console.warn(`  ⚠ No state ID found in ${path.basename(filePath)}`);
            return null;
        }
        const stateId = stateIdMatch[1];

        // Extract provinces list
        const provincesMatch = content.match(/provinces\s*=\s*\{([^}]+)\}/);
        if (!provincesMatch) {
            console.warn(`  ⚠ No provinces found in state ${stateId}`);
            return null;
        }

        const provinceIds = provincesMatch[1]
            .trim()
            .split(/\s+/)
            .filter(id => id && !isNaN(id))
            .map(id => id.trim());

        if (provinceIds.length === 0) {
            console.warn(`  ⚠ Empty provinces list in state ${stateId}`);
            return null;
        }

        // Extract owner - look for the most recent owner in history
        // Format: owner = TAG or history={ owner = TAG }
        let owner = null;

        // Try direct owner field first
        const directOwnerMatch = content.match(/owner\s*=\s*([A-Z]{3})/g);
        if (directOwnerMatch && directOwnerMatch.length > 0) {
            // Get the last owner mentioned (most recent)
            const lastOwner = directOwnerMatch[directOwnerMatch.length - 1];
            const ownerTag = lastOwner.match(/owner\s*=\s*([A-Z]{3})/)[1];
            owner = ownerTag;
        }

        if (!owner) {
            console.warn(`  ⚠ No owner found for state ${stateId} in ${path.basename(filePath)}`);
            return null;
        }

        return {
            stateId,
            owner,
            provinces: provinceIds,
            fileName: path.basename(filePath)
        };

    } catch (error) {
        console.error(`  ✗ Error parsing ${path.basename(filePath)}:`, error.message);
        return null;
    }
}

function main() {
    // Check if states directory exists
    if (!fs.existsSync(statesDir)) {
        console.error(`❌ Error: Directory '${statesDir}' not found!`);
        console.error(`\nPlease provide the path to your HOI4 states directory.`);
        console.error(`Example: node scripts/parse-hoi4-states.js ./history/states`);
        process.exit(1);
    }

    // Read all .txt files in the states directory
    const files = fs.readdirSync(statesDir)
        .filter(f => f.endsWith('.txt'))
        .sort();

    if (files.length === 0) {
        console.error(`❌ Error: No .txt files found in '${statesDir}'`);
        process.exit(1);
    }

    console.log(`Found ${files.length} state files\n`);
    console.log('Parsing states...\n');

    // Parse each state file
    for (const file of files) {
        const filePath = path.join(statesDir, file);
        filesProcessed++;

        const state = parseStateFile(filePath);

        if (state) {
            statesParsed++;
            console.log(`  ✓ State ${state.stateId} (${state.owner}): ${state.provinces.length} provinces`);

            // Assign each province to the owner country
            for (const provinceId of state.provinces) {
                if (provinceOwnership.has(provinceId)) {
                    console.warn(`    ⚠ Province ${provinceId} already assigned to ${provinceOwnership.get(provinceId)}, overwriting with ${state.owner}`);
                }
                provinceOwnership.set(provinceId, state.owner);
                totalProvinces++;
            }
        }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`Files processed: ${filesProcessed}`);
    console.log(`States parsed: ${statesParsed}`);
    console.log(`Total provinces assigned: ${totalProvinces}`);
    console.log(`${'='.repeat(60)}\n`);

    // Generate TypeScript file
    console.log('Generating src/provinceAssignments.ts...\n');

    const lines = [
        '// Auto-generated from HOI4 state files',
        '// Generated on: ' + new Date().toISOString(),
        '// Source: ' + statesDir,
        '',
        '/**',
        ' * Maps province IDs to country ISO codes',
        ' * This determines which country owns each province on the map',
        ' */',
        'export const provinceToCountryMap = new Map<string, string>([',
    ];

    // Sort provinces by ID for consistent output
    const sortedProvinces = Array.from(provinceOwnership.entries())
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

    for (const [provinceId, countryTag] of sortedProvinces) {
        lines.push(`    ["${provinceId}", "${countryTag}"],`);
    }

    lines.push(']);');
    lines.push('');
    lines.push(`// Total provinces: ${totalProvinces}`);
    lines.push(`// Parsed from ${statesParsed} state files`);
    lines.push('');

    const outputPath = './src/provinceAssignments.ts';
    fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');

    console.log(`✅ Successfully generated ${outputPath}`);
    console.log(`   ${totalProvinces} provinces assigned to countries\n`);

    // Show statistics
    const countryCounts = new Map();
    for (const [_, country] of sortedProvinces) {
        countryCounts.set(country, (countryCounts.get(country) || 0) + 1);
    }

    console.log('Top 10 countries by province count:');
    const topCountries = Array.from(countryCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    for (const [country, count] of topCountries) {
        console.log(`  ${country}: ${count} provinces`);
    }

    console.log('\n✅ Done!\n');
}

main();
