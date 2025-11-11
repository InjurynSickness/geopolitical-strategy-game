// /src/main.ts
import { ProvinceMap } from './provinceMap.js';
import { provinceToCountryMap } from './provinceAssignments.js';
import { countryData } from './countryData.js';
import { MainMenu } from './mainMenu.js';
import { LoadingScreen } from './loadingScreen.js';
const gameData = {
    "countries": [
        {
            "id": "USA",
            "name": "United States of America",
            "code": "USA",
            "position": { "x": 200, "y": 200 },
            "territories": [],
            "color": "#0066cc",
            "gdp": 10250.0,
            "gdpPerCapita": 36300,
            "population": 282.2,
            "unemploymentRate": 3.9,
            "inflationRate": 3.4,
            "nationalDebt": 5674.0,
            "interestRate": 6.5,
            "resources": {
                "oil": 3000, "steel": 5000, "aluminum": 2000, "rubber": 500, "rareEarths": 800,
                "semiconductors": 1500, "uranium": 300, "coal": 8000, "food": 10000, "energy": 4000
            },
            "militaryStrength": 100,
            "militarySpending": 294.4,
            "politicalPower": 150,
            "politicalPowerGain": 2.5,
            "stability": 85,
            "warSupport": 70,
            "government": "federal_republic",
            "ideology": "liberal_democracy",
            "relations": { "CHN": -10, "RUS": -25 },
            "alliances": ["NATO"],
            "corruptionLevel": 15,
            "economicGrowthRate": 4.1
        },
        {
            "id": "CHN",
            "name": "People's Republic of China",
            "code": "CHN",
            "position": { "x": 600, "y": 250 },
            "territories": [],
            "color": "#cc0000",
            "gdp": 1211.3,
            "gdpPerCapita": 959,
            "population": 1262.6,
            "unemploymentRate": 3.1,
            "inflationRate": 0.4,
            "nationalDebt": 150.0,
            "interestRate": 5.8,
            "resources": {
                "oil": 1200, "steel": 8000, "aluminum": 3000, "rubber": 300, "rareEarths": 5000,
                "semiconductors": 800, "uranium": 200, "coal": 15000, "food": 8000, "energy": 2500
            },
            "militaryStrength": 75,
            "militarySpending": 14.6,
            "politicalPower": 200,
            "politicalPowerGain": 3.0,
            "stability": 75,
            "warSupport": 60,
            "government": "totalitarian",
            "ideology": "communism",
            "relations": { "USA": -10, "RUS": 15 },
            "alliances": [],
            "corruptionLevel": 35,
            "economicGrowthRate": 8.4
        },
        {
            "id": "RUS",
            "name": "Russian Federation",
            "code": "RUS",
            "position": { "x": 500, "y": 150 },
            "territories": [],
            "color": "#006600",
            "gdp": 259.7,
            "gdpPerCapita": 1775,
            "population": 146.4,
            "unemploymentRate": 10.6,
            "inflationRate": 20.8,
            "nationalDebt": 62.9,
            "interestRate": 25.0,
            "resources": {
                "oil": 8000, "steel": 4000, "aluminum": 1500, "rubber": 100, "rareEarths": 2000,
                "semiconductors": 200, "uranium": 800, "coal": 6000, "food": 3000, "energy": 3500
            },
            "militaryStrength": 85,
            "militarySpending": 9.2,
            "politicalPower": 180,
            "politicalPowerGain": 2.2,
            "stability": 65,
            "warSupport": 55,
            "government": "authoritarian",
            "ideology": "nationalism",
            "relations": { "USA": -25, "CHN": 15 },
            "alliances": ["CSTO"],
            "corruptionLevel": 45,
            "economicGrowthRate": 6.4
        },
        {
            "id": "GBR",
            "name": "United Kingdom",
            "code": "GBR",
            "position": { "x": 400, "y": 180 },
            "territories": [],
            "color": "#0099ff",
            "gdp": 1659.0,
            "gdpPerCapita": 28100,
            "population": 59.0,
            "unemploymentRate": 5.4,
            "inflationRate": 0.8,
            "nationalDebt": 540.0,
            "interestRate": 6.0,
            "resources": { "oil": 2500, "steel": 1000, "aluminum": 500, "semiconductors": 800, "coal": 2000, "food": 2000, "energy": 1500 },
            "militaryStrength": 65,
            "militarySpending": 38.4,
            "politicalPower": 160,
            "politicalPowerGain": 2.3,
            "stability": 80,
            "warSupport": 45,
            "government": "constitutional_monarchy",
            "ideology": "liberal_democracy",
            "relations": { "USA": 25, "FRA": 15, "DEU": 20 },
            "alliances": ["NATO"],
            "corruptionLevel": 20,
            "economicGrowthRate": 3.9
        },
        {
            "id": "FRA",
            "name": "France",
            "code": "FRA",
            "position": { "x": 420, "y": 220 },
            "territories": [],
            "color": "#0000ff",
            "gdp": 1362.0,
            "gdpPerCapita": 22800,
            "population": 59.8,
            "unemploymentRate": 9.1,
            "inflationRate": 1.8,
            "nationalDebt": 567.0,
            "interestRate": 5.4,
            "resources": { "oil": 500, "steel": 1200, "uranium": 300, "coal": 1000, "food": 3000, "energy": 1200 },
            "militaryStrength": 60,
            "militarySpending": 29.5,
            "politicalPower": 155,
            "politicalPowerGain": 2.1,
            "stability": 75,
            "warSupport": 40,
            "government": "democracy",
            "ideology": "social_democracy",
            "relations": { "GBR": 15, "DEU": 25, "USA": 20 },
            "alliances": ["NATO"],
            "corruptionLevel": 25,
            "economicGrowthRate": 3.4
        },
        {
            "id": "DEU",
            "name": "Germany",
            "code": "DEU",
            "position": { "x": 450, "y": 200 },
            "territories": [],
            "color": "#333333",
            "gdp": 1952.0,
            "gdpPerCapita": 23700,
            "population": 82.3,
            "unemploymentRate": 7.9,
            "inflationRate": 1.4,
            "nationalDebt": 1211.0,
            "interestRate": 5.3,
            "resources": { "oil": 200, "steel": 2000, "semiconductors": 1000, "coal": 3000, "food": 2500, "energy": 1800 },
            "militaryStrength": 50,
            "militarySpending": 24.3,
            "politicalPower": 140,
            "politicalPowerGain": 2.0,
            "stability": 85,
            "warSupport": 35,
            "government": "federal_republic",
            "ideology": "liberal_democracy",
            "relations": { "FRA": 25, "GBR": 20, "USA": 25 },
            "alliances": ["NATO"],
            "corruptionLevel": 18,
            "economicGrowthRate": 3.2
        },
        {
            "id": "JPN",
            "name": "Japan",
            "code": "JPN",
            "position": { "x": 700, "y": 240 },
            "territories": [],
            "color": "#ff6666",
            "gdp": 4968.0,
            "gdpPerCapita": 39300,
            "population": 126.7,
            "unemploymentRate": 4.7,
            "inflationRate": -0.7,
            "nationalDebt": 4887.0,
            "interestRate": 0.5,
            "resources": { "oil": 100, "steel": 1500, "semiconductors": 2000, "coal": 500, "food": 1000, "energy": 1200 },
            "militaryStrength": 55,
            "militarySpending": 45.8,
            "politicalPower": 120,
            "politicalPowerGain": 1.8,
            "stability": 90,
            "warSupport": 25,
            "government": "constitutional_monarchy",
            "ideology": "liberal_democracy",
            "relations": { "USA": 30, "CHN": -5, "RUS": -15 },
            "alliances": [],
            "corruptionLevel": 12,
            "economicGrowthRate": 2.9
        }
    ],
    "alliances": [
        {
            "id": "NATO",
            "name": "North Atlantic Treaty Organization",
            "leaderCountryId": "USA",
            "memberCountryIds": ["USA", "GBR", "FRA", "DEU"],
            "type": "military",
            "foundedDate": { "year": 1949, "month": 4, "day": 4, "hour": 0 }
        },
        {
            "id": "CSTO",
            "name": "Collective Security Treaty Organization",
            "leaderCountryId": "RUS",
            "memberCountryIds": ["RUS"],
            "type": "military",
            "foundedDate": { "year": 1992, "month": 5, "day": 15, "hour": 0 }
        }
    ]
};
class GameEngine {
    gameState;
    mapRenderer;
    gameLoop = null;
    lastUpdateTime = 0;
    updateInterval = 500;
    lastSaveMonth = 1;
    isEditorMode = false;
    currentPaintCountry = null;
    lastSelectedProvinceId = null;
    mainMenu = null;
    loadingScreen = null;
    isGameInitialized = false;
    constructor() {
        this.gameState = {};
        this.mapRenderer = {};
        this.showMainMenu();
    }
    showMainMenu() {
        const container = document.body;
        const hasAutoSave = localStorage.getItem('geopolitical-save-0') !== null;
        this.mainMenu = new MainMenu(container, () => this.startNewGame(), (slotNumber) => this.loadGameFromMenu(slotNumber), hasAutoSave ? () => this.continueGame() : undefined);
    }
    async startNewGame() {
        if (this.mainMenu) {
            this.mainMenu.hide();
        }
        await this.initializeGame(false);
    }
    async continueGame() {
        if (this.mainMenu) {
            this.mainMenu.hide();
        }
        await this.initializeGame(true);
    }
    async loadGameFromMenu(slotNumber) {
        if (this.mainMenu) {
            this.mainMenu.hide();
        }
        await this.initializeGame(true, slotNumber);
    }
    async initializeGame(loadSave = false, slotNumber = 0) {
        console.log("Starting initializeGame...");
        const container = document.body;
        this.loadingScreen = new LoadingScreen(container);
        this.loadingScreen.show();
        await this.delay(100);
        console.log("Initializing game state...");
        this.loadingScreen.updateProgress(10, 'Initializing game state...');
        await this.delay(200);
        this.gameState = this.initializeGameState();
        console.log("Game state initialized");
        this.loadingScreen.updateProgress(25, 'Loading map assets...');
        await this.delay(300);
        console.log("Getting map container...");
        const mapContainer = document.getElementById('mapContainer');
        if (!mapContainer) {
            throw new Error('mapContainer element not found');
        }
        console.log("Showing game container...");
        // Show game container first so UI elements exist
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.style.display = 'flex';
            gameContainer.style.visibility = 'hidden'; // Hide visually but render DOM
        }
        console.log("Clearing old canvases...");
        // Clear any existing canvas from previous sessions
        while (mapContainer.firstChild) {
            mapContainer.removeChild(mapContainer.firstChild);
        }
        console.log("Creating ProvinceMap...");
        this.mapRenderer = new ProvinceMap(mapContainer, (provinceId) => this.selectProvince(provinceId));
        console.log("ProvinceMap created");
        // Wait for map to be ready before continuing
        this.loadingScreen.updateProgress(40, 'Loading map textures...');
        console.log("Waiting for map ready...");
        await this.waitForMapReady();
        console.log("Map is ready!");
        this.loadingScreen.updateProgress(55, 'Loading countries...');
        await this.delay(300);
        console.log("Updating countries...");
        this.mapRenderer.updateCountries(this.gameState.countries, countryData);
        this.mapRenderer.setProvinceOwnerMap(provinceToCountryMap);
        console.log("Countries updated");
        this.loadingScreen.updateProgress(65, 'Calculating country labels...');
        console.log("Calculating country labels...");
        await this.mapRenderer.calculateLabels();
        console.log("Country labels calculated");
        this.loadingScreen.updateProgress(75, 'Setting up interface...');
        await this.delay(200);
        console.log("Setting up UI...");
        this.setupUI();
        console.log("UI setup complete");
        console.log("Setting up editor UI...");
        this.setupEditorUI();
        console.log("Editor UI setup complete");
        if (loadSave) {
            this.loadingScreen.updateProgress(85, `Loading saved game...`);
            await this.delay(300);
            console.log("Loading save...");
            this.loadGame(slotNumber);
            console.log("Save loaded");
        }
        this.loadingScreen.updateProgress(92, 'Finalizing...');
        await this.delay(200);
        console.log("Starting game loop...");
        this.startGameLoop();
        console.log("Updating display...");
        this.updateDisplay();
        console.log("Force rendering map...");
        // Force an initial render to ensure map displays
        this.mapRenderer.forceRender();
        this.loadingScreen.updateProgress(100, 'Ready!');
        await this.delay(300);
        console.log("Hiding loading screen...");
        this.loadingScreen.hide();
        await this.delay(500);
        console.log("Making game visible...");
        // Make game container visible
        if (gameContainer) {
            gameContainer.style.visibility = 'visible';
        }
        // Force another render after container is visible
        await this.delay(100);
        this.mapRenderer.forceRender();
        this.isGameInitialized = true;
        console.log("Game initialization complete!");
    }
    async waitForMapReady() {
        // Poll the map renderer to check if it's ready
        return new Promise((resolve) => {
            const checkReady = () => {
                if (this.mapRenderer.isMapReady()) {
                    resolve();
                }
                else {
                    setTimeout(checkReady, 100);
                }
            };
            checkReady();
        });
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    returnToMainMenu() {
        this.gameState.isPaused = true;
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = null;
        }
        // Destroy the map renderer to clean up canvases
        if (this.mapRenderer && typeof this.mapRenderer.destroy === 'function') {
            this.mapRenderer.destroy();
        }
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.style.display = 'none';
        }
        this.showMainMenu();
    }
    initializeGameState() {
        const countries = new Map();
        const alliances = new Map();
        for (const [id, data] of countryData.entries()) {
            const basicCountry = {
                id: id,
                name: data.name,
                code: id,
                position: { x: 0, y: 0 },
                territories: [],
                color: data.color,
                gdp: 0,
                gdpPerCapita: 0,
                population: 0,
                unemploymentRate: 0,
                inflationRate: 0,
                nationalDebt: 0,
                interestRate: 0,
                resources: {
                    oil: 0,
                    steel: 0,
                    aluminum: 0,
                    rubber: 0,
                    rareEarths: 0,
                    semiconductors: 0,
                    uranium: 0,
                    coal: 0,
                    food: 0,
                    energy: 0
                },
                militaryStrength: 10,
                militarySpending: 0,
                politicalPower: 50,
                politicalPowerGain: 0.2,
                stability: 50,
                warSupport: 50,
                government: "democracy",
                ideology: "liberal_democracy",
                relations: new Map(),
                alliances: [],
                corruptionLevel: 20,
                economicGrowthRate: 1
            };
            countries.set(id, basicCountry);
        }
        for (const majorCountryData of gameData.countries) {
            const country = countries.get(majorCountryData.id);
            if (!country) {
                console.warn(`Country ${majorCountryData.id} exists in gameData but not in countryData master list!`);
                continue;
            }
            Object.assign(country, {
                ...majorCountryData,
                relations: new Map(Object.entries(majorCountryData.relations || {})),
                government: majorCountryData.government,
                ideology: majorCountryData.ideology,
                resources: majorCountryData.resources
            });
        }
        for (const [provinceId, countryId] of provinceToCountryMap.entries()) {
            const country = countries.get(countryId);
            if (country) {
                country.territories.push(provinceId);
            }
        }
        console.log(`Populated territories for ${countries.size} countries.`);
        for (const allianceData of gameData.alliances) {
            alliances.set(allianceData.id, allianceData);
        }
        return {
            currentDate: { year: 2000, month: 1, day: 1, hour: 0 },
            isPaused: true,
            gameSpeed: 1,
            countries,
            alliances,
            selectedCountryId: null
        };
    }
    setupUI() {
        const playBtn = document.getElementById('playBtn');
        if (!playBtn) {
            console.warn('UI elements not found yet, will retry after delay');
            return;
        }
        playBtn.addEventListener('click', () => this.togglePause());
        for (let i = 1; i <= 5; i++) {
            const speedBtn = document.getElementById(`speed${i}`);
            if (speedBtn) {
                speedBtn.addEventListener('click', () => this.setGameSpeed(i));
            }
        }
        const mainMenuBtn = document.getElementById('mainMenuBtn');
        if (mainMenuBtn) {
            mainMenuBtn.addEventListener('click', () => {
                if (confirm('Return to main menu? Your progress will be auto-saved.')) {
                    this.saveGame(0);
                    this.returnToMainMenu();
                }
            });
        }
        document.addEventListener('keydown', (e) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }
            if (e.key === 'Escape') {
                this.closeSaveLoadDialog();
                const eventModal = document.getElementById('eventModal');
                const exportModal = document.getElementById('exportModal');
                if (eventModal)
                    eventModal.style.display = 'none';
                if (exportModal)
                    exportModal.style.display = 'none';
                this.gameState.selectedCountryId = null;
                this.lastSelectedProvinceId = null;
                this.mapRenderer.setSelectedCountry(null);
                this.updateCountryInfo();
            }
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePause();
            }
            if (e.code >= 'Digit1' && e.code <= 'Digit5') {
                const speed = parseInt(e.code.replace('Digit', ''));
                if (speed >= 1 && speed <= 5) {
                    this.setGameSpeed(speed);
                }
            }
            if (e.key === 'c' || e.key === 'C') {
                if (this.lastSelectedProvinceId) {
                    const ownerId = provinceToCountryMap.get(this.lastSelectedProvinceId);
                    if (ownerId) {
                        this.setPaintTool(ownerId);
                        const country = countryData.get(ownerId);
                        this.showNotification(`Paint tool set to: ${country ? country.name : 'Unknown'}`, 'info');
                    }
                    else {
                        this.showNotification(`Province ${this.lastSelectedProvinceId} is unassigned.`, 'info');
                    }
                }
                else {
                    this.showNotification('No province selected. Click a province first.', 'error');
                }
            }
        });
        console.log("UI setup completed successfully");
    }
    setupEditorUI() {
        const editorPanel = document.getElementById('editorPanel');
        const toggleBtn = document.getElementById('toggleEditorBtn');
        const palette = document.getElementById('countryPalette');
        const exportBtn = document.getElementById('exportBtn');
        const exportModal = document.getElementById('exportModal');
        const exportTextArea = document.getElementById('exportTextArea');
        const closeExportModal = document.getElementById('closeExportModal');
        if (!editorPanel || !toggleBtn || !palette) {
            console.warn('Editor UI elements not found, skipping editor setup');
            return;
        }
        toggleBtn.textContent = 'Show Country Palette';
        toggleBtn.style.backgroundColor = '#6c757d';
        toggleBtn.addEventListener('click', () => {
            this.isEditorMode = !this.isEditorMode;
            editorPanel.classList.toggle('visible', this.isEditorMode);
            this.mapRenderer.setEditorMode(this.isEditorMode);
            if (this.isEditorMode) {
                toggleBtn.textContent = 'Hide Palette';
                toggleBtn.style.backgroundColor = '#28a745';
            }
            else {
                toggleBtn.textContent = 'Show Palette';
                toggleBtn.style.backgroundColor = '#6c757d';
                this.setPaintTool(null);
            }
        });
        const clearPaintBtn = document.createElement('button');
        clearPaintBtn.className = 'palette-button';
        clearPaintBtn.textContent = "Clear Paint Tool (Right-Click to unclaim)";
        clearPaintBtn.style.borderLeft = '5px solid #ff0000';
        clearPaintBtn.addEventListener('click', () => {
            this.setPaintTool(null);
        });
        palette.appendChild(clearPaintBtn);
        for (const [id, data] of countryData.entries()) {
            const btn = document.createElement('button');
            btn.className = 'palette-button';
            btn.textContent = data.name;
            btn.dataset.countryId = id;
            btn.style.borderLeft = `5px solid ${data.color}`;
            btn.addEventListener('click', () => {
                this.setPaintTool(id);
            });
            palette.appendChild(btn);
        }
        if (exportBtn && exportModal && exportTextArea && closeExportModal) {
            exportBtn.addEventListener('click', () => {
                exportTextArea.value = this.mapRenderer.exportMapData();
                exportModal.style.display = 'block';
            });
            closeExportModal.addEventListener('click', () => {
                exportModal.style.display = 'none';
            });
        }
        const autoAssignBtn = document.getElementById('autoAssignBtn');
        if (autoAssignBtn) {
            autoAssignBtn.addEventListener('click', () => {
                this.mapRenderer.importAndAutoAssignCSV();
            });
        }
        console.log("Editor UI setup completed successfully");
    }
    setPaintTool(countryId) {
        this.currentPaintCountry = countryId;
        this.mapRenderer.setPaintCountry(countryId);
        const paintDisplay = document.getElementById('paintCountryDisplay');
        document.querySelectorAll('.palette-button').forEach(b => b.classList.remove('selected'));
        if (countryId) {
            const country = countryData.get(countryId);
            paintDisplay.textContent = country ? country.name : 'Unknown';
            const button = document.querySelector(`.palette-button[data-country-id="${countryId}"]`);
            if (button) {
                button.classList.add('selected');
            }
        }
        else {
            paintDisplay.textContent = 'None';
        }
    }
    togglePause() {
        this.gameState.isPaused = !this.gameState.isPaused;
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            playBtn.textContent = this.gameState.isPaused ? '▶️ Play' : '⏸️ Pause';
            playBtn.classList.toggle('active', !this.gameState.isPaused);
        }
    }
    setGameSpeed(speed) {
        this.gameState.gameSpeed = speed;
        document.querySelectorAll('.speed-cube').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`speed${speed}`)?.classList.add('active');
        this.updateInterval = 500 / speed;
    }
    selectProvince(provinceId) {
        let countryId = provinceToCountryMap.get(provinceId) || null;
        this.gameState.selectedCountryId = countryId;
        this.lastSelectedProvinceId = provinceId;
        this.mapRenderer.setSelectedCountry(provinceId);
        this.updateCountryInfo(provinceId);
    }
    updateCountryInfo(provinceId) {
        const countryInfoDiv = document.getElementById('countryInfo');
        if (!countryInfoDiv)
            return;
        const countryId = this.gameState.selectedCountryId;
        const provId = provinceId || this.lastSelectedProvinceId;
        if (!countryId) {
            countryInfoDiv.innerHTML = `
                <h2>Select a Country</h2>
                <p style="color: #888;">Click on a province to view its information</p>
            `;
            if (provId) {
                countryInfoDiv.innerHTML = `
                    <h2>Unclaimed Territory</h2>
                    <p style="color: #888;">Province ID: ${provId}</p>
                    <p style="color: #888;">This province has no defined owner.</p>
                `;
            }
            return;
        }
        const country = this.gameState.countries.get(countryId);
        if (!country) {
            const data = countryData.get(countryId);
            countryInfoDiv.innerHTML = `
                <h2>${data ? data.name : 'Unknown Nation'}</h2>
                <p style="color: #888;">Province ID: ${provId || 'None'}</p>
                <p style="color: #888;">This is not a major playable nation.</p>
            `;
            return;
        }
        const isMajor = (country.gdp > 0);
        if (!isMajor) {
            countryInfoDiv.innerHTML = `
                <h2>${country.name}</h2>
                <p style="color: #888;">Province ID: ${provId || 'None'}</p>
                <p style="color: #888;">This is not a major playable nation.</p>
                
                <h3>Politics</h3>
                <div class="stat-row">
                    <span class="stat-label">Government:</span>
                    <span class="stat-value">${this.formatGovernmentType(country.government)}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Political Power:</span>
                    <span class="stat-value">${country.politicalPower.toFixed(1)}</span>
                </div>
            `;
            return;
        }
        const alliance = country.alliances.length > 0
            ? this.gameState.alliances.get(country.alliances[0])?.name || 'None'
            : 'None';
        countryInfoDiv.innerHTML = `
            <h2>${country.name}</h2>
            <p style="font-size: 12px; color: #888; margin-top: -10px;">Province: ${provId || 'N/A'}</p>
            
            <h3>Economy</h3>
            <div class="stat-row">
                <span class="stat-label">GDP:</span>
                <span class="stat-value">$${country.gdp.toFixed(1)}T</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">GDP per Capita:</span>
                <span class="stat-value">$${country.gdpPerCapita.toLocaleString()}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Population:</span>
                <span class="stat-value">${country.population.toFixed(1)}M</span>
            </div>

            <h3>Politics</h3>
            <div class="stat-row">
                <span class="stat-label">Government:</span>
                <span class="stat-value">${this.formatGovernmentType(country.government)}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Political Power:</span>
                <span class="stat-value">${country.politicalPower.toFixed(1)} (+${(country.politicalPowerGain / 24).toFixed(2)}/hr)</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Stability:</span>
                <span class="stat-value">${Math.round(country.stability)}%</span>
            </div>
        `;
    }
    formatGovernmentType(gov) {
        return gov.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    formatIdeology(ideology) {
        return ideology.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    formatTopResources(country) {
        if (!country.resources) {
            return '<div class="stat-row"><span class="stat-label">No resource data available</span></div>';
        }
        const resources = Object.entries(country.resources)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);
        return resources.map(([resource, amount]) => `
            <div class="stat-row">
                <span class="stat-label">${resource.charAt(0).toUpperCase() + resource.slice(1)}:</span>
                <span class="stat-value">${amount.toLocaleString()}</span>
            </div>
        `).join('');
    }
    startGameLoop() {
        const gameLoop = (currentTime) => {
            if (currentTime - this.lastUpdateTime >= this.updateInterval) {
                if (!this.gameState.isPaused) {
                    this.updateGame();
                }
                this.updateDisplay();
                this.lastUpdateTime = currentTime;
            }
            this.gameLoop = requestAnimationFrame(gameLoop);
        };
        this.gameLoop = requestAnimationFrame(gameLoop);
    }
    updateGame() {
        this.advanceDate();
        for (const country of this.gameState.countries.values()) {
            this.updateCountryEconomy(country);
            this.updateCountryPolitics(country);
        }
    }
    advanceDate() {
        const date = this.gameState.currentDate;
        date.hour++;
        if (date.hour >= 24) {
            date.hour = 0;
            date.day++;
            const daysInMonth = this.getDaysInMonth(date.year, date.month);
            if (date.day > daysInMonth) {
                date.day = 1;
                date.month++;
                if (date.month !== this.lastSaveMonth) {
                    this.autoSave();
                    this.lastSaveMonth = date.month;
                }
                if (date.month > 12) {
                    date.month = 1;
                    date.year++;
                    this.lastSaveMonth = 1;
                }
            }
        }
    }
    getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }
    updateCountryEconomy(country) {
        if (country.gdp > 0) {
            const growthRate = country.economicGrowthRate ?? 0;
            const hourlyGrowthRate = growthRate / (365 * 24) / 100;
            country.gdp = (country.gdp ?? 0) * (1 + hourlyGrowthRate);
            if (country.gdp > 0 && country.population > 0) {
                country.gdpPerCapita = (country.gdp * 1000000000) / (country.population * 1000000);
            }
            else {
                country.gdpPerCapita = 0;
            }
        }
        const ppGain = country.politicalPowerGain ?? 0;
        country.politicalPower = (country.politicalPower ?? 0) + (ppGain / 24);
        country.politicalPower = Math.min(country.politicalPower, 999);
    }
    updateCountryPolitics(country) {
        if (country.gdp > 0) {
            const growthRate = country.economicGrowthRate ?? 0;
            const currentStability = country.stability ?? 50;
            if (growthRate > 5) {
                country.stability = Math.min(100, currentStability + 0.01);
            }
            else if (growthRate < 0) {
                country.stability = Math.max(0, currentStability - 0.02);
            }
            const corruption = country.corruptionLevel ?? 0;
            if (corruption > 30) {
                country.politicalPowerGain = (country.politicalPowerGain ?? 0) * 0.999;
            }
        }
    }
    saveGame(slotNumber = 1) {
        try {
            const serializableCountries = Array.from(this.gameState.countries.entries()).map(([id, country]) => {
                return [id, { ...country, relations: Array.from(country.relations.entries()) }];
            });
            const serializableAlliances = Array.from(this.gameState.alliances.entries());
            const saveData = {
                gameState: {
                    currentDate: this.gameState.currentDate,
                    isPaused: this.gameState.isPaused,
                    gameSpeed: this.gameState.gameSpeed,
                    selectedCountryId: this.gameState.selectedCountryId,
                    countries: serializableCountries,
                    alliances: serializableAlliances
                },
                saveTime: new Date().toISOString(),
                version: "1.2.0"
            };
            localStorage.setItem(`geopolitical-save-${slotNumber}`, JSON.stringify(saveData));
            if (slotNumber > 0) {
                this.showNotification(`Game saved to slot ${slotNumber}`, 'success');
            }
        }
        catch (error) {
            console.error('Failed to save game:', error);
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                this.showNotification('Failed to save: Storage quota exceeded!', 'error');
            }
            else {
                this.showNotification('Failed to save game', 'error');
            }
        }
    }
    loadGame(slotNumber = 1) {
        try {
            const saveData = localStorage.getItem(`geopolitical-save-${slotNumber}`);
            if (!saveData) {
                if (slotNumber > 0)
                    this.showNotification(`Save slot ${slotNumber} is empty`, 'info');
                return false;
            }
            const data = JSON.parse(saveData);
            const countries = new Map();
            if (data.gameState.countries && Array.isArray(data.gameState.countries)) {
                for (const [id, countryData] of data.gameState.countries) {
                    countries.set(id, { ...countryData, relations: new Map(countryData.relations || []) });
                }
            }
            const alliances = new Map(data.gameState.alliances || []);
            this.gameState = { ...data.gameState, countries, alliances };
            this.lastSaveMonth = this.gameState.currentDate.month;
            this.mapRenderer.updateCountries(this.gameState.countries, countryData);
            this.mapRenderer.setSelectedCountry(null);
            this.setGameSpeed(this.gameState.gameSpeed);
            const playBtn = document.getElementById('playBtn');
            if (playBtn) {
                playBtn.textContent = this.gameState.isPaused ? '▶️ Play' : '⏸️ Pause';
                playBtn.classList.toggle('active', !this.gameState.isPaused);
            }
            this.updateDisplay();
            if (slotNumber > 0)
                this.showNotification(`Game loaded from slot ${slotNumber}`, 'success');
            return true;
        }
        catch (error) {
            console.error('Failed to load game:', error);
            this.showNotification('Failed to load save data. File may be corrupt.', 'error');
            localStorage.removeItem(`geopolitical-save-${slotNumber}`);
            return false;
        }
    }
    autoSave() { this.saveGame(0); }
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `game-notification ${type}`;
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '-300px';
        notification.style.padding = '12px 20px';
        notification.style.backgroundColor = type === 'success' ? '#28a745' : (type === 'error' ? '#dc3545' : '#17a2b8');
        notification.style.color = 'white';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '3000';
        notification.style.transition = 'right 0.5s ease-in-out';
        notification.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)';
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.right = '20px';
        }, 100);
        setTimeout(() => {
            notification.style.right = '-300px';
            notification.addEventListener('transitionend', () => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            });
        }, 3000);
    }
    showSaveDialog() {
        const modal = document.getElementById('saveLoadModal');
        const title = document.getElementById('modalTitle');
        const slotsContainer = document.getElementById('saveSlots');
        title.textContent = 'Save Game';
        slotsContainer.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            slotsContainer.appendChild(this.createSaveSlot(i, 'save'));
        }
        modal.style.display = 'block';
    }
    showLoadDialog() {
        const modal = document.getElementById('saveLoadModal');
        const title = document.getElementById('modalTitle');
        const slotsContainer = document.getElementById('saveSlots');
        title.textContent = 'Load Game';
        slotsContainer.innerHTML = '';
        slotsContainer.appendChild(this.createSaveSlot(0, 'load'));
        for (let i = 1; i <= 5; i++) {
            slotsContainer.appendChild(this.createSaveSlot(i, 'load'));
        }
        modal.style.display = 'block';
    }
    closeSaveLoadDialog() {
        const modal = document.getElementById('saveLoadModal');
        if (modal)
            modal.style.display = 'none';
    }
    createSaveSlot(slotNumber, mode) {
        const slot = document.createElement('div');
        slot.className = 'save-slot';
        const saveKey = `geopolitical-save-${slotNumber}`;
        const saveData = localStorage.getItem(saveKey);
        if (saveData) {
            try {
                const data = JSON.parse(saveData);
                const saveDate = new Date(data.saveTime);
                const gameDate = data.gameState.currentDate;
                slot.innerHTML = `
                    <div class="save-slot-header">
                        <div class="save-slot-title">${slotNumber === 0 ? 'Auto-Save' : `Save Slot ${slotNumber}`}</div>
                        <div class="save-slot-date">${saveDate.toLocaleDateString()} ${saveDate.toLocaleTimeString()}</div>
                    </div>
                    <div class="save-slot-info">
                        <span>Game Date: ${this.formatGameDate(gameDate, true)}</span>
                        <span>Version: ${data.version || '1.0.0'}</span>
                    </div>`;
            }
            catch (error) {
                slot.innerHTML = `
                    <div class="save-slot-header"><div class="save-slot-title">${slotNumber === 0 ? 'Auto-Save' : `Save Slot ${slotNumber}`}</div></div>
                    <div style="color: #ff6b6b;">Corrupted Save</div>`;
                slot.className += ' empty';
            }
        }
        else {
            slot.innerHTML = `
                <div class="save-slot-header"><div class="save-slot-title">${slotNumber === 0 ? 'Auto-Save' : `Save Slot ${slotNumber}`}</div></div>
                <div>Empty Slot</div>`;
            slot.className += ' empty';
            if (mode === 'load') {
                slot.style.cursor = 'not-allowed';
                slot.style.opacity = '0.3';
            }
        }
        slot.addEventListener('click', () => {
            if (mode === 'save') {
                this.saveGame(slotNumber);
                this.closeSaveLoadDialog();
            }
            else if (mode === 'load' && saveData) {
                this.loadGame(slotNumber);
                this.closeSaveLoadDialog();
            }
        });
        return slot;
    }
    formatGameDate(gameDate, includeTime = false) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (!gameDate || typeof gameDate.month !== 'number' || gameDate.month < 1 || gameDate.month > 12)
            return "Invalid Date";
        let dateString = `${months[gameDate.month - 1]} ${gameDate.day}, ${gameDate.year}`;
        if (includeTime) {
            const hour24 = gameDate.hour || 0;
            const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
            const ampm = hour24 < 12 ? 'AM' : 'PM';
            const hourStr = hour12 < 10 ? `0${hour12}` : hour12.toString();
            dateString += ` - ${hourStr}:00 ${ampm}`;
        }
        return dateString;
    }
    triggerTestEvent() {
        if (!this.gameState.selectedCountryId) {
            this.showNotification('Please select a country first', 'error');
            return;
        }
        const country = this.gameState.countries.get(this.gameState.selectedCountryId);
        if (!country)
            return;
        if (country.gdp === 0) {
            this.showNotification('This nation is not a major power and cannot trigger events.', 'info');
            return;
        }
        this.showSimpleEventPopup({
            title: 'Economic Opportunity',
            description: `A new technology breakthrough in ${country.name} could boost economic growth. How should the government respond?`,
            choices: [
                {
                    text: 'Invest heavily in research',
                    cost: 100,
                    effects: 'Increases economic growth by 2%, costs 100 PP',
                    action: () => {
                        country.economicGrowthRate = (country.economicGrowthRate ?? 0) + 2;
                        country.politicalPower = (country.politicalPower ?? 0) - 100;
                        this.showNotification('Investment successful! Economic growth increased', 'success');
                    }
                },
                {
                    text: 'Provide moderate support',
                    cost: 50,
                    effects: 'Increases economic growth by 1%, costs 50 PP',
                    action: () => {
                        country.economicGrowthRate = (country.economicGrowthRate ?? 0) + 1;
                        country.politicalPower = (country.politicalPower ?? 0) - 50;
                        this.showNotification('Moderate investment made', 'success');
                    }
                },
                {
                    text: 'Focus resources elsewhere',
                    cost: 0,
                    effects: 'No benefits, no costs',
                    action: () => {
                        this.showNotification('Opportunity ignored', 'info');
                    }
                }
            ]
        });
    }
    showSimpleEventPopup(event) {
        const modal = document.getElementById('eventModal');
        const title = document.getElementById('eventTitle');
        const description = document.getElementById('eventDescription');
        const choicesContainer = document.getElementById('eventChoices');
        title.textContent = event.title;
        description.textContent = event.description;
        choicesContainer.innerHTML = '';
        const country = this.gameState.countries.get(this.gameState.selectedCountryId);
        const currentPP = country ? (country.politicalPower ?? 0) : 0;
        for (const choice of event.choices) {
            const choiceButton = document.createElement('button');
            choiceButton.className = 'event-choice';
            const hasEnoughPP = choice.cost === 0 || (currentPP >= choice.cost);
            if (!hasEnoughPP)
                choiceButton.classList.add('insufficient-power');
            choiceButton.innerHTML = `
                <div>
                    ${choice.text}
                    ${choice.cost > 0 ? `<span class="event-choice-cost">${choice.cost} PP</span>` : ''}
                </div>
                <div class="event-choice-tooltip">${choice.effects}</div>
            `;
            choiceButton.addEventListener('click', () => {
                if (hasEnoughPP) {
                    choice.action();
                    modal.style.display = 'none';
                    this.updateCountryInfo(this.lastSelectedProvinceId || undefined);
                }
                else {
                    this.showNotification('Not enough Political Power!', 'error');
                }
            });
            choicesContainer.appendChild(choiceButton);
        }
        modal.style.display = 'block';
    }
    updateDisplay() {
        const dateElement = document.getElementById('gameDate');
        if (dateElement) {
            dateElement.textContent = this.formatGameDate(this.gameState.currentDate, true);
        }
        const totalCountries = this.gameState.countries.size;
        const worldGDP = Array.from(this.gameState.countries.values())
            .reduce((sum, country) => sum + (country.gdp ?? 0), 0);
        document.getElementById('totalCountries').textContent = totalCountries.toString();
        document.getElementById('worldGDP').textContent = `$${worldGDP.toFixed(1)}T`;
        document.getElementById('activeConflicts').textContent = '0';
        if (!this.lastSelectedProvinceId) {
            this.updateCountryInfo();
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    try {
        const gameEngine = new GameEngine();
        window.gameEngine = gameEngine;
    }
    catch (error) {
        console.error("Failed to initialize game engine:", error);
        document.body.innerHTML = `<div style="color: red; padding: 20px;">
            <h1>Critical Error</h1>
            <p>Failed to initialize game engine. Check console (F12) for details.</p>
            <pre>${error.message}</pre>
            <pre>${error.stack}</pre>
        </div>`;
    }
});
//# sourceMappingURL=main.js.map