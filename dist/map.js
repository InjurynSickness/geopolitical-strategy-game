export class MapRenderer {
    canvas;
    ctx;
    countries;
    selectedCountryId = null;
    hoveredCountryId = null;
    onCountrySelect;
    // Camera controls
    camera = { x: 0, y: 0, zoom: 1 };
    isDragging = false;
    lastMousePos = { x: 0, y: 0 };
    constructor(canvas, onCountrySelect) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.countries = new Map();
        this.onCountrySelect = onCountrySelect;
        this.setupEventListeners();
        this.resizeCanvas();
        // Initial render to show something immediately
        this.render();
    }
    setupEventListeners() {
        // Handle canvas clicks
        this.canvas.addEventListener('click', (event) => {
            if (this.isDragging)
                return; // Don't select if we were dragging
            const rect = this.canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left - this.camera.x) / this.camera.zoom;
            const y = (event.clientY - rect.top - this.camera.y) / this.camera.zoom;
            const clickedCountry = this.getCountryAtPosition(x, y);
            if (clickedCountry) {
                this.selectedCountryId = clickedCountry.id;
                this.onCountrySelect(clickedCountry.id);
                this.render();
            }
        });
        // Mouse down for dragging
        this.canvas.addEventListener('mousedown', (event) => {
            this.isDragging = true;
            this.lastMousePos.x = event.clientX;
            this.lastMousePos.y = event.clientY;
            this.canvas.style.cursor = 'grabbing';
        });
        // Mouse up
        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.canvas.style.cursor = 'grab';
        });
        // Handle mouse movement for hover effects and panning
        this.canvas.addEventListener('mousemove', (event) => {
            if (this.isDragging) {
                // Pan the camera
                const deltaX = event.clientX - this.lastMousePos.x;
                const deltaY = event.clientY - this.lastMousePos.y;
                this.camera.x += deltaX;
                this.camera.y += deltaY;
                this.lastMousePos.x = event.clientX;
                this.lastMousePos.y = event.clientY;
                this.render();
                return;
            }
            const rect = this.canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left - this.camera.x) / this.camera.zoom;
            const y = (event.clientY - rect.top - this.camera.y) / this.camera.zoom;
            const hoveredCountry = this.getCountryAtPosition(x, y);
            const newHoveredId = hoveredCountry ? hoveredCountry.id : null;
            if (newHoveredId !== this.hoveredCountryId) {
                this.hoveredCountryId = newHoveredId;
                this.canvas.style.cursor = hoveredCountry ? 'pointer' : 'grab';
                this.render();
            }
        });
        // Zoom with mouse wheel
        this.canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
            const newZoom = Math.max(0.5, Math.min(3, this.camera.zoom * zoomFactor));
            // Zoom towards mouse position
            this.camera.x = mouseX - (mouseX - this.camera.x) * (newZoom / this.camera.zoom);
            this.camera.y = mouseY - (mouseY - this.camera.y) * (newZoom / this.camera.zoom);
            this.camera.zoom = newZoom;
            this.render();
        });
        // Handle window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.render();
        });
    }
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth - 20; // Account for padding
        this.canvas.height = container.clientHeight - 20;
    }
    getCountryAtPosition(x, y) {
        for (const country of this.countries.values()) {
            const distance = Math.sqrt(Math.pow(x - country.position.x, 2) +
                Math.pow(y - country.position.y, 2));
            // Simple circular hit detection (will improve later with actual borders)
            if (distance <= 60) {
                return country;
            }
        }
        return null;
    }
    updateCountries(countries) {
        this.countries = countries;
        this.render();
    }
    setSelectedCountry(countryId) {
        this.selectedCountryId = countryId;
        this.render();
    }
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Save context and apply camera transform
        this.ctx.save();
        this.ctx.translate(this.camera.x, this.camera.y);
        this.ctx.scale(this.camera.zoom, this.camera.zoom);
        // Draw grid background
        this.drawGrid();
        // Draw countries
        for (const country of this.countries.values()) {
            this.drawCountry(country);
        }
        // Draw country labels
        for (const country of this.countries.values()) {
            this.drawCountryLabel(country);
        }
        // Restore context
        this.ctx.restore();
        // Draw zoom info
        this.drawUI();
    }
    drawGrid() {
        this.ctx.strokeStyle = '#3a3a3a';
        this.ctx.lineWidth = 1;
        const gridSize = 50;
        // Vertical lines
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        // Horizontal lines
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    drawCountry(country) {
        const isSelected = this.selectedCountryId === country.id;
        const isHovered = this.hoveredCountryId === country.id;
        // Main country circle
        this.ctx.beginPath();
        this.ctx.arc(country.position.x, country.position.y, 50, 0, 2 * Math.PI);
        // Fill with country color
        this.ctx.fillStyle = country.color;
        if (isHovered) {
            this.ctx.fillStyle = this.lightenColor(country.color, 0.2);
        }
        this.ctx.fill();
        // Border
        this.ctx.strokeStyle = isSelected ? '#ffffff' : '#666666';
        this.ctx.lineWidth = isSelected ? 3 : 1;
        this.ctx.stroke();
        // Selection indicator
        if (isSelected) {
            this.ctx.beginPath();
            this.ctx.arc(country.position.x, country.position.y, 60, 0, 2 * Math.PI);
            this.ctx.strokeStyle = '#00aaff';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
        // GDP indicator (small bar)
        const gdpBarWidth = Math.min(60, (country.gdp / 15000) * 60); // Scale to max 15T GDP
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(country.position.x - 30, country.position.y + 60, gdpBarWidth, 4);
        // Military strength indicator
        const milBarWidth = (country.militaryStrength / 100) * 60;
        this.ctx.fillStyle = '#ff4444';
        this.ctx.fillRect(country.position.x - 30, country.position.y + 68, milBarWidth, 4);
    }
    drawCountryLabel(country) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        // Country name
        this.ctx.fillText(country.code, country.position.x, country.position.y - 5);
        // GDP (simplified)
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = '#cccccc';
        const gdpText = `$${(country.gdp / 1000).toFixed(1)}T`;
        this.ctx.fillText(gdpText, country.position.x, country.position.y + 10);
    }
    drawUI() {
        // Draw zoom level indicator
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, this.canvas.height - 60, 120, 40);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Zoom: ${(this.camera.zoom * 100).toFixed(0)}%`, 20, this.canvas.height - 35);
        this.ctx.fillText('Scroll: Zoom, Drag: Pan', 20, this.canvas.height - 15);
    }
    lightenColor(hex, percent) {
        const num = parseInt(hex.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent * 100);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
}
//# sourceMappingURL=map.js.map