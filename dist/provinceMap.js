// /src/provinceMap.ts - FINAL RENDER LOGIC V3 (Properly Debugged V12)
// --- MODIFICATION: Render terrain *first*, then 'multiply' political colors on top ---
// --- FIX: Corrected typo 'unassignedProvin' to 'unassignedProvinces' ---
// --- UPDATE: Removed hover highlighting, added country labels ---
import { provinceColorMap } from './provinceData.js';
import { provinceBorders } from './provinceBorders.js';
// --- FIX: Updated to your map's correct dimensions ---
const MAP_WIDTH = 5616;
const MAP_HEIGHT = 2160;
// Smart country detection rules
const COUNTRY_DETECTION_RULES = [
    // (Your rules from the file are here)
    { keywords: ['Alaska', 'Sitka', 'Juneau', 'Ketchikan', 'Kenai', 'Unalaska', 'Anchorage', 'Fairbanks'], country: 'USA' },
    { keywords: ['Whitehorse', 'Dawson City', 'Vancouver', 'Vancouver Island', 'Prince Rupert', 'McLeod Lake', 'Atlin', 'Dawson Creek', 'Prince George', 'Calgary', 'Edmonton', 'Toronto', 'Montreal', 'Ottawa', 'Quebec', 'Winnipeg', 'Regina', 'Halifax', 'Victoria', 'Yellowknife'], country: 'CAN' },
    { keywords: ['Mexico City', 'Guadalajara', 'Monterrey', 'Tijuana', 'Cancun', 'Acapulco', 'Puebla', 'Merida'], country: 'MEX' },
    { keywords: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Edinburgh', 'Glasgow', 'Cardiff', 'Belfast', 'Leeds', 'Bristol'], country: 'GBR' },
    { keywords: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Bordeaux', 'Lille'], country: 'FRA' },
    { keywords: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Dusseldorf', 'Dortmund', 'Dresden', 'Leipzig'], country: 'DEU' },
    { keywords: ['Rome', 'Milan', 'Naples', 'Turin', 'Florence', 'Venice', 'Bologna', 'Genoa', 'Palermo'], country: 'ITA' },
    { keywords: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao', 'Malaga', 'Zaragoza'], country: 'ESP' },
    { keywords: ['Moscow', 'St Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Vladivostok', 'Omsk', 'Chelyabinsk'], country: 'RUS' },
    { keywords: ['Warsaw', 'Krakow', 'Lodz', 'Wroclaw', 'Poznan', 'Gdansk'], country: 'POL' },
    { keywords: ['Kiev', 'Kharkiv', 'Odessa', 'Dnipro', 'Lviv'], country: 'UKR' },
    { keywords: ['Amsterdam', 'Rotterdam', 'Utrecht', 'The Hague', 'Eindhoven'], country: 'NLD' },
    { keywords: ['Brussels', 'Antwerp', 'Ghent', 'Bruges', 'Liege'], country: 'BEL' },
    { keywords: ['Stockholm', 'Gothenburg', 'Malmo', 'Uppsala'], country: 'SWE' },
    { keywords: ['Oslo', 'Bergen', 'Trondheim', 'Stavanger'], country: 'NOR' },
    { keywords: ['Copenhagen', 'Aarhus', 'Odense'], country: 'DNK' },
    { keywords: ['Helsinki', 'Espoo', 'Tampere', 'Turku'], country: 'FIN' },
    { keywords: ['Athens', 'Thessaloniki', 'Patras'], country: 'GRC' },
    { keywords: ['Lisbon', 'Porto', 'Braga', 'Coimbra'], country: 'PRT' },
    { keywords: ['Vienna', 'Graz', 'Linz', 'Salzburg'], country: 'AUT' },
    { keywords: ['Prague', 'Brno', 'Ostrava'], country: 'CZE' },
    { keywords: ['Budapest', 'Debrecen', 'Szeged'], country: 'HUN' },
    { keywords: ['Bucharest', 'Cluj', 'Timisoara'], country: 'ROU' },
    { keywords: ['Sofia', 'Plovdiv', 'Varna'], country: 'BGR' },
    { keywords: ['Istanbul', 'Ankara', 'Izmir', 'Antalya'], country: 'TUR' },
    { keywords: ['Tokyo', 'Osaka', 'Kyoto', 'Nagoya', 'Sapporo', 'Fukuoka', 'Hiroshima', 'Yokohama'], country: 'JPN' },
    { keywords: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Wuhan', 'Xian', 'Chongqing', 'Tianjin', 'Nanjing', 'Hangzhou'], country: 'CHN' },
    { keywords: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon'], country: 'KOR' },
    { keywords: ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad'], country: 'IND' },
    { keywords: ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya'], country: 'THA' },
    { keywords: ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Bali'], country: 'IDN' },
    { keywords: ['Manila', 'Quezon City', 'Davao', 'Cebu'], country: 'PHL' },
    { keywords: ['Hanoi', 'Ho Chi Minh', 'Da Nang', 'Haiphong'], country: 'VNM' },
    { keywords: ['Kuala Lumpur', 'Penang', 'Johor Bahru', 'Malacca', 'Kuala Kelantan', 'San Khew Jong', 'Liwa'], country: 'MYS' },
    { keywords: ['Singapore'], country: 'SGP' },
    { keywords: ['Yangon', 'Mandalay', 'Naypyidaw'], country: 'MMR' },
    { keywords: ['Dhaka', 'Chittagong', 'Khulna'], country: 'BGD' },
    { keywords: ['Karachi', 'Lahore', 'Islamabad', 'Faisalabad'], country: 'PAK' },
    { keywords: ['Tehran', 'Isfahan', 'Shiraz', 'Tabriz'], country: 'IRN' },
    { keywords: ['Baghdad', 'Basra', 'Mosul', 'Erbil'], country: 'IRQ' },
    { keywords: ['Riyadh', 'Jeddah', 'Mecca', 'Medina'], country: 'SAU' },
    { keywords: ['Dubai', 'Abu Dhabi', 'Sharjah'], country: 'ARE' },
    { keywords: ['Tel Aviv', 'Jerusalem', 'Haifa'], country: 'ISR' },
    { keywords: ['Cairo', 'Alexandria', 'Giza', 'Luxor'], country: 'EGY' },
    { keywords: ['Lagos', 'Abuja', 'Kano', 'Ibadan'], country: 'NGA' },
    { keywords: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'], country: 'ZAF' },
    { keywords: ['Nairobi', 'Mombasa', 'Kisumu'], country: 'KEN' },
    { keywords: ['Addis Ababa', 'Dire Dawa'], country: 'ETH' },
    { keywords: ['Kinshasa', 'Lubumbashi', 'Goma'], country: 'COD' },
    { keywords: ['Algiers', 'Oran', 'Constantine'], country: 'DZA' },
    { keywords: ['Casablanca', 'Rabat', 'Marrakech', 'Fes'], country: 'MAR' },
    { keywords: ['Tunis', 'Sfax', 'Sousse'], country: 'TUN' },
    { keywords: ['Tripoli', 'Benghazi', 'Misrata'], country: 'LBY' },
    { keywords: ['Sao Paulo', 'Rio de Janeiro', 'Brasilia', 'Salvador', 'Fortaleza', 'Belo Horizonte'], country: 'BRA' },
    { keywords: ['Buenos Aires', 'Cordoba', 'Rosario', 'Mendoza'], country: 'ARG' },
    { keywords: ['Lima', 'Arequipa', 'Cusco', 'Trujillo'], country: 'PER' },
    { keywords: ['Bogota', 'Medellin', 'Cali', 'Barranquilla'], country: 'COL' },
    { keywords: ['Santiago', 'Valparaiso', 'Concepcion'], country: 'CHL' },
    { keywords: ['Caracas', 'Maracaibo', 'Valencia'], country: 'VEN' },
    { keywords: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra', 'Darwin'], country: 'AUS' },
    { keywords: ['Auckland', 'Wellington', 'Christchurch'], country: 'NZL' },
];
export class ProvinceMap {
    container;
    onCountrySelect;
    // Visible canvas
    visibleCanvas;
    visibleCtx;
    // Hidden canvas for province color-picking (from provinces.png)
    hiddenCanvas;
    hiddenCtx;
    // Holds the solid political colors (transparent oceans)
    politicalCanvas;
    politicalCtx;
    // Holds the hover/selection overlays
    overlayCanvas;
    overlayCtx;
    // Holds all country borders, drawn once
    borderCanvas;
    borderCtx;
    // Holds the re-colored river image
    recoloredRiversCanvas;
    recoloredRiversCtx;
    // Canvas to hold processed terrain
    processedTerrainCanvas;
    processedTerrainCtx;
    terrainImage = new Image();
    provinceImage = new Image();
    riversImage = new Image();
    lastHoveredProvince = null;
    selectedProvinceId = null;
    mapReady = false;
    politicalMapReady = false;
    bordersReady = false;
    isEditorMode = false;
    currentPaintCountry = null;
    provinceOwnerMap = new Map();
    countries = new Map();
    allCountryData = new Map();
    countryLabelCache = new Map();
    pulseAnimationId = null;
    pulseStartTime = null;
    pulseOpacity = 0.7;
    pulseColor = "255, 255, 240";
    camera = {
        x: 0,
        y: 0,
        zoom: 1,
        minZoom: 0.1,
        maxZoom: 15
    };
    isPanning = false;
    isPainting = false;
    lastMousePos = { x: 0, y: 0 };
    dragThreshold = 5;
    constructor(container, onCountrySelect) {
        this.container = container;
        this.onCountrySelect = onCountrySelect;
        this.initialize();
    }
    initialize() {
        this.visibleCanvas = document.createElement('canvas');
        this.visibleCanvas.width = this.container.clientWidth;
        this.visibleCanvas.height = this.container.clientHeight;
        this.visibleCanvas.style.backgroundColor = '#334a5e'; // Blue ocean color
        this.visibleCanvas.style.cursor = 'grab';
        this.container.appendChild(this.visibleCanvas);
        this.visibleCtx = this.visibleCanvas.getContext('2d');
        this.politicalCanvas = document.createElement('canvas');
        this.politicalCanvas.width = MAP_WIDTH;
        this.politicalCanvas.height = MAP_HEIGHT;
        this.politicalCtx = this.politicalCanvas.getContext('2d');
        this.overlayCanvas = document.createElement('canvas');
        this.overlayCanvas.width = MAP_WIDTH;
        this.overlayCanvas.height = MAP_HEIGHT;
        this.overlayCtx = this.overlayCanvas.getContext('2d');
        this.borderCanvas = document.createElement('canvas');
        this.borderCanvas.width = MAP_WIDTH;
        this.borderCanvas.height = MAP_HEIGHT;
        this.borderCtx = this.borderCanvas.getContext('2d');
        this.recoloredRiversCanvas = document.createElement('canvas');
        this.recoloredRiversCanvas.width = MAP_WIDTH;
        this.recoloredRiversCanvas.height = MAP_HEIGHT;
        this.recoloredRiversCtx = this.recoloredRiversCanvas.getContext('2d');
        this.processedTerrainCanvas = document.createElement('canvas');
        this.processedTerrainCanvas.width = MAP_WIDTH;
        this.processedTerrainCanvas.height = MAP_HEIGHT;
        this.processedTerrainCtx = this.processedTerrainCanvas.getContext('2d', { willReadFrequently: true });
        this.hiddenCanvas = document.createElement('canvas');
        this.hiddenCanvas.width = MAP_WIDTH;
        this.hiddenCanvas.height = MAP_HEIGHT;
        this.hiddenCtx = this.hiddenCanvas.getContext('2d', { willReadFrequently: true });
        this.resetCamera();
        this.loadAssets();
        this.setupInteractions();
        window.addEventListener('resize', () => this.handleResize());
    }
    resetCamera() {
        if (!this.visibleCanvas)
            return;
        // Set initial zoom to 2x
        const initialZoomMultiplier = 2.0;
        this.camera.zoom = initialZoomMultiplier;
        // Center the camera on the middle of the map
        const mapCenterX = MAP_WIDTH / 2;
        const mapCenterY = MAP_HEIGHT / 2;
        // Calculate camera position to center the viewport on the map center
        this.camera.x = (this.visibleCanvas.width / 2) - (mapCenterX * this.camera.zoom);
        this.camera.y = (this.visibleCanvas.height / 2) - (mapCenterY * this.camera.zoom);
        this.constrainCamera();
        this.render();
    }
    constrainCamera() {
        const mapWidthScaled = MAP_WIDTH * this.camera.zoom;
        const mapHeightScaled = MAP_HEIGHT * this.camera.zoom;
        // If map is smaller than viewport, center it
        if (mapWidthScaled <= this.visibleCanvas.width) {
            this.camera.x = (this.visibleCanvas.width - mapWidthScaled) / 2;
        }
        else {
            // Constrain horizontal panning
            const maxX = 0;
            const minX = this.visibleCanvas.width - mapWidthScaled;
            this.camera.x = Math.max(minX, Math.min(maxX, this.camera.x));
        }
        if (mapHeightScaled <= this.visibleCanvas.height) {
            this.camera.y = (this.visibleCanvas.height - mapHeightScaled) / 2;
        }
        else {
            // Constrain vertical panning
            const maxY = 0;
            const minY = this.visibleCanvas.height - mapHeightScaled;
            this.camera.y = Math.max(minY, Math.min(maxY, this.camera.y));
        }
    }
    loadAssets() {
        let assetsLoaded = 0;
        const totalAssets = 3;
        const onAssetLoad = () => {
            assetsLoaded++;
            if (assetsLoaded === totalAssets) {
                console.log("All map assets loaded.");
                this.hiddenCtx.drawImage(this.provinceImage, 0, 0);
                this.mapReady = true;
                this.processTerrainImage();
                this.buildPoliticalMap();
                this.buildBorderMap();
            }
        };
        this.terrainImage.onload = onAssetLoad;
        this.terrainImage.src = './terrain.png';
        this.provinceImage.onload = onAssetLoad;
        this.provinceImage.src = './provinces.png';
        this.riversImage.onload = () => {
            console.log("Recoloring rivers...");
            this.recoloredRiversCtx.drawImage(this.riversImage, 0, 0);
            this.recoloredRiversCtx.globalCompositeOperation = 'source-in';
            this.recoloredRiversCtx.fillStyle = '#283a4a';
            this.recoloredRiversCtx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
            this.recoloredRiversCtx.globalCompositeOperation = 'source-over';
            console.log("Rivers recolored.");
            onAssetLoad();
        };
        this.riversImage.src = './rivers.png';
    }
    processTerrainImage() {
        console.log("DEBUG: Processing terrain.png using provinces.png as a mask...");
        const ctx = this.processedTerrainCtx;
        ctx.drawImage(this.terrainImage, 0, 0);
        const terrainImageData = ctx.getImageData(0, 0, MAP_WIDTH, MAP_HEIGHT);
        const terrainData = terrainImageData.data;
        const maskImageData = this.hiddenCtx.getImageData(0, 0, MAP_WIDTH, MAP_HEIGHT);
        const maskData = maskImageData.data;
        for (let i = 0; i < terrainData.length; i += 4) {
            const r = maskData[i];
            const g = maskData[i + 1];
            const b = maskData[i + 2];
            const colorKey = `${r},${g},${b}`;
            if (!provinceColorMap.has(colorKey) || (r < 10 && g < 10 && b < 10)) {
                terrainData[i + 3] = 0;
            }
        }
        ctx.putImageData(terrainImageData, 0, 0);
        console.log("DEBUG: terrain.png processing complete. Ocean is now transparent.");
    }
    getMapCoordinates(offsetX, offsetY) {
        const x = (offsetX - this.camera.x) / this.camera.zoom;
        const y = (offsetY - this.camera.y) / this.camera.zoom;
        return { x: Math.floor(x), y: Math.floor(y) };
    }
    setupInteractions() {
        console.log("DEBUG: Setting up interactions on canvas");
        this.visibleCanvas.addEventListener('contextmenu', (e) => e.preventDefault());
        this.visibleCanvas.addEventListener('mousedown', (event) => {
            console.log("DEBUG: mousedown", event.button);
            this.lastMousePos = { x: event.clientX, y: event.clientY };
            this.isPanning = false;
            this.isPainting = false;
            if (event.button === 0) {
                if (this.isEditorMode) {
                    this.isPainting = true;
                    this.handlePaint(event);
                }
                else {
                    this.isPanning = true;
                }
            }
            else if (event.button === 1) {
                event.preventDefault();
                this.isPanning = true;
                this.visibleCanvas.style.cursor = 'grabbing';
            }
            else if (event.button === 2) {
                event.preventDefault();
                if (this.isEditorMode) {
                    this.handlePaint(event, true);
                }
            }
        });
        this.visibleCanvas.addEventListener('mouseup', (event) => {
            const dx = Math.abs(event.clientX - this.lastMousePos.x);
            const dy = Math.abs(event.clientY - this.lastMousePos.y);
            const isClick = dx < this.dragThreshold && dy < this.dragThreshold;
            if (event.button === 0 && isClick && !this.isEditorMode) {
                this.handleClick(event);
            }
            this.isPanning = false;
            this.isPainting = false;
            this.handleHover(event);
        });
        this.visibleCanvas.addEventListener('mouseleave', () => {
            this.isPanning = false;
            this.isPainting = false;
            this.lastHoveredProvince = null;
            this.visibleCanvas.style.cursor = 'grab';
            this.drawOverlays();
            this.render();
        });
        this.visibleCanvas.addEventListener('mousemove', (event) => {
            const isLeftButtonDown = event.buttons === 1;
            const isMiddleButtonDown = event.buttons === 4;
            const isRightButtonDown = event.buttons === 2;
            if ((isLeftButtonDown && !this.isEditorMode) || isMiddleButtonDown) {
                const dx = Math.abs(event.clientX - this.lastMousePos.x);
                const dy = Math.abs(event.clientY - this.lastMousePos.y);
                if (!this.isPanning && (dx > this.dragThreshold || dy > this.dragThreshold)) {
                    this.isPanning = true;
                }
                if (this.isPanning) {
                    this.visibleCanvas.style.cursor = 'grabbing';
                    const deltaX = event.clientX - this.lastMousePos.x;
                    const deltaY = event.clientY - this.lastMousePos.y;
                    this.camera.x += deltaX;
                    this.camera.y += deltaY;
                    this.constrainCamera();
                    this.lastMousePos = { x: event.clientX, y: event.clientY };
                    this.render();
                }
                return;
            }
            if ((isLeftButtonDown || isRightButtonDown) && this.isEditorMode) {
                this.isPainting = true;
                this.handlePaint(event, isRightButtonDown);
                return;
            }
            this.isPanning = false;
            this.isPainting = false;
            this.handleHover(event);
        });
        this.visibleCanvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            const rect = this.visibleCanvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
            const newZoom = Math.max(this.camera.minZoom, Math.min(this.camera.maxZoom, this.camera.zoom * zoomFactor));
            if (newZoom === this.camera.zoom)
                return;
            this.camera.x = mouseX - (mouseX - this.camera.x) * (newZoom / this.camera.zoom);
            this.camera.y = mouseY - (mouseY - this.camera.y) * (newZoom / this.camera.zoom);
            this.camera.zoom = newZoom;
            this.constrainCamera();
            this.render();
        });
    }
    handleClick(event) {
        if (!this.mapReady)
            return;
        const { x, y } = this.getMapCoordinates(event.offsetX, event.offsetY);
        const province = this.getProvinceAt(x, y);
        if (province && province.id !== 'OCEAN') {
            if (this.selectedProvinceId !== province.id) {
                this.onCountrySelect(province.id);
                this.selectedProvinceId = province.id;
                this.startPulseAnimation();
                this.drawOverlays();
                this.render();
            }
        }
    }
    handleHover(event) {
        if (!this.mapReady || this.isPanning || this.isPainting)
            return;
        const { x, y } = this.getMapCoordinates(event.offsetX, event.offsetY);
        const province = this.getProvinceAt(x, y);
        if (province?.id !== this.lastHoveredProvince?.id) {
            this.lastHoveredProvince = province;
            this.drawOverlays();
            this.render();
        }
        if (this.isEditorMode) {
            this.visibleCanvas.style.cursor = 'crosshair';
        }
        else {
            this.visibleCanvas.style.cursor = (province && province.id !== 'OCEAN') ? 'pointer' : 'grab';
        }
    }
    handlePaint(event, isRightClick = false) {
        if (!this.mapReady)
            return;
        const paintId = isRightClick ? null : this.currentPaintCountry;
        const { x, y } = this.getMapCoordinates(event.offsetX, event.offsetY);
        const province = this.getProvinceAt(x, y);
        if (province && province.id !== 'OCEAN') {
            const currentOwner = this.provinceOwnerMap.get(province.id);
            const newOwner = paintId;
            if (currentOwner !== newOwner) {
                if (newOwner === null) {
                    this.provinceOwnerMap.delete(province.id);
                }
                else {
                    this.provinceOwnerMap.set(province.id, newOwner);
                }
                this.buildPoliticalMap();
                this.buildBorderMap();
            }
        }
    }
    getProvinceAt(x, y) {
        if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) {
            return null;
        }
        const pixelData = this.hiddenCtx.getImageData(x, y, 1, 1).data;
        const colorKey = `${pixelData[0]},${pixelData[1]},${pixelData[2]}`;
        return provinceColorMap.get(colorKey) || null;
    }
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    }
    startPulseAnimation() {
        if (this.pulseAnimationId)
            this.stopPulseAnimation();
        this.pulseStartTime = null;
        const pulse = (timestamp) => {
            if (!this.pulseStartTime)
                this.pulseStartTime = timestamp;
            const elapsed = timestamp - this.pulseStartTime;
            const progress = (elapsed % 1500) / 1500;
            const sinValue = Math.sin(progress * Math.PI);
            this.pulseOpacity = (sinValue * 0.4) + 0.3;
            this.drawOverlays();
            this.render();
            this.pulseAnimationId = requestAnimationFrame(pulse);
        };
        this.pulseAnimationId = requestAnimationFrame(pulse);
    }
    stopPulseAnimation() {
        if (this.pulseAnimationId) {
            cancelAnimationFrame(this.pulseAnimationId);
        }
        this.pulseAnimationId = null;
        this.pulseStartTime = null;
        this.pulseOpacity = 0.7;
    }
    drawOverlays() {
        this.overlayCtx.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
        // Only draw selection highlight, no hover
        if (this.selectedProvinceId && !this.isEditorMode) {
            const borders = provinceBorders.get(this.selectedProvinceId);
            if (borders) {
                this.overlayCtx.fillStyle = `rgba(${this.pulseColor}, ${this.pulseOpacity})`;
                for (const [x, y] of borders) {
                    this.overlayCtx.fillRect(x - 1, y - 1, 3, 3);
                }
            }
        }
        // Draw country labels from cache
        this.drawCountryLabelsFromCache();
    }
    async calculateCountryLabelPositionsAsync() {
        if (!this.mapReady || !this.politicalMapReady)
            return;
        console.log("Calculating country label positions with largest rectangle algorithm...");
        this.countryLabelCache.clear();
        const countryProvinceMap = new Map();
        // Group provinces by country
        for (const [provinceId, countryId] of this.provinceOwnerMap.entries()) {
            if (!countryProvinceMap.has(countryId)) {
                countryProvinceMap.set(countryId, []);
            }
            countryProvinceMap.get(countryId).push(provinceId);
        }
        let processed = 0;
        for (const [countryId, provinceIds] of countryProvinceMap.entries()) {
            const countryInfo = this.allCountryData.get(countryId);
            if (!countryInfo)
                continue;
            // Step 1: Find bounding box
            let minX = MAP_WIDTH;
            let minY = MAP_HEIGHT;
            let maxX = 0;
            let maxY = 0;
            for (const pId of provinceIds) {
                for (let y = 0; y < MAP_HEIGHT; y += 50) {
                    for (let x = 0; x < MAP_WIDTH; x += 50) {
                        const pixelData = this.hiddenCtx.getImageData(x, y, 1, 1).data;
                        const colorKey = `${pixelData[0]},${pixelData[1]},${pixelData[2]}`;
                        const foundProvince = provinceColorMap.get(colorKey);
                        if (foundProvince?.id === pId) {
                            minX = Math.min(minX, x);
                            minY = Math.min(minY, y);
                            maxX = Math.max(maxX, x);
                            maxY = Math.max(maxY, y);
                        }
                    }
                }
            }
            if (minX >= maxX || minY >= maxY)
                continue;
            const width = maxX - minX;
            const height = maxY - minY;
            const size = Math.min(width, height);
            // Step 2: Determine scaling factor based on country size
            let scalingFactor = 1;
            if (size < 100) {
                scalingFactor = 10;
            }
            else if (size < 250) {
                scalingFactor = 20;
            }
            else if (size < 500) {
                scalingFactor = 30;
            }
            else if (size < 1000) {
                scalingFactor = 40;
            }
            else {
                scalingFactor = 50;
            }
            // Step 3: Create boolean grid (true = country territory)
            const gridWidth = Math.ceil(width / scalingFactor);
            const gridHeight = Math.ceil(height / scalingFactor);
            const grid = Array(gridWidth).fill(null).map(() => Array(gridHeight).fill(false));
            for (let gy = 0; gy < gridHeight; gy++) {
                for (let gx = 0; gx < gridWidth; gx++) {
                    const worldX = minX + gx * scalingFactor;
                    const worldY = minY + gy * scalingFactor;
                    if (worldX < MAP_WIDTH && worldY < MAP_HEIGHT) {
                        const pixelData = this.hiddenCtx.getImageData(worldX, worldY, 1, 1).data;
                        const colorKey = `${pixelData[0]},${pixelData[1]},${pixelData[2]}`;
                        const foundProvince = provinceColorMap.get(colorKey);
                        if (foundProvince && provinceIds.includes(foundProvince.id)) {
                            grid[gx][gy] = true;
                        }
                    }
                }
            }
            // Step 4: Find largest inscribed rectangle
            const largestRect = this.findLargestInscribedRectangle(grid);
            // Step 5: Convert back to world coordinates and place label at center
            const rectWorldX = minX + largestRect.x * scalingFactor;
            const rectWorldY = minY + largestRect.y * scalingFactor;
            const rectWorldWidth = largestRect.width * scalingFactor;
            const rectWorldHeight = largestRect.height * scalingFactor;
            const centerX = rectWorldX + rectWorldWidth / 2;
            const centerY = rectWorldY + rectWorldHeight / 2;
            this.countryLabelCache.set(countryId, {
                x: centerX,
                y: centerY
            });
            processed++;
            // Yield to browser every 5 countries
            if (processed % 5 === 0) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
        console.log(`Cached ${this.countryLabelCache.size} country label positions`);
        this.drawOverlays();
        this.render();
    }
    findLargestInscribedRectangle(grid) {
        if (grid.length === 0 || grid[0].length === 0) {
            return { x: 0, y: 0, width: 0, height: 0 };
        }
        const rows = grid[0].length;
        const cols = grid.length;
        const heights = new Array(cols).fill(0);
        let largestRect = { x: 0, y: 0, width: 0, height: 0 };
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (grid[col][row]) {
                    heights[col]++;
                }
                else {
                    heights[col] = 0;
                }
            }
            const rectForRow = this.largestRectangleInHistogram(heights);
            if (rectForRow.width * rectForRow.height > largestRect.width * largestRect.height) {
                largestRect = {
                    x: rectForRow.x,
                    y: row - rectForRow.height + 1,
                    width: rectForRow.width,
                    height: rectForRow.height,
                };
            }
        }
        return largestRect;
    }
    largestRectangleInHistogram(heights) {
        const stack = [];
        let maxArea = 0;
        let largestRect = { x: 0, y: 0, width: 0, height: 0 };
        for (let i = 0; i <= heights.length; i++) {
            const h = i === heights.length ? 0 : heights[i];
            while (stack.length > 0 && h < heights[stack[stack.length - 1]]) {
                const height = heights[stack.pop()];
                const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
                if (height * width > maxArea) {
                    maxArea = height * width;
                    largestRect = {
                        x: stack.length === 0 ? 0 : stack[stack.length - 1] + 1,
                        y: 0,
                        width: width,
                        height: height,
                    };
                }
            }
            stack.push(i);
        }
        return largestRect;
    }
    drawCountryLabelsFromCache() {
        if (!this.mapReady || !this.politicalMapReady)
            return;
        if (this.countryLabelCache.size === 0)
            return;
        const ctx = this.overlayCtx;
        // Calculate country sizes for dynamic font sizing
        const countrySizes = new Map();
        for (const [countryId, provinceIds] of Array.from(this.provinceOwnerMap.entries())
            .reduce((acc, [pId, cId]) => {
            if (!acc.has(cId))
                acc.set(cId, []);
            acc.get(cId).push(pId);
            return acc;
        }, new Map())) {
            countrySizes.set(countryId, provinceIds.length);
        }
        const maxSize = Math.max(...Array.from(countrySizes.values()));
        const minSize = Math.min(...Array.from(countrySizes.values()));
        const labels = [];
        for (const [countryId, position] of this.countryLabelCache.entries()) {
            const countryInfo = this.allCountryData.get(countryId);
            if (!countryInfo)
                continue;
            const countrySize = countrySizes.get(countryId) || 0;
            // Skip tiny countries at far zoom
            if (this.camera.zoom < 0.5 && countrySize < 100)
                continue;
            if (this.camera.zoom < 1.0 && countrySize < 30)
                continue;
            if (this.camera.zoom < 2.0 && countrySize < 10)
                continue;
            // Dynamic font size based on country size (normalized between min/max)
            const sizeRatio = (countrySize - minSize) / (maxSize - minSize);
            const baseFontSize = 16 + (sizeRatio * 32); // 16-48px range
            // Scale with zoom
            let fontSize = baseFontSize;
            if (this.camera.zoom < 0.5) {
                fontSize *= 2.0;
            }
            else if (this.camera.zoom < 1.0) {
                fontSize *= 1.5;
            }
            else if (this.camera.zoom > 3.0) {
                fontSize *= 0.8;
            }
            fontSize = Math.max(14, Math.min(56, fontSize));
            // Letter spacing based on country size - MORE spacing like HOI4
            const letterSpacing = 4 + (sizeRatio * 12); // 4-16px
            // Convert name to uppercase for HOI4 style
            const displayName = countryInfo.name.toUpperCase();
            // Measure text with letter spacing for collision detection
            ctx.font = `900 ${fontSize}px Arial, sans-serif`; // 900 = extra bold
            const textMetrics = ctx.measureText(displayName);
            const baseWidth = textMetrics.width;
            const spacingWidth = letterSpacing * (displayName.length - 1);
            const textWidth = baseWidth + spacingWidth;
            const textHeight = fontSize;
            labels.push({
                countryId,
                name: displayName,
                x: position.x,
                y: position.y,
                fontSize,
                letterSpacing,
                width: textWidth + 40,
                height: textHeight + 25,
                size: countrySize
            });
        }
        // Sort by size (biggest first) for collision detection priority
        labels.sort((a, b) => b.size - a.size);
        // Collision detection
        const drawnLabels = [];
        for (const label of labels) {
            let collides = false;
            for (const drawn of drawnLabels) {
                const padding = 25;
                if (!(label.x + label.width / 2 + padding < drawn.x - drawn.width / 2 ||
                    label.x - label.width / 2 > drawn.x + drawn.width / 2 + padding ||
                    label.y + label.height / 2 + padding < drawn.y - drawn.height / 2 ||
                    label.y - label.height / 2 > drawn.y + drawn.height / 2 + padding)) {
                    collides = true;
                    break;
                }
            }
            if (!collides) {
                drawnLabels.push(label);
            }
        }
        // Draw non-colliding labels with letter spacing and italic
        for (const label of drawnLabels) {
            ctx.save();
            // Use extra bold font with italic
            ctx.font = `italic 900 ${label.fontSize}px Arial, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // Draw each letter individually for letter spacing
            const chars = label.name.split('');
            const totalWidth = chars.reduce((sum, char) => {
                return sum + ctx.measureText(char).width;
            }, 0) + (label.letterSpacing * (chars.length - 1));
            let currentX = label.x - totalWidth / 2;
            for (const char of chars) {
                const charWidth = ctx.measureText(char).width;
                const charX = currentX + charWidth / 2;
                // Draw THICK black outline like HOI4 (multiple passes for thickness)
                ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
                ctx.lineWidth = 5.5;
                ctx.lineJoin = 'round';
                ctx.miterLimit = 2;
                // Draw outline multiple times for extra thickness
                ctx.strokeText(char, charX, label.y);
                ctx.lineWidth = 4.5;
                ctx.strokeText(char, charX, label.y);
                // Draw white text on top
                ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                ctx.fillText(char, charX, label.y);
                currentX += charWidth + label.letterSpacing;
            }
            ctx.restore();
        }
    }
    render() {
        if (!this.mapReady)
            return;
        const ctx = this.visibleCtx;
        ctx.save();
        ctx.fillStyle = '#334a5e';
        ctx.fillRect(0, 0, this.visibleCanvas.width, this.visibleCanvas.height);
        ctx.translate(this.camera.x, this.camera.y);
        ctx.scale(this.camera.zoom, this.camera.zoom);
        ctx.imageSmoothingEnabled = false;
        // Draw terrain at reduced opacity
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.4; // Dim the terrain significantly
        ctx.drawImage(this.processedTerrainCanvas, 0, 0);
        // Draw strong political colors on top
        if (this.politicalMapReady) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 0.85; // Strong but not fully opaque
            ctx.drawImage(this.politicalCanvas, 0, 0);
        }
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1.0;
        ctx.globalAlpha = 0.7;
        ctx.drawImage(this.recoloredRiversCanvas, 0, 0);
        ctx.globalAlpha = 1.0;
        if (this.bordersReady) {
            ctx.drawImage(this.borderCanvas, 0, 0);
        }
        ctx.drawImage(this.overlayCanvas, 0, 0);
        ctx.restore();
    }
    handleResize() {
        if (!this.container || !this.visibleCanvas)
            return;
        this.visibleCanvas.width = this.container.clientWidth;
        this.visibleCanvas.height = this.container.clientHeight;
        this.resetCamera();
        this.render();
    }
    buildPoliticalMap() {
        if (!this.mapReady || !this.allCountryData)
            return;
        console.log("Building political map texture...");
        this.politicalCtx.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
        const imageData = this.hiddenCtx.getImageData(0, 0, MAP_WIDTH, MAP_HEIGHT);
        const data = imageData.data;
        const politicalImageData = this.politicalCtx.createImageData(MAP_WIDTH, MAP_HEIGHT);
        const polData = politicalImageData.data;
        // Track which countries were affected for label recalculation
        const affectedCountries = new Set();
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            if (data[i + 3] === 0)
                continue;
            const colorKey = `${r},${g},${b}`;
            const province = provinceColorMap.get(colorKey);
            if (province && province.id !== 'OCEAN') {
                const ownerCountryId = this.provinceOwnerMap.get(province.id);
                if (ownerCountryId) {
                    const country = this.allCountryData.get(ownerCountryId);
                    if (country) {
                        const countryColor = this.hexToRgb(country.color);
                        polData[i] = countryColor[0];
                        polData[i + 1] = countryColor[1];
                        polData[i + 2] = countryColor[2];
                        polData[i + 3] = 255;
                        affectedCountries.add(ownerCountryId);
                    }
                }
            }
        }
        this.politicalCtx.putImageData(politicalImageData, 0, 0);
        this.politicalMapReady = true;
        console.log("Political map texture is built.");
        // Only recalculate labels for affected countries if labels already exist
        if (this.countryLabelCache.size > 0 && affectedCountries.size > 0) {
            this.recalculateLabelsForCountries(Array.from(affectedCountries));
        }
    }
    recalculateLabelsForCountries(countryIds) {
        console.log(`Recalculating labels for ${countryIds.length} countries...`);
        for (const countryId of countryIds) {
            const provinceIds = [];
            for (const [pId, cId] of this.provinceOwnerMap.entries()) {
                if (cId === countryId) {
                    provinceIds.push(pId);
                }
            }
            if (provinceIds.length === 0) {
                this.countryLabelCache.delete(countryId);
                continue;
            }
            let totalX = 0;
            let totalY = 0;
            let count = 0;
            for (const pId of provinceIds) {
                for (let y = 0; y < MAP_HEIGHT; y += 50) {
                    for (let x = 0; x < MAP_WIDTH; x += 50) {
                        const pixelData = this.hiddenCtx.getImageData(x, y, 1, 1).data;
                        const colorKey = `${pixelData[0]},${pixelData[1]},${pixelData[2]}`;
                        const foundProvince = provinceColorMap.get(colorKey);
                        if (foundProvince?.id === pId) {
                            totalX += x;
                            totalY += y;
                            count++;
                        }
                    }
                }
            }
            if (count > 0) {
                this.countryLabelCache.set(countryId, {
                    x: totalX / count,
                    y: totalY / count
                });
            }
        }
        this.drawOverlays();
        this.render();
    }
    buildBorderMap() {
        if (!this.mapReady || !this.politicalMapReady) {
            console.warn("Cannot build borders until map and political data are ready.");
            return;
        }
        console.log("Building static COUNTRY border map...");
        this.borderCtx.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
        this.borderCtx.fillStyle = '#000000';
        this.borderCtx.globalAlpha = 0.7;
        const neighbors = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const [provinceId, borders] of provinceBorders.entries()) {
            if (provinceId === 'OCEAN')
                continue;
            const owner1 = this.provinceOwnerMap.get(provinceId);
            for (const [x, y] of borders) {
                let isCountryBorder = false;
                for (const [dx, dy] of neighbors) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx < 0 || nx >= MAP_WIDTH || ny < 0 || ny >= MAP_HEIGHT)
                        continue;
                    const neighborProv = this.getProvinceAt(nx, ny);
                    if (!neighborProv || neighborProv.id === 'OCEAN')
                        continue;
                    if (neighborProv.id === provinceId)
                        continue;
                    const owner2 = this.provinceOwnerMap.get(neighborProv.id);
                    if (owner1 !== owner2) {
                        isCountryBorder = true;
                        break;
                    }
                }
                if (isCountryBorder) {
                    this.borderCtx.fillRect(x, y, 2, 2);
                }
            }
        }
        this.borderCtx.globalAlpha = 1.0;
        this.bordersReady = true;
        this.render();
        console.log("Static COUNTRY border map is built.");
    }
    async importAndAutoAssignCSV(csvPath = './definition.csv') {
        try {
            const response = await fetch(csvPath);
            if (!response.ok)
                throw new Error(`Failed to load ${csvPath}`);
            const text = await response.text();
            const lines = text.split('\n');
            let assigned = 0;
            let unassigned = 0;
            const unassignedProvinces = [];
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line)
                    continue;
                const parts = line.split(';');
                if (parts.length < 5)
                    continue;
                const provinceId = parts[0].trim();
                const red = parseInt(parts[1]);
                const green = parseInt(parts[2]);
                const blue = parseInt(parts[3]);
                const provinceName = parts[4].trim();
                const colorKey = `${red},${green},${blue}`;
                const province = provinceColorMap.get(colorKey);
                if (province && province.id !== 'OCEAN') {
                    const detectedCountry = this.detectCountryFromName(provinceName);
                    if (detectedCountry) {
                        this.provinceOwnerMap.set(province.id, detectedCountry);
                        assigned++;
                    }
                    else {
                        unassigned++;
                        unassignedProvinces.push(`${province.id}: ${provinceName}`);
                    }
                }
            }
            console.log(`Auto-Assignment Results:`);
            console.log(`✅ Assigned: ${assigned} provinces`);
            console.log(`❌ Unassigned: ${unassigned} provinces`);
            if (unassignedProvinces.length > 0 && unassignedProvinces.length <= 20) {
                console.log(`Unassigned provinces:`, unassignedProvinces);
            }
            this.buildPoliticalMap();
            this.buildBorderMap();
            this.showNotification(`Auto-assigned ${assigned} provinces, ${unassigned} need manual assignment`, 'success');
        }
        catch (error) {
            console.error('CSV Import failed:', error);
            this.showNotification('Failed to import CSV', 'error');
        }
    }
    detectCountryFromName(provinceName) {
        const normalizedName = provinceName.toLowerCase().trim();
        for (const rule of COUNTRY_DETECTION_RULES) {
            for (const keyword of rule.keywords) {
                if (normalizedName.includes(keyword.toLowerCase())) {
                    return rule.country;
                }
            }
        }
        return null;
    }
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '80px';
        notification.style.right = '20px';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '6px';
        notification.style.color = 'white';
        notification.style.fontWeight = 'bold';
        notification.style.zIndex = '10000';
        notification.style.backgroundColor = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8';
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
    updateCountries(countries, allCountries) {
        this.countries = countries;
        this.allCountryData = allCountries;
    }
    setProvinceOwnerMap(ownerMap) {
        console.log("Loading province owner map...");
        this.provinceOwnerMap = new Map(ownerMap);
        if (this.mapReady) {
            this.buildPoliticalMap();
            this.buildBorderMap();
        }
    }
    setSelectedCountry(provinceId) {
        this.selectedProvinceId = provinceId;
        if (provinceId === null) {
            this.stopPulseAnimation();
        }
        this.drawOverlays();
        this.render();
    }
    setEditorMode(enabled) {
        this.isEditorMode = enabled;
        console.log(`Editor Mode: ${this.isEditorMode}`);
        this.setSelectedCountry(null);
        this.lastHoveredProvince = null;
        this.drawOverlays();
        this.render();
    }
    setPaintCountry(countryId) {
        console.log(`Setting paint country to: ${countryId}`);
        this.currentPaintCountry = countryId;
    }
    exportMapData() {
        console.log("Generating map data for export...");
        let fileContent = `
// This file is auto-generated by the in-game map editor.
// Copy this content and paste it into 'src/provinceAssignments.ts'

export const provinceToCountryMap = new Map<string, string>([
`;
        const sortedEntries = [...this.provinceOwnerMap.entries()].sort((a, b) => {
            return parseInt(a[0]) - parseInt(b[0]);
        });
        for (const [provinceId, countryId] of sortedEntries) {
            fileContent += `    ["${provinceId}", "${countryId}"],\n`;
        }
        fileContent += ']);\n';
        console.log("Export data generated.");
        return fileContent;
    }
    destroy() {
        if (this.visibleCanvas.parentElement) {
            this.visibleCanvas.parentElement.removeChild(this.visibleCanvas);
        }
        if (this.hiddenCanvas.parentElement) {
            this.hiddenCanvas.parentElement.removeChild(this.hiddenCanvas);
        }
        if (this.politicalCanvas.parentElement) {
            this.politicalCanvas.parentElement.removeChild(this.politicalCanvas);
        }
        if (this.overlayCanvas.parentElement) {
            this.overlayCanvas.parentElement.removeChild(this.overlayCanvas);
        }
        if (this.borderCanvas.parentElement) {
            this.borderCanvas.parentElement.removeChild(this.borderCanvas);
        }
        if (this.recoloredRiversCanvas.parentElement) {
            this.recoloredRiversCanvas.parentElement.removeChild(this.recoloredRiversCanvas);
        }
        if (this.processedTerrainCanvas.parentElement) {
            this.processedTerrainCanvas.parentElement.removeChild(this.processedTerrainCanvas);
        }
        window.removeEventListener('resize', () => this.handleResize());
    }
    isMapReady() {
        return this.mapReady && this.politicalMapReady;
    }
    forceRender() {
        this.render();
    }
    async calculateLabels() {
        await this.calculateCountryLabelPositionsAsync();
    }
}
//# sourceMappingURL=provinceMap.js.map