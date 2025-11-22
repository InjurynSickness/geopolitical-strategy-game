// Parse country color files and generate countryData.ts with accurate colors
// Uses countries/ folder as authoritative source for TAG -> Name mappings
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const COUNTRIES_DIR = path.join(projectRoot, 'countries');
const COLORS_DIR = path.join(projectRoot, 'country colors');
const ASSIGNMENTS_PATH = path.join(projectRoot, 'src', 'provinceAssignments.ts');
const OUTPUT_PATH = path.join(projectRoot, 'src', 'countryData.ts');

console.log('=== Country Colors Parser ===\n');

// Overrides for tags with incorrect names in countries/ folder
const NAME_OVERRIDES = {
    'RUS': 'Russia',
    'SOV': 'Soviet Union',
    'GER': 'Germany',
    'ENG': 'United Kingdom',
    'JAP': 'Japan',
    'ITA': 'Italy',
    'FRA': 'France',
    'CHI': 'China',
    'PRC': 'China',
};

// Step 1: Extract TAG -> Name mapping from countries/ folder
function extractTagToNameMapping() {
    console.log('[Parser] Extracting TAG -> Name mappings from countries/ folder...');

    const files = fs.readdirSync(COUNTRIES_DIR).filter(f => f.endsWith('.txt'));
    const tagToName = new Map();

    for (const file of files) {
        // Format: "TAG - Name.txt"
        const match = file.match(/^([A-Z]{3})\s*-\s*(.+)\.txt$/);
        if (match) {
            const tag = match[1];
            let name = match[2].trim();

            // Apply overrides for known incorrect names
            if (NAME_OVERRIDES[tag]) {
                name = NAME_OVERRIDES[tag];
            }

            tagToName.set(tag, name);
        }
    }

    console.log(`[Parser] Found ${tagToName.size} country definitions`);
    return tagToName;
}

// Step 2: Parse a color file
function parseColorFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');

        // Parse "color = { R G B }" format
        const match = content.match(/color\s*=\s*\{\s*(\d+)\s+(\d+)\s+(\d+)\s*\}/);
        if (match) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);

            // Convert to hex
            const hex = '#' + [r, g, b].map(x => {
                const h = x.toString(16);
                return h.length === 1 ? '0' + h : h;
            }).join('');

            return hex;
        }
    } catch (e) {
        // File doesn't exist or can't be read
    }
    return null;
}

// Step 3: Find color file by trying various name variations
function findColorFile(name) {
    const variations = [
        name,                                    // Exact match
        name.replace(/ /g, ''),                  // Remove spaces
        name.replace(/-/g, ' '),                 // Replace dashes with spaces
        name.replace(/\./g, ''),                 // Remove periods
        name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(), // Capitalize first
    ];

    // Also try common abbreviations/variations
    const nameMap = {
        'USA': 'United States',
        'United States': 'USA',
        'UK': 'United Kingdom',
        'UAE': 'United Arab Emirates',
        'PRC': 'China',
        'ROC': 'Republic of China',
        'North Korea': 'DPRK',
        'South Korea': 'Korea',
        'DR Congo': 'Democratic Republic of the Congo',
        'DRC': 'Democratic Republic of the Congo',
    };

    if (nameMap[name]) {
        variations.push(nameMap[name]);
    }

    for (const variation of variations) {
        const colorFilePath = path.join(COLORS_DIR, `${variation}.txt`);
        if (fs.existsSync(colorFilePath)) {
            return colorFilePath;
        }
    }

    return null;
}

// Step 4: Load colors for all tags
function loadColors(tagToName) {
    console.log('[Parser] Loading colors from country colors/ folder...');

    const colorMap = new Map();
    let foundColors = 0;

    for (const [tag, name] of tagToName.entries()) {
        // Try to find color file
        const colorFilePath = findColorFile(name);

        if (colorFilePath) {
            const color = parseColorFile(colorFilePath);
            if (color) {
                colorMap.set(tag, { name, color });
                foundColors++;
            }
        }
    }

    console.log(`[Parser] Loaded ${foundColors} colors from files`);
    return colorMap;
}

