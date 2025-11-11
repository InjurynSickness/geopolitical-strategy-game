export class HOI4MapRenderer {
    canvas;
    ctx;
    container;
    // Data
    countries;
    provinces;
    states;
    // UI State
    selectedCountryId = null;
    hoveredCountryId = null;
    hoveredProvinceId = null;
    currentMapMode;
    onCountrySelect;
    // Camera
    camera = { x: 0, y: 0, zoom: 1 };
    isDragging = false;
    lastMousePos = { x: 0, y: 0 };
    // Map projection
    mapWidth = 1000;
    mapHeight = 500;
    projectionScale = 150;
    // Border styles
    provinceBorderWidth = 0.5;
    stateBorderWidth = 1.5;
    countryBorderWidth = 2.5;
    // Map modes
    mapModes;
    constructor(container, onCountrySelect) {
        this.container = container;
        this.countries = new Map();
        this.provinces = new Map();
        this.states = new Map();
        this.onCountrySelect = onCountrySelect;
        // Initialize map modes
        this.mapModes = this.initializeMapModes();
        this.currentMapMode = this.mapModes.get('political');
        this.initializeCanvas();
        this.generateProvinces();
        this.setupInteractions();
        this.render();
    }
    initializeCanvas() {
        console.log('Initializing HOI4-style map...');
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.container.clientWidth - 20;
        this.canvas.height = this.container.clientHeight - 20;
        this.canvas.style.backgroundColor = '#1a2332'; // HOI4-style dark blue water
        this.canvas.style.border = '1px solid #444';
        this.canvas.style.cursor = 'grab';
        this.container.appendChild(this.canvas);
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get 2D context');
        }
        this.ctx = context;
        // Center camera
        this.camera.x = this.canvas.width / 2 - (this.mapWidth * this.projectionScale) / 2;
        this.camera.y = this.canvas.height / 2 - (this.mapHeight * this.projectionScale) / 2;
        window.addEventListener('resize', () => this.handleResize());
    }
    initializeMapModes() {
        const modes = new Map();
        // Political map mode (default)
        modes.set('political', {
            name: 'Political',
            getProvinceColor: (province, state, country) => {
                if (!country)
                    return '#3a3a3a';
                return country.color || '#666666';
            }
        });
        // Terrain map mode
        modes.set('terrain', {
            name: 'Terrain',
            getProvinceColor: (province, state, country) => {
                const terrainColors = {
                    'plains': '#8fbc8f',
                    'mountain': '#8b7355',
                    'hills': '#9acd32',
                    'forest': '#228b22',
                    'desert': '#f4a460',
                    'urban': '#696969'
                };
                return terrainColors[province.terrainType] || '#8fbc8f';
            }
        });
        // Infrastructure map mode
        modes.set('infrastructure', {
            name: 'Infrastructure',
            getProvinceColor: (province, state, country) => {
                const infraLevel = state.infrastructure;
                const intensity = Math.floor((infraLevel / 10) * 255);
                return `rgb(${intensity}, ${intensity}, ${Math.min(intensity + 50, 255)})`;
            }
        });
        return modes;
    }
    generateProvinces() {
        console.log('Generating HOI4-style provinces...');
        // This is a simplified province generation system
        // In a real implementation, you'd load actual province data from files
        // Generate provinces for each major country with subdivisions
        const countryProvinceData = [
            {
                countryId: 'USA',
                name: 'United States',
                stateCount: 48,
                provincesPerState: 3,
                bounds: { minLon: -125, maxLon: -70, minLat: 30, maxLat: 48 }
            },
            {
                countryId: 'CHN',
                name: 'China',
                stateCount: 22,
                provincesPerState: 4,
                bounds: { minLon: 75, maxLon: 135, minLat: 20, maxLat: 50 }
            },
            {
                countryId: 'RUS',
                name: 'Russia',
                stateCount: 45,
                provincesPerState: 4,
                bounds: { minLon: 20, maxLon: 180, minLat: 50, maxLat: 70 }
            },
            {
                countryId: 'GBR',
                name: 'United Kingdom',
                stateCount: 12,
                provincesPerState: 2,
                bounds: { minLon: -8, maxLon: 2, minLat: 50, maxLat: 59 }
            },
            {
                countryId: 'FRA',
                name: 'France',
                stateCount: 22,
                provincesPerState: 2,
                bounds: { minLon: -5, maxLon: 8, minLat: 42, maxLat: 51 }
            },
            {
                countryId: 'DEU',
                name: 'Germany',
                stateCount: 16,
                provincesPerState: 3,
                bounds: { minLon: 6, maxLon: 15, minLat: 47, maxLat: 55 }
            },
            {
                countryId: 'JPN',
                name: 'Japan',
                stateCount: 12,
                provincesPerState: 3,
                bounds: { minLon: 129, maxLon: 146, minLat: 30, maxLat: 46 }
            }
        ];
        let provinceIdCounter = 1;
        let stateIdCounter = 1;
        for (const countryData of countryProvinceData) {
            const { bounds, stateCount, provincesPerState, countryId } = countryData;
            // Calculate grid dimensions for this country
            const lonRange = bounds.maxLon - bounds.minLon;
            const latRange = bounds.maxLat - bounds.minLat;
            // Create states
            for (let stateIdx = 0; stateIdx < stateCount; stateIdx++) {
                const stateId = stateIdCounter++;
                const stateProvinceIds = [];
                // Create provinces within this state
                for (let provIdx = 0; provIdx < provincesPerState; provIdx++) {
                    const provinceId = provinceIdCounter++;
                    // Calculate province position (simplified grid)
                    const totalProvinces = stateCount * provincesPerState;
                    const globalIdx = stateIdx * provincesPerState + provIdx;
                    const cols = Math.ceil(Math.sqrt(totalProvinces));
                    const row = Math.floor(globalIdx / cols);
                    const col = globalIdx % cols;
                    const provWidth = lonRange / cols;
                    const provHeight = latRange / Math.ceil(totalProvinces / cols);
                    const minLon = bounds.minLon + col * provWidth;
                    const maxLon = minLon + provWidth;
                    const minLat = bounds.minLat + row * provHeight;
                    const maxLat = minLat + provHeight;
                    // Create rectangular province geometry
                    const geometry = [
                        [minLon, maxLat],
                        [maxLon, maxLat],
                        [maxLon, minLat],
                        [minLon, minLat],
                        [minLon, maxLat] // Close the polygon
                    ];
                    const [centerX, centerY] = this.projectCoordinate((minLon + maxLon) / 2, (minLat + maxLat) / 2);
                    const terrainTypes = ['plains', 'mountain', 'hills', 'forest', 'desert', 'urban'];
                    const randomTerrain = terrainTypes[Math.floor(Math.random() * terrainTypes.length)];
                    const province = {
                        id: provinceId,
                        stateId: stateId,
                        countryId: countryId,
                        name: `${countryData.name} Province ${provinceId}`,
                        geometry: geometry,
                        center: { x: centerX, y: centerY },
                        neighbors: [],
                        isCoastal: row === 0 || col === 0 || col === cols - 1,
                        terrainType: randomTerrain
                    };
                    this.provinces.set(provinceId, province);
                    stateProvinceIds.push(provinceId);
                }
                // Create state
                const state = {
                    id: stateId,
                    countryId: countryId,
                    name: `${countryData.name} State ${stateId}`,
                    provinces: stateProvinceIds,
                    capitalProvince: stateProvinceIds[0],
                    infrastructure: Math.floor(Math.random() * 10) + 1,
                    civilianFactories: Math.floor(Math.random() * 5),
                    militaryFactories: Math.floor(Math.random() * 3)
                };
                this.states.set(stateId, state);
            }
        }
        console.log(`Generated ${this.provinces.size} provinces across ${this.states.size} states`);
    }
    setupInteractions() {
        // Mouse down
        this.canvas.addEventListener('mousedown', (event) => {
            const provinceId = this.getProvinceAtPosition(event.offsetX, event.offsetY);
            if (provinceId !== null) {
                const province = this.provinces.get(provinceId);
                if (province) {
                    this.selectedCountryId = province.countryId;
                    this.onCountrySelect(province.countryId);
                    this.render();
                }
            }
            else {
                this.isDragging = true;
                this.lastMousePos.x = event.clientX;
                this.lastMousePos.y = event.clientY;
                this.canvas.style.cursor = 'grabbing';
            }
        });
        // Mouse up
        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.canvas.style.cursor = 'grab';
        });
        // Mouse move
        this.canvas.addEventListener('mousemove', (event) => {
            if (this.isDragging) {
                const deltaX = event.clientX - this.lastMousePos.x;
                const deltaY = event.clientY - this.lastMousePos.y;
                this.camera.x += deltaX;
                this.camera.y += deltaY;
                this.lastMousePos.x = event.clientX;
                this.lastMousePos.y = event.clientY;
                this.render();
                return;
            }
            const provinceId = this.getProvinceAtPosition(event.offsetX, event.offsetY);
            if (provinceId !== this.hoveredProvinceId) {
                this.hoveredProvinceId = provinceId;
                if (provinceId !== null) {
                    const province = this.provinces.get(provinceId);
                    if (province) {
                        this.hoveredCountryId = province.countryId;
                        this.canvas.style.cursor = 'pointer';
                    }
                }
                else {
                    this.hoveredCountryId = null;
                    this.canvas.style.cursor = 'grab';
                }
                this.render();
            }
        });
        // Mouse leave
        this.canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
            this.hoveredProvinceId = null;
            this.hoveredCountryId = null;
            this.canvas.style.cursor = 'grab';
            this.render();
        });
        // Zoom
        this.canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
            const newZoom = Math.max(0.5, Math.min(5, this.camera.zoom * zoomFactor));
            this.camera.x = mouseX - (mouseX - this.camera.x) * (newZoom / this.camera.zoom);
            this.camera.y = mouseY - (mouseY - this.camera.y) * (newZoom / this.camera.zoom);
            this.camera.zoom = newZoom;
            this.render();
        });
    }
    projectCoordinate(lon, lat) {
        // Equirectangular projection
        const x = (lon + 180) * (this.mapWidth / 360) * this.projectionScale;
        const y = (90 - lat) * (this.mapHeight / 180) * this.projectionScale;
        return [x, y];
    }
    getProvinceAtPosition(mouseX, mouseY) {
        const worldX = (mouseX - this.camera.x) / this.camera.zoom;
        const worldY = (mouseY - this.camera.y) / this.camera.zoom;
        for (const [id, province] of this.provinces) {
            if (this.isPointInProvince(worldX, worldY, province)) {
                return id;
            }
        }
        return null;
    }
    isPointInProvince(x, y, province) {
        const projected = province.geometry.map(([lon, lat]) => this.projectCoordinate(lon, lat));
        return this.isPointInPolygon(x, y, projected);
    }
    isPointInPolygon(x, y, polygon) {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i][0], yi = polygon[i][1];
            const xj = polygon[j][0], yj = polygon[j][1];
            if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
                inside = !inside;
            }
        }
        return inside;
    }
    render() {
        // Clear canvas - draw ocean
        this.ctx.fillStyle = '#1a2332'; // Dark blue ocean
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Apply camera transform
        this.ctx.save();
        this.ctx.translate(this.camera.x, this.camera.y);
        this.ctx.scale(this.camera.zoom, this.camera.zoom);
        // Draw provinces
        this.drawProvinces();
        // Draw borders (multiple passes for layering)
        this.drawProvinceBorders();
        this.drawStateBorders();
        this.drawCountryBorders();
        // Draw province names (if zoomed in enough)
        if (this.camera.zoom > 1.5) {
            this.drawProvinceNames();
        }
        this.ctx.restore();
        // Draw UI
        this.drawUI();
    }
    drawProvinces() {
        for (const [id, province] of this.provinces) {
            const state = this.states.get(province.stateId);
            const country = this.countries.get(province.countryId);
            const isSelected = this.selectedCountryId === province.countryId;
            const isHovered = this.hoveredProvinceId === id;
            // Get color from current map mode
            let fillColor = this.currentMapMode.getProvinceColor(province, state, country);
            // Brighten if hovered
            if (isHovered) {
                fillColor = this.lightenColor(fillColor, 0.3);
            }
            // Darken slightly if selected (to show it's active)
            if (isSelected && !isHovered) {
                fillColor = this.lightenColor(fillColor, 0.1);
            }
            // Draw province fill
            this.ctx.fillStyle = fillColor;
            this.ctx.beginPath();
            const projected = province.geometry.map(([lon, lat]) => this.projectCoordinate(lon, lat));
            for (let i = 0; i < projected.length; i++) {
                const [x, y] = projected[i];
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                }
                else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.closePath();
            this.ctx.fill();
        }
    }
    drawProvinceBorders() {
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = this.provinceBorderWidth / this.camera.zoom;
        this.ctx.globalAlpha = 0.3;
        for (const province of this.provinces.values()) {
            this.ctx.beginPath();
            const projected = province.geometry.map(([lon, lat]) => this.projectCoordinate(lon, lat));
            for (let i = 0; i < projected.length; i++) {
                const [x, y] = projected[i];
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                }
                else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.closePath();
            this.ctx.stroke();
        }
        this.ctx.globalAlpha = 1.0;
    }
    drawStateBorders() {
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = this.stateBorderWidth / this.camera.zoom;
        this.ctx.globalAlpha = 0.6;
        // Draw borders between provinces of different states
        for (const province of this.provinces.values()) {
            this.ctx.beginPath();
            const projected = province.geometry.map(([lon, lat]) => this.projectCoordinate(lon, lat));
            // Check if any neighbor is in a different state
            const hasDifferentStateNeighbor = province.neighbors.some(neighborId => {
                const neighbor = this.provinces.get(neighborId);
                return neighbor && neighbor.stateId !== province.stateId;
            });
            if (hasDifferentStateNeighbor) {
                for (let i = 0; i < projected.length; i++) {
                    const [x, y] = projected[i];
                    if (i === 0) {
                        this.ctx.moveTo(x, y);
                    }
                    else {
                        this.ctx.lineTo(x, y);
                    }
                }
                this.ctx.closePath();
                this.ctx.stroke();
            }
        }
        this.ctx.globalAlpha = 1.0;
    }
    drawCountryBorders() {
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = this.countryBorderWidth / this.camera.zoom;
        this.ctx.globalAlpha = 1.0;
        // Draw thick borders between different countries
        for (const province of this.provinces.values()) {
            const projected = province.geometry.map(([lon, lat]) => this.projectCoordinate(lon, lat));
            // Check each edge
            for (let i = 0; i < projected.length - 1; i++) {
                const neighborId = province.neighbors[i];
                if (neighborId) {
                    const neighbor = this.provinces.get(neighborId);
                    // If neighbor is in different country, draw thick border
                    if (neighbor && neighbor.countryId !== province.countryId) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(projected[i][0], projected[i][1]);
                        this.ctx.lineTo(projected[i + 1][0], projected[i + 1][1]);
                        this.ctx.stroke();
                    }
                }
            }
        }
        // Highlight selected country border
        if (this.selectedCountryId) {
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = (this.countryBorderWidth + 1) / this.camera.zoom;
            this.ctx.globalAlpha = 0.8;
            for (const province of this.provinces.values()) {
                if (province.countryId === this.selectedCountryId) {
                    const projected = province.geometry.map(([lon, lat]) => this.projectCoordinate(lon, lat));
                    for (let i = 0; i < projected.length - 1; i++) {
                        const neighborId = province.neighbors[i];
                        if (neighborId) {
                            const neighbor = this.provinces.get(neighborId);
                            if (neighbor && neighbor.countryId !== province.countryId) {
                                this.ctx.beginPath();
                                this.ctx.moveTo(projected[i][0], projected[i][1]);
                                this.ctx.lineTo(projected[i + 1][0], projected[i + 1][1]);
                                this.ctx.stroke();
                            }
                        }
                    }
                }
            }
        }
        this.ctx.globalAlpha = 1.0;
    }
    drawProvinceNames() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;
        this.ctx.font = `${12 / this.camera.zoom}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        for (const province of this.provinces.values()) {
            const state = this.states.get(province.stateId);
            // Only draw capital province names
            if (state && province.id === state.capitalProvince) {
                const text = state.name;
                this.ctx.strokeText(text, province.center.x, province.center.y);
                this.ctx.fillText(text, province.center.x, province.center.y);
            }
        }
    }
    drawUI() {
        // Draw control panel
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(10, 10, 250, 120);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        let yPos = 30;
        this.ctx.fillText(`Zoom: ${(this.camera.zoom * 100).toFixed(0)}%`, 20, yPos);
        yPos += 20;
        this.ctx.fillText(`Provinces: ${this.provinces.size}`, 20, yPos);
        yPos += 20;
        this.ctx.fillText(`States: ${this.states.size}`, 20, yPos);
        yPos += 20;
        this.ctx.fillText(`Map Mode: ${this.currentMapMode.name}`, 20, yPos);
        yPos += 20;
        this.ctx.font = '11px Arial';
        this.ctx.fillStyle = '#aaaaaa';
        this.ctx.fillText('Scroll: Zoom | Drag: Pan | Click: Select', 20, yPos);
        // Draw province info if hovered
        if (this.hoveredProvinceId !== null) {
            const province = this.provinces.get(this.hoveredProvinceId);
            if (province) {
                const state = this.states.get(province.stateId);
                const country = this.countries.get(province.countryId);
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
                this.ctx.fillRect(10, this.canvas.height - 110, 280, 100);
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = 'bold 14px Arial';
                let infoY = this.canvas.height - 90;
                this.ctx.fillText(state?.name || 'Unknown State', 20, infoY);
                infoY += 20;
                this.ctx.font = '12px Arial';
                this.ctx.fillText(`Country: ${country?.name || 'Unknown'}`, 20, infoY);
                infoY += 18;
                this.ctx.fillText(`Infrastructure: ${state?.infrastructure || 0}/10`, 20, infoY);
                infoY += 18;
                this.ctx.fillText(`Terrain: ${province.terrainType}`, 20, infoY);
            }
        }
    }
    lightenColor(hex, percent) {
        // Handle rgb() format
        if (hex.startsWith('rgb')) {
            const match = hex.match(/\d+/g);
            if (match) {
                let [r, g, b] = match.map(Number);
                r = Math.min(255, r + Math.floor(percent * 255));
                g = Math.min(255, g + Math.floor(percent * 255));
                b = Math.min(255, b + Math.floor(percent * 255));
                return `rgb(${r}, ${g}, ${b})`;
            }
        }
        // Handle hex format
        const num = parseInt(hex.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent * 100);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    updateCountries(countries) {
        this.countries = countries;
        this.render();
    }
    setSelectedCountry(countryId) {
        this.selectedCountryId = countryId;
        this.render();
    }
    setMapMode(modeName) {
        const mode = this.mapModes.get(modeName);
        if (mode) {
            this.currentMapMode = mode;
            this.render();
        }
    }
    getAvailableMapModes() {
        return Array.from(this.mapModes.keys());
    }
    handleResize() {
        this.canvas.width = this.container.clientWidth - 20;
        this.canvas.height = this.container.clientHeight - 20;
        this.render();
    }
    destroy() {
        if (this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
    }
}
//# sourceMappingURL=hoi4Map.js.map