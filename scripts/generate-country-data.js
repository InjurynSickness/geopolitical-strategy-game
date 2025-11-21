// Generate countryData.ts with all modern country tags and colors
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const STATES_DIR = path.join(projectRoot, 'modern states');
const OUTPUT_PATH = path.join(projectRoot, 'src', 'countryData.ts');

// Country name mappings (HOI4 tag → Display name)
const COUNTRY_NAMES = {
    // Major Powers
    'USA': 'United States',
    'ENG': 'United Kingdom',
    'FRA': 'France',
    'GER': 'Germany',
    'SOV': 'Soviet Union',
    'ITA': 'Italy',
    'JAP': 'Japan',
    'CHI': 'China',
    'PRC': 'People\'s Republic of China',

    // Post-Soviet States
    'RUS': 'Russia',
    'UKR': 'Ukraine',
    'BLR': 'Belarus',
    'KAZ': 'Kazakhstan',
    'GEO': 'Georgia',
    'ARM': 'Armenia',
    'AZR': 'Azerbaijan',
    'UZB': 'Uzbekistan',
    'TKM': 'Turkmenistan',
    'KGZ': 'Kyrgyzstan',
    'TJK': 'Tajikistan',
    'EST': 'Estonia',
    'LAT': 'Latvia',
    'LIT': 'Lithuania',
    'MOL': 'Moldova',

    // Former Yugoslavia
    'YUG': 'Yugoslavia',
    'SRB': 'Serbia',
    'CRO': 'Croatia',
    'BOS': 'Bosnia and Herzegovina',
    'SLV': 'Slovenia',
    'MAC': 'Macedonia',
    'MNT': 'Montenegro',
    'KOS': 'Kosovo',

    // Middle East
    'ISR': 'Israel',
    'PAL': 'Palestine',
    'JOR': 'Jordan',
    'SYR': 'Syria',
    'LEB': 'Lebanon',
    'IRQ': 'Iraq',
    'IRN': 'Iran',
    'TUR': 'Turkey',
    'SAU': 'Saudi Arabia',
    'YEM': 'Yemen',
    'OMA': 'Oman',
    'UAE': 'United Arab Emirates',
    'KUW': 'Kuwait',
    'QAT': 'Qatar',
    'BHR': 'Bahrain',

    // Asia
    'IND': 'India',
    'PAK': 'Pakistan',
    'BAN': 'Bangladesh',
    'NEP': 'Nepal',
    'BHU': 'Bhutan',
    'SRI': 'Sri Lanka',
    'AFG': 'Afghanistan',
    'NKR': 'North Korea',
    'SKO': 'South Korea',
    'VIE': 'Vietnam',
    'THA': 'Thailand',
    'BRM': 'Myanmar',
    'LAO': 'Laos',
    'CAM': 'Cambodia',
    'MAL': 'Malaysia',
    'INS': 'Indonesia',
    'PHI': 'Philippines',
    'MON': 'Mongolia',

    // Europe
    'POL': 'Poland',
    'CZE': 'Czech Republic',
    'SLO': 'Slovakia',
    'HUN': 'Hungary',
    'ROM': 'Romania',
    'BUL': 'Bulgaria',
    'ALB': 'Albania',
    'GRE': 'Greece',
    'NOR': 'Norway',
    'SWE': 'Sweden',
    'FIN': 'Finland',
    'DEN': 'Denmark',
    'ICE': 'Iceland',
    'IRE': 'Ireland',
    'POR': 'Portugal',
    'SPA': 'Spain',
    'BEL': 'Belgium',
    'NET': 'Netherlands',
    'LUX': 'Luxembourg',
    'SWI': 'Switzerland',
    'AUS': 'Austria',

    // Americas
    'CAN': 'Canada',
    'MEX': 'Mexico',
    'BRA': 'Brazil',
    'ARG': 'Argentina',
    'CHL': 'Chile',
    'PER': 'Peru',
    'COL': 'Colombia',
    'VEN': 'Venezuela',
    'ECU': 'Ecuador',
    'BOL': 'Bolivia',
    'PAR': 'Paraguay',
    'URU': 'Uruguay',
    'CUB': 'Cuba',
    'DOM': 'Dominican Republic',
    'HAI': 'Haiti',
    'COS': 'Costa Rica',
    'PAN': 'Panama',
    'GUA': 'Guatemala',
    'HON': 'Honduras',
    'ELS': 'El Salvador',
    'NIC': 'Nicaragua',

    // Africa
    'EGY': 'Egypt',
    'LIB': 'Libya',
    'TUN': 'Tunisia',
    'ALG': 'Algeria',
    'MOR': 'Morocco',
    'SUD': 'Sudan',
    'ETH': 'Ethiopia',
    'SOM': 'Somalia',
    'KEN': 'Kenya',
    'TAN': 'Tanzania',
    'UGA': 'Uganda',
    'ANG': 'Angola',
    'SAF': 'South Africa',
    'ZIM': 'Zimbabwe',
    'MOZ': 'Mozambique',
    'ZAM': 'Zambia',
    'MAD': 'Madagascar',
    'NIG': 'Nigeria',
    'GHA': 'Ghana',
    'CIV': 'Ivory Coast',
    'CMR': 'Cameroon',
    'CON': 'Congo',
    'GAB': 'Gabon',
    'CHA': 'Chad',
    'MLI': 'Mali',
    'NIG': 'Niger',
    'SEN': 'Senegal',

    // Oceania
    'AST': 'Australia',
    'NZL': 'New Zealand',
    'RAJ': 'British India',
    'SPR': 'Spain',
};

// Generate a visually distinct color using golden ratio
function generateColor(index, total) {
    const goldenRatio = 0.618033988749895;
    const hue = (index * goldenRatio) % 1.0;
    const saturation = 0.6 + (index % 3) * 0.1;
    const lightness = 0.4 + (index % 5) * 0.08;

    return hslToHex(hue, saturation, lightness);
}

function hslToHex(h, s, l) {
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

    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Extract all unique country tags from provinceAssignments.ts
// This includes converted tags like RUS, UKR (from SOV split)
function extractCountryTags() {
    const assignmentsPath = path.join(projectRoot, 'src', 'provinceAssignments.ts');
    console.log('[Generator] Reading province assignments from:', assignmentsPath);

    const content = fs.readFileSync(assignmentsPath, 'utf-8');
    const tagMatches = content.matchAll(/"([A-Z]{3})"/g);
    const tags = new Set();

    for (const match of tagMatches) {
        tags.add(match[1]);
    }

    console.log(`[Generator] Found ${tags.size} unique country tags`);
    return Array.from(tags).sort();
}

// Generate TypeScript country data file
function generateCountryData(tags) {
    console.log(`[Generator] Generating data for ${tags.length} countries`);

    const entries = tags.map((tag, index) => {
        const name = COUNTRY_NAMES[tag] || tag;
        const color = generateColor(index, tags.length);
        return `    ["${tag}", { name: "${name}", color: "${color}" }]`;
    });

    const timestamp = new Date().toISOString();

    const output = `// Auto-generated country data from modern state files
// Generated on: ${timestamp}
// Source: modern states/
//
// Total countries: ${tags.length}

/**
 * Defines the basic data structure for a country
 */
export interface CountryData {
    name: string;
    color: string;
}

/**
 * Master map of all countries in the game (HOI4 tags)
 * Key: 3-letter HOI4 country tag (e.g., "USA", "PRC", "ENG")
 * Value: CountryData with display name and map color
 */
export const countryData = new Map<string, CountryData>([
${entries.join(',\n')}
]);
`;

    fs.writeFileSync(OUTPUT_PATH, output, 'utf-8');
    console.log('[Generator] ✓ Written to:', OUTPUT_PATH);
}

// Print statistics
function printStats(tags) {
    console.log('\n=== Generation Statistics ===');
    console.log(`Total countries: ${tags.length}`);
    console.log('\nSample countries:');
    const samples = tags.slice(0, 20);
    for (const tag of samples) {
        const name = COUNTRY_NAMES[tag] || tag;
        console.log(`  ${tag}: ${name}`);
    }
    if (tags.length > 20) {
        console.log(`  ... and ${tags.length - 20} more`);
    }
}

// Main
console.log('=== Country Data Generator ===\n');

try {
    const tags = extractCountryTags();
    generateCountryData(tags);
    printStats(tags);
    console.log('\n✓ Done! All modern countries generated with unique colors.');
} catch (error) {
    console.error('Error:', error);
    process.exit(1);
}