// Step 5: Extract tags from provinceAssignments.ts
function extractCountryTags() {
    console.log('[Parser] Reading province assignments...');

    const content = fs.readFileSync(ASSIGNMENTS_PATH, 'utf-8');
    const tagMatches = content.matchAll(/"([A-Z]{3})"/g);
    const tags = new Set();

    for (const match of tagMatches) {
        tags.add(match[1]);
    }

    console.log(`[Parser] Found ${tags.size} unique country tags in use`);
    return Array.from(tags).sort();
}

// HSL to Hex conversion
function hslToHex(h, s, l) {
    const hslToRgb = (h, s, l) => {
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    };

    const [r, g, b] = hslToRgb(h, s, l);
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

// Generate fallback color based on tag hash
function generateFallbackColor(tag, index, total) {
    // Hash the tag to get a stable seed
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
        hash = ((hash << 5) - hash) + tag.charCodeAt(i);
        hash = hash & hash;
    }

    // Use prime numbers for spacing
    const primes = [7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    const prime = primes[Math.abs(hash) % primes.length];

    // Generate distinct hue
    const goldenRatio = 0.618033988749895;
    const hue = ((index * prime * goldenRatio) + (Math.abs(hash) / 1000000)) % 1.0;

    // Vary saturation and lightness
    const saturation = 0.55 + ((Math.abs(hash) % 30) / 100);
    const lightness = 0.35 + ((Math.abs(hash >> 8) % 25) / 100);

    return hslToHex(hue, saturation, lightness);
}

// Step 6: Generate countryData.ts
function generateCountryData(tags, colorMap, tagToName) {
    console.log('[Parser] Generating countryData.ts...');

    let foundColors = 0;
    let fallbackColors = 0;
    let adjustedColors = 0;
    const usedColors = new Set();

    const entries = tags.map((tag, index) => {
        let name, color;

        if (colorMap.has(tag)) {
            const data = colorMap.get(tag);
            name = data.name;
            color = data.color;
            foundColors++;

            // Check for duplicate color
            if (usedColors.has(color)) {
                console.log(`[Parser] ⚠️  Duplicate color detected for ${tag} (${name}): ${color} - generating unique variant`);
                color = generateFallbackColor(tag, index, tags.length);
                adjustedColors++;
            }
        } else {
            // Fallback: use name from countries/ folder or tag
            name = tagToName.get(tag) || tag;
            color = generateFallbackColor(tag, index, tags.length);
            fallbackColors++;
        }

        usedColors.add(color);
        return `["${tag}", { name: "${name}", color: "${color}" }]`;
    });

    const timestamp = new Date().toISOString();
    const output = `// Auto-generated from country color files
// Generated on: ${timestamp}
// Source: ./country colors
//
// Colors extracted from HOI4 country definition files
// Coverage: ${foundColors}/${tags.length} countries (${((foundColors/tags.length)*100).toFixed(1)}%)

/**
 * Maps country ISO codes to their display names and colors
 */
export interface CountryData {
    name: string;
    color: string;
}

export const allCountryData = new Map<string, CountryData>([
${entries.map(e => '    ' + e).join(',\n')}
]);

// Backwards compatibility export
export { allCountryData as countryData };
`;

    fs.writeFileSync(OUTPUT_PATH, output, 'utf-8');
    console.log(`[Parser] ✓ Written to: ${OUTPUT_PATH}\n`);

    return { foundColors, fallbackColors, adjustedColors };
}

// Main execution
try {
    const tagToName = extractTagToNameMapping();
    const colorMap = loadColors(tagToName);
    const tags = extractCountryTags();
    const stats = generateCountryData(tags, colorMap, tagToName);

    console.log('=== Statistics ===');
    console.log(`Total countries: ${tags.length}`);
    console.log(`Colors from files: ${stats.foundColors}`);
    console.log(`Duplicate colors adjusted: ${stats.adjustedColors}`);
    console.log(`Fallback colors: ${stats.fallbackColors}`);
    console.log(`Coverage: ${((stats.foundColors/tags.length)*100).toFixed(1)}%`);
    console.log('\n✓ Done! Country data generated with accurate HOI4 colors.');

} catch (error) {
    console.error('Error:', error);
    process.exit(1);
}
