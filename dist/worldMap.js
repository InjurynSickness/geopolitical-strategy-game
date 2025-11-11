// --- WorldMapRenderer Class ---
export class WorldMapRenderer {
    canvas;
    ctx;
    container;
    countries;
    geoData = null;
    selectedCountryId = null;
    hoveredCountryId = null;
    onCountrySelect;
    // Camera controls
    camera = { x: 0, y: 0, zoom: 1 };
    isDragging = false;
    lastMousePos = { x: 0, y: 0 };
    // Map projection settings
    mapBaseWidth = 2000;
    mapBaseHeight = 1000;
    // Country code mapping
    countryCodeMap = new Map([
        ['USA', 'USA'],
        ['CHN', 'CHN'],
        ['RUS', 'RUS'],
        ['GBR', 'GBR'],
        ['FRA', 'FRA'],
        ['DEU', 'DEU'],
        ['JPN', 'JPN'],
    ]);
    constructor(container, onCountrySelect) {
        this.container = container;
        this.countries = new Map();
        this.onCountrySelect = onCountrySelect;
        this.initialize();
    }
    async initialize() {
        console.log('Initializing GeoJSON map...');
        this.initializeCanvas();
        this.setupInteractions();
        await this.loadWorldData(); // Load data
        this.resetCamera(); // Set camera
        this.render(); // Render
        window.addEventListener('resize', () => this.handleResize());
    }
    initializeCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
        this.canvas.style.backgroundColor = '#1a2332';
        this.canvas.style.cursor = 'grab';
        this.container.appendChild(this.canvas);
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get 2D context from canvas');
        }
        this.ctx = context;
        console.log(`Canvas initialized with size: ${this.canvas.width}x${this.canvas.height}`);
    }
    async loadWorldData() {
        console.log('Loading local world GeoJSON data (./map.geojson)...');
        const geoJsonUrl = './map.geojson';
        try {
            const response = await fetch(geoJsonUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch map data: ${response.statusText}. Make sure you have 'map.geojson' in your root folder.`);
            }
            const data = await response.json();
            // --- NEW: Filter out Antarctica ---
            if (data && data.features) {
                data.features = data.features.filter(feature => feature.properties.ADMIN !== 'Antarctica');
                this.geoData = data;
                console.log(`Loaded ${this.geoData.features.length} country features (Antarctica filtered)`);
            }
            else {
                throw new Error('GeoJSON data is invalid');
            }
            // --- END NEW ---
        }
        catch (error) {
            console.error('Error loading GeoJSON:', error);
            this.ctx.fillStyle = 'red';
            this.ctx.font = '18px Arial';
            this.ctx.fillText('Failed to load map.geojson.', 20, 50);
            this.ctx.fillText('Please ensure file exists in project root folder and is valid JSON.', 20, 80);
        }
    }
    resetCamera() {
        if (!this.canvas)
            return;
        this.camera.zoom = this.canvas.width / this.mapBaseWidth;
        this.camera.x = 0;
        this.camera.y = (this.canvas.height - (this.mapBaseHeight * this.camera.zoom)) / 2;
        // --- NEW: Clamp camera after reset ---
        this.clampCamera();
        console.log(`Camera reset: zoom=${this.camera.zoom}, x=${this.camera.x}, y=${this.camera.y}`);
    }
    // --- NEW: Function to clamp camera panning ---
    clampCamera() {
        const scaledWidth = this.mapBaseWidth * this.camera.zoom;
        const scaledHeight = this.mapBaseHeight * this.camera.zoom;
        // Don't let the map pan further left than the canvas edge
        this.camera.x = Math.min(0, this.camera.x);
        // Don't let the map pan further right than the canvas edge
        this.camera.x = Math.max(this.canvas.width - scaledWidth, this.camera.x);
        // Don't let the map pan further up than the canvas edge
        this.camera.y = Math.min(0, this.camera.y);
        // Don't let the map pan further down than the canvas edge
        this.camera.y = Math.max(this.canvas.height - scaledHeight, this.camera.y);
    }
    // --- END NEW ---
    setupInteractions() {
        this.canvas.addEventListener('mousedown', (event) => {
            // ... (rest of this function is unchanged)
            const countryId = this.getCountryAtPosition(event.offsetX, event.offsetY);
            if (countryId && this.countries.has(countryId)) {
                this.selectedCountryId = countryId;
                this.onCountrySelect(countryId);
                this.render();
            }
            else {
                this.isDragging = true;
                this.lastMousePos.x = event.clientX;
                this.lastMousePos.y = event.clientY;
                this.canvas.style.cursor = 'grabbing';
            }
        });
        this.canvas.addEventListener('mouseup', () => {
            // ... (rest of this function is unchanged)
            this.isDragging = false;
            this.canvas.style.cursor = 'grab';
        });
        this.canvas.addEventListener('mousemove', (event) => {
            if (this.isDragging) {
                const deltaX = event.clientX - this.lastMousePos.x;
                const deltaY = event.clientY - this.lastMousePos.y;
                this.camera.x += deltaX;
                this.camera.y += deltaY;
                // --- NEW: Clamp camera after panning ---
                this.clampCamera();
                this.lastMousePos.x = event.clientX;
                this.lastMousePos.y = event.clientY;
                this.render();
                return;
            }
            // ... (rest of this function is unchanged)
            const countryId = this.getCountryAtPosition(event.offsetX, event.offsetY);
            const newHoveredId = (countryId && this.countries.has(countryId)) ? countryId : null;
            if (newHoveredId !== this.hoveredCountryId) {
                this.hoveredCountryId = newHoveredId;
                this.canvas.style.cursor = newHoveredId ? 'pointer' : 'grab';
                this.render();
            }
        });
        this.canvas.addEventListener('mouseleave', () => {
            // ... (rest of this function is unchanged)
            this.isDragging = false;
            this.hoveredCountryId = null;
            this.canvas.style.cursor = 'grab';
            this.render();
        });
        this.canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
            // --- NEW: Clamp zoom level ---
            const newZoom = Math.max(this.canvas.width / this.mapBaseWidth, Math.min(10, this.camera.zoom * zoomFactor));
            // --- END NEW ---
            // --- NEW: Check if zoom actually changed ---
            if (newZoom === this.camera.zoom) {
                return;
            }
            this.camera.x = mouseX - (mouseX - this.camera.x) * (newZoom / this.camera.zoom);
            this.camera.y = mouseY - (mouseY - this.camera.y) * (newZoom / this.camera.zoom);
            this.camera.zoom = newZoom;
            // --- NEW: Clamp camera after zooming ---
            this.clampCamera();
            this.render();
        });
    }
    // --- All functions below this point are unchanged ---
    projectCoordinate(lon, lat) {
        const x = (lon + 180) * (this.mapBaseWidth / 360);
        const y = (90 - lat) * (this.mapBaseHeight / 180);
        return [x, y];
    }
    getWorldCoordinates(mouseX, mouseY) {
        const worldX = (mouseX - this.camera.x) / this.camera.zoom;
        const worldY = (mouseY - this.camera.y) / this.camera.zoom;
        return [worldX, worldY];
    }
    getCountryAtPosition(mouseX, mouseY) {
        if (!this.geoData)
            return null;
        const [worldX, worldY] = this.getWorldCoordinates(mouseX, mouseY);
        for (const feature of this.geoData.features) {
            if (this.isPointInCountry(worldX, worldY, feature)) {
                const isoA3 = feature.properties.ISO_A3;
                return this.countryCodeMap.get(isoA3) || null;
            }
        }
        return null;
    }
    isPointInCountry(x, y, feature) {
        const geometry = feature.geometry;
        if (geometry.type === 'Polygon') {
            return this.isPointInPolygonList(x, y, geometry.coordinates);
        }
        else if (geometry.type === 'MultiPolygon') {
            for (const polygon of geometry.coordinates) {
                if (this.isPointInPolygonList(x, y, polygon)) {
                    return true;
                }
            }
        }
        return false;
    }
    isPointInPolygonList(x, y, polygonList) {
        if (!this.isPointInPolygon(x, y, polygonList[0])) {
            return false;
        }
        for (let i = 1; i < polygonList.length; i++) {
            if (this.isPointInPolygon(x, y, polygonList[i])) {
                return false;
            }
        }
        return true;
    }
    isPointInPolygon(x, y, polygon) {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const [xi, yi] = this.projectCoordinate(polygon[i][0], polygon[i][1]);
            const [xj, yj] = this.projectCoordinate(polygon[j][0], polygon[j][1]);
            const intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) {
                inside = !inside;
            }
        }
        return inside;
    }
    render() {
        if (!this.ctx)
            return;
        this.ctx.fillStyle = '#1a2332';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.geoData) {
            return;
        }
        this.ctx.save();
        this.ctx.translate(this.camera.x, this.camera.y);
        this.ctx.scale(this.camera.zoom, this.camera.zoom);
        for (const feature of this.geoData.features) {
            this.drawCountry(feature);
        }
        this.ctx.restore();
    }
    drawCountry(feature) {
        const isoA3 = feature.properties.ISO_A3;
        const gameCountryId = this.countryCodeMap.get(isoA3);
        const countryData = gameCountryId ? this.countries.get(gameCountryId) : null;
        const isSelected = this.selectedCountryId === gameCountryId;
        const isHovered = this.hoveredCountryId === gameCountryId;
        const isPlayable = !!countryData;
        if (isPlayable && countryData) {
            this.ctx.fillStyle = countryData.color;
        }
        else {
            this.ctx.fillStyle = '#3a3a3a';
        }
        if (isHovered) {
            this.ctx.fillStyle = this.lightenColor(this.ctx.fillStyle, 0.3);
        }
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1.0 / this.camera.zoom;
        if (isSelected) {
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2.0 / this.camera.zoom;
        }
        this.drawGeometry(feature.geometry);
    }
    drawGeometry(geometry) {
        this.ctx.beginPath();
        if (geometry.type === 'Polygon') {
            this.drawPolygon(geometry.coordinates);
        }
        else if (geometry.type === 'MultiPolygon') {
            for (const polygon of geometry.coordinates) {
                this.drawPolygon(polygon);
            }
        }
        this.ctx.fill();
        this.ctx.stroke();
    }
    drawPolygon(coordinates) {
        for (const ring of coordinates) {
            for (let j = 0; j < ring.length; j++) {
                const [x, y] = this.projectCoordinate(ring[j][0], ring[j][1]);
                if (j === 0) {
                    this.ctx.moveTo(x, y);
                }
                else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.closePath();
        }
    }
    lightenColor(color, percent) {
        if (color.startsWith('#')) {
            const num = parseInt(color.replace("#", ""), 16);
            const amt = Math.round(2.55 * percent * 100);
            const R = Math.min(255, (num >> 16) + amt);
            const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
            const B = Math.min(255, (num & 0x0000FF) + amt);
            return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
        }
        return color;
    }
    // --- Public Methods ---
    updateCountries(countries) {
        this.countries = countries;
        this.render();
    }
    setSelectedCountry(countryId) {
        this.selectedCountryId = countryId;
        this.render();
    }
    handleResize() {
        if (!this.container || !this.canvas)
            return;
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
        this.resetCamera();
        this.render();
    }
    destroy() {
        if (this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
        window.removeEventListener('resize', () => this.handleResize());
    }
}
//# sourceMappingURL=worldMap.js.map