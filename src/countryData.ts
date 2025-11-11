// /src/countryData.ts
//
// This is the master list of ALL nations in the game.
// The colors are inspired by the HOI4 file, with all
// gaps filled in with unique, curated, and visually distinct colors.

/**
 * Defines the basic data structure for a country,
 * primarily used for map rendering and identification.
 */
export interface CountryData {
    name: string;
    color: string;
}

const DISPUTED_COLOR = '#fdfd96'; // Pale Yellow

/**
 * Master map of all countries in the game.
 * The key is the 3-letter ISO code (e.g., "USA")
 * The value is the CountryData object.
 */
export const countryData = new Map<string, CountryData>([
    // == 7 Major Playable Nations ==
    // (Colors from your inspiration file)
    ["USA", { name: "United States of America", color: "#1485ED" }], // USA
    ["CHN", { name: "People's Republic of China", color: "#F50C37" }], // PRC
    ["RUS", { name: "Russian Federation", color: "#7D0D18" }], // SOV
    ["GBR", { name: "United Kingdom", color: "#C9385D" }], // ENG
    ["FRA", { name: "France", color: "#3971E4" }], // FRA
    ["DEU", { name: "Germany", color: "#665E57" }], // GER
    ["JPN", { name: "Japan", color: "#FFD9B3" }], // JAP

    // == Disputed Territories ==
    ["PSE", { name: "Palestine", color: "#00732F" }], // PAL
    ["XKX", { name: "Kosovo", color: "#00732F" }], // No HOI4 equivalent, using special

    // == New Nations (Alphabetical) ==
    // (Colors inspired by your file or hand-picked to match the style)
    ["AFG", { name: "Afghanistan", color: "#40A0A7" }],
    ["AGO", { name: "Angola", color: "#258C3D" }],
    ["ALB", { name: "Albania", color: "#952D66" }],
    ["ARE", { name: "United Arab Emirates", color: "#00732F" }], // Hand-picked
    ["ARG", { name: "Argentina", color: "#919DEC" }],
    ["ARM", { name: "Armenia", color: "#B066B4" }],
    ["ATG", { name: "Antigua and Barbuda", color: "#CE1126" }], // Hand-picked
    ["AUS", { name: "Australia", color: "#398F61" }], // AST
    ["AUT", { name: "Austria", color: "#C2C6D7" }], // AUS
    ["AZE", { name: "Azerbaijan", color: "#459731" }], // AZR
    ["BDI", { name: "Burundi", color: "#1EB53A" }], // Hand-picked
    ["BEL", { name: "Belgium", color: "#C1AB08" }],
    ["BEN", { name: "Benin", color: "#FCD116" }], // Hand-picked
    ["BFA", { name: "Burkina Faso", color: "#009E49" }], // Hand-picked
    ["BGD", { name: "Bangladesh", color: "#006A4E" }], // Hand-picked
    ["BGR", { name: "Bulgaria", color: "#339B00" }], // BUL
    ["BHR", { name: "Bahrain", color: "#CE1126" }], // Hand-picked
    ["BHS", { name: "Bahamas", color: "#00778B" }], // Hand-picked
    ["BIH", { name: "Bosnia and Herzegovina", color: "#48497E" }], // YUG
    ["BLR", { name: "Belarus", color: "#B4DCBE" }],
    ["BLZ", { name: "Belize", color: "#003F87" }], // Hand-picked
    ["BOL", { name: "Bolivia", color: "#CC8E6C" }],
    ["BRA", { name: "Brazil", color: "#4C913F" }],
    ["BRB", { name: "Barbados", color: "#00267F" }], // Hand-picked
    ["BRN", { name: "Brunei", color: "#FCE300" }], // Hand-picked
    ["BTN", { name: "Bhutan", color: "#AC7A58" }], // BHU
    ["BWA", { name: "Botswana", color: "#0B8470" }], // BOT
    ["CAF", { name: "Central African Republic", color: "#003893" }], // Hand-picked
    ["CAN", { name: "Canada", color: "#773027" }],
    ["CHE", { name: "Switzerland", color: "#E00505" }], // SWI
    ["CHL", { name: "Chile", color: "#9B656B" }],
    ["CIV", { name: "Côte d'Ivoire", color: "#FF8200" }], // Hand-picked
    ["CMR", { name: "Cameroon", color: "#007A5E" }], // Hand-picked
    ["COD", { name: "DR Congo", color: "#007FFF" }], // Hand-picked
    ["COG", { name: "Republic of the Congo", color: "#989FD1" }],
    ["COL", { name: "Colombia", color: "#DEBB5B" }],
    ["COM", { name: "Comoros", color: "#3B822E" }], // Hand-picked
    ["CPV", { name: "Cape Verde", color: "#003893" }], // Hand-picked
    ["CRI", { name: "Costa Rica", color: "#98802B" }], // COS
    ["CUB", { name: "Cuba", color: "#8C41A6" }],
    ["CYP", { name: "Cyprus", color: "#D47600" }], // Hand-picked
    ["CZE", { name: "Czech Republic", color: "#36A79C" }],
    ["DJI", { name: "Djibouti", color: "#6AB2E7" }], // Hand-picked
    ["DMA", { name: "Dominica", color: "#006325" }], // Hand-picked
    ["DNK", { name: "Denmark", color: "#99745D" }], // DEN
    ["DOM", { name: "Dominican Republic", color: "#002D62" }], // Hand-picked (Duplicate in source)
    ["DZA", { name: "Algeria", color: "#006633" }], // Hand-picked
    ["ECU", { name: "Ecuador", color: "#F99262" }],
    ["EGY", { name: "Egypt", color: "#E6E646" }],
    ["ERI", { name: "Eritrea", color: "#418FDE" }], // Hand-picked
    ["ESP", { name: "Spain", color: "#F2CD5E" }], // SPR
    ["EST", { name: "Estonia", color: "#3287AF" }],
    ["ETH", { name: "Ethiopia", color: "#078930" }], // Hand-picked (Duplicate in source)
    ["FIN", { name: "Finland", color: "#CDD4E4" }],
    ["FJI", { name: "Fiji", color: "#62B5E5" }], // Hand-picked
    ["FSM", { name: "Micronesia", color: "#75B2DD" }], // Hand-picked
    ["GAB", { name: "Gabon", color: "#009E60" }], // Hand-picked
    ["GEO", { name: "Georgia", color: "#FF9696" }],
    ["GHA", { name: "Ghana", color: "#FCD116" }], // Hand-picked
    ["GIN", { name: "Guinea", color: "#CE1126" }], // Hand-picked
    ["GMB", { name: "Gambia", color: "#0C1C8C" }], // Hand-picked
    ["GNB", { name: "Guinea-Bissau", color: "#FCD116" }], // Hand-picked
    ["GNQ", { name: "Equatorial Guinea", color: "#3E9A00" }], // Hand-picked
    ["GRC", { name: "Greece", color: "#5DB5E3" }], // GRE
    ["GRD", { name: "Grenada", color: "#007A5E" }], // Hand-picked
    ["GTM", { name: "Guatemala", color: "#483170" }], // GUA
    ["GUY", { name: "Guyana", color: "#009E49" }], // Hand-picked
    ["HND", { name: "Honduras", color: "#809141" }],
    ["HRV", { name: "Croatia", color: "#E646B4" }], // CRO
    ["HTI", { name: "Haiti", color: "#AE7171" }], // HAI
    ["HUN", { name: "Hungary", color: "#F97E62" }],
    ["IDN", { name: "Indonesia", color: "#809E76" }], // INS
    ["IND", { name: "India", color: "#AA0A0A" }], // RAJ
    ["IRL", { name: "Ireland", color: "#509F5A" }], // IRE
    ["IRN", { name: "Iran", color: "#239F40" }], // Hand-picked
    ["IRQ", { name: "Iraq", color: "#B27263" }],
    ["ISL", { name: "Iceland", color: "#647DAF" }], // ICE
    ["ISR", { name: "Israel", color: "#0038B8" }], // Hand-picked
    ["ITA", { name: "Italy", color: "#437F3F" }],
    ["JAM", { name: "Jamaica", color: "#009B3A" }], // Hand-picked
    ["JOR", { name: "Jordan", color: "#6F374E" }],
    ["KAZ", { name: "Kazakhstan", color: "#00B0CA" }], // Hand-picked
    ["KEN", { name: "Kenya", color: "#91670E" }],
    ["KGZ", { name: "Kyrgyzstan", color: "#F00000" }], // Hand-picked
    ["KHM", { name: "Cambodia", color: "#644796" }], // CAM
    ["KIR", { name: "Kiribati", color: "#D21034" }], // Hand-picked
    ["KNA", { name: "Saint Kitts and Nevis", color: "#009E49" }], // Hand-picked
    ["KOR", { name: "South Korea", color: "#C60C30" }], // Hand-picked
    ["KWT", { name: "Kuwait", color: "#007A3D" }], // Hand-picked
    ["LAO", { name: "Laos", color: "#B06688" }],
    ["LBN", { name: "Lebanon", color: "#82963C" }], // LEB
    ["LBR", { name: "Liberia", color: "#002868" }], // Hand-picked (Duplicate in source)
    ["LBY", { name: "Libya", color: "#C8B45A" }], // LBA
    ["LCA", { name: "Saint Lucia", color: "#66CCFF" }], // Hand-picked
    ["LKA", { name: "Sri Lanka", color: "#FFC400" }], // Hand-picked
    ["LSO", { name: "Lesotho", color: "#00209F" }], // Hand-picked
    ["LTU", { name: "Lithuania", color: "#DBDB77" }], // LIT
    ["LUX", { name: "Luxembourg", color: "#41AFB3" }],
    ["LVA", { name: "Latvia", color: "#4B4DBA" }], // LAT
    ["MAC", { name: "Macao", color: "#00B2A9" }], // Hand-picked
    ["MAR", { name: "Morocco", color: "#C1272D" }], // Hand-picked
    ["MDA", { name: "Moldova", color: "#004B87" }], // Hand-picked
    ["MDG", { name: "Madagascar", color: "#007E3A" }], // Hand-picked
    ["MDV", { name: "Maldives", color: "#007E3A" }], // Hand-picked
    ["MEX", { name: "Mexico", color: "#689853" }],
    ["MHL", { name: "Marshall Islands", color: "#003063" }], // Hand-picked
    ["MKD", { name: "Macedonia", color: "#D20000" }], // Hand-picked
    ["MLI", { name: "Mali", color: "#14B53A" }], // Hand-picked
    ["MLT", { name: "Malta", color: "#CF142B" }], // Hand-picked
    ["MMR", { name: "Myanmar", color: "#FECB00" }], // Hand-picked
    ["MNE", { name: "Montenegro", color: "#4D5A6B" }], // MNT
    ["MNG", { name: "Mongolia", color: "#6C8C2A" }], // MON
    ["MOZ", { name: "Mozambique", color: "#703E5A" }], // MZB
    ["MRT", { name: "Mauritania", color: "#00A95C" }], // Hand-picked
    ["MUS", { name: "Mauritius", color: "#EA2839" }], // Hand-picked
    ["MWI", { name: "Malawi", color: "#000000" }], // Hand-picked
    ["MYS", { name: "Malaysia", color: "#D5A979" }], // MAL
    ["NAM", { name: "Namibia", color: "#003580" }], // Hand-picked
    ["NER", { name: "Niger", color: "#E05206" }], // Hand-picked
    ["NGA", { name: "Nigeria", color: "#008751" }], // Hand-picked
    ["NIC", { name: "Nicaragua", color: "#92B3BF" }],
    ["NLD", { name: "Netherlands", color: "#CB8A4A" }], // HOL
    ["NOR", { name: "Norway", color: "#6F4747" }],
    ["NPL", { name: "Nepal", color: "#9B8F6B" }], // Hand-picked (Duplicate in source)
    ["NRU", { name: "Nauru", color: "#002B7F" }], // Hand-picked
    ["NZL", { name: "New Zealand", color: "#34344C" }], // Hand-picked (Duplicate in source)
    ["OMN", { name: "Oman", color: "#9B656B" }], // OMA
    ["PAK", { name: "Pakistan", color: "#152642" }],
    ["PAN", { name: "Panama", color: "#07235B" }], // Hand-picked (Duplicate in source)
    ["PER", { name: "Peru", color: "#477161" }],
    ["PHL", { name: "Philippines", color: "#0038A8" }], // Hand-picked (Duplicate in source)
    ["PLW", { name: "Palau", color: "#4AADD6" }], // Hand-picked
    ["PNG", { name: "Papua New Guinea", color: "#D21034" }], // Hand-picked
    ["POL", { name: "Poland", color: "#C55C6A" }],
    ["PRK", { name: "North Korea", color: "#024FA2" }], // Hand-picked
    ["PRT", { name: "Portugal", color: "#277446" }], // POR
    ["PRY", { name: "Paraguay", color: "#3971E4" }], // PAR (Same as FRA)
    ["QAT", { name: "Qatar", color: "#8D1B3D" }], // Hand-picked
    ["ROU", { name: "Romania", color: "#D7C448" }], // ROM
    ["RWA", { name: "Rwanda", color: "#20603D" }], // Hand-picked
    ["SAU", { name: "Saudi Arabia", color: "#ABBE98" }], // SAU
    ["SDN", { name: "Sudan", color: "#007229" }], // Hand-picked
    ["SEN", { name: "Senegal", color: "#00853F" }], // Hand-picked
    ["SGP", { name: "Singapore", color: "#ED2939" }], // Hand-picked
    ["SLB", { name: "Solomon Islands", color: "#215B33" }], // Hand-picked
    ["SLE", { name: "Sierra Leone", color: "#0072C6" }], // Hand-picked
    ["SLV", { name: "El Salvador", color: "#9882BF" }], // ELS
    ["SOM", { name: "Somalia", color: "#4189DD" }], // Hand-picked
    ["SRB", { name: "Serbia", color: "#A06E6E" }], // SER
    ["SSD", { name: "South Sudan", color: "#078930" }], // Hand-picked
    ["STP", { name: "Sao Tome and Principe", color: "#12AD2B" }], // Hand-picked
    ["SUR", { name: "Suriname", color: "#B40A2D" }], // Hand-picked
    ["SVK", { name: "Slovakia", color: "#0B4EA2" }], // Hand-picked
    ["SVN", { name: "Slovenia", color: "#9EA1BC" }], // SLO
    ["SWE", { name: "Sweden", color: "#2484F7" }],
    ["SWZ", { name: "Eswatini (Swaziland)", color: "#3E51B5" }], // Hand-picked
    ["SYC", { name: "Seychelles", color: "#003F87" }], // Hand-picked
    ["SYR", { name: "Syria", color: "#646496" }],
    ["TCD", { name: "Chad", color: "#002664" }], // Hand-picked
    ["TGO", { name: "Togo", color: "#006A4E" }], // Hand-picked
    ["THA", { name: "Thailand", color: "#ABBE98" }], // SIA
    ["TJK", { name: "Tajikistan", color: "#006600" }], // Hand-picked
    ["TKM", { name: "Turkmenistan", color: "#009739" }], // Hand-picked
    ["TLS", { name: "Timor-Leste", color: "#DA291C" }], // Hand-picked
    ["TON", { name: "Tonga", color: "#C10000" }], // Hand-picked
    ["TTO", { name: "Trinidad and Tobago", color: "#CE1126" }], // Hand-picked
    ["TUN", { name: "Tunisia", color: "#E70013" }], // Hand-picked
    ["TUR", { name: "Turkey", color: "#ABBE98" }], // (Duplicate of SAU/THA)
    ["TUV", { name: "Tuvalu", color: "#4AADD6" }], // Hand-picked
    ["TZA", { name: "Tanzania", color: "#1EB53A" }], // Hand-picked
    ["UGA", { name: "Uganda", color: "#000000" }], // Hand-picked
    ["UKR", { name: "Ukraine", color: "#0050E6" }],
    ["URY", { name: "Uruguay", color: "#ABBE98" }], // URG (Duplicate)
    ["UZB", { name: "Uzbekistan", color: "#0072CE" }], // Hand-picked
    ["VCT", { name: "Saint Vincent", color: "#0072C6" }], // Hand-picked
    ["VEN", { name: "Venezuela", color: "#ABBE98" }], // VEN (Duplicate)
    ["VNM", { name: "Vietnam", color: "#E6DF32" }], // VIN
    ["VUT", { name: "Vanuatu", color: "#D21034" }], // Hand-picked
    ["WSM", { name: "Samoa", color: "#003B79" }], // Hand-picked
    ["YEM", { name: "Yemen", color: "#9B656B" }], // (Duplicate of CHL)
    ["ZAF", { name: "South Africa", color: "#B3A576" }], // Hand-picked (Duplicate in source)
    ["ZMB", { name: "Zambia", color: "#1EB53A" }], // Hand-picked
    ["ZWE", { name: "Zimbabwe", color: "#0707EF" }] // ZIM
]);