// /src/mainMenu.ts
export class MainMenu {
    container;
    menuElement = null;
    onNewGame;
    onLoadGame;
    onContinue;
    constructor(container, onNewGame, onLoadGame, onContinue) {
        this.container = container;
        this.onNewGame = onNewGame;
        this.onLoadGame = onLoadGame;
        this.onContinue = onContinue;
        this.createMenu();
    }
    createMenu() {
        this.menuElement = document.createElement('div');
        this.menuElement.id = 'mainMenu';
        this.menuElement.innerHTML = `
            <div class="menu-background">
                <div class="menu-overlay"></div>
                <canvas id="menuCanvas"></canvas>
            </div>
            
            <div class="menu-content">
                <div class="menu-header">
                    <h1 class="menu-title">Geopolitical Strategy</h1>
                    <p class="menu-subtitle">Command Nations. Shape History.</p>
                </div>
                
                <div class="menu-buttons">
                    ${this.onContinue ? '<button class="menu-button menu-button-primary" id="continueBtn">Continue</button>' : ''}
                    <button class="menu-button menu-button-primary" id="newGameBtn">New Game</button>
                    <button class="menu-button" id="loadGameBtn">Load Game</button>
                    <button class="menu-button" id="settingsBtn">Settings</button>
                    <button class="menu-button" id="exitBtn">Exit</button>
                </div>
                
                <div class="menu-footer">
                    <p>Version 1.2.0 | © 2025</p>
                </div>
            </div>
            
            <div class="save-selector" id="saveSelector" style="display: none;">
                <div class="save-selector-content">
                    <div class="save-selector-header">
                        <h2>Load Game</h2>
                        <button class="close-button" id="closeSaveSelector">&times;</button>
                    </div>
                    <div class="save-selector-body" id="saveSlotsList">
                        <!-- Save slots will be dynamically generated -->
                    </div>
                </div>
            </div>
        `;
        this.container.appendChild(this.menuElement);
        this.setupEventListeners();
        this.animateBackground();
    }
    setupEventListeners() {
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                if (this.onContinue) {
                    this.onContinue();
                }
            });
        }
        document.getElementById('newGameBtn')?.addEventListener('click', () => {
            this.onNewGame();
        });
        document.getElementById('loadGameBtn')?.addEventListener('click', () => {
            this.showSaveSelector();
        });
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this.showNotification('Settings coming soon!', 'info');
        });
        document.getElementById('exitBtn')?.addEventListener('click', () => {
            this.showNotification('Thanks for playing!', 'info');
        });
        document.getElementById('closeSaveSelector')?.addEventListener('click', () => {
            this.hideSaveSelector();
        });
    }
    showSaveSelector() {
        const selector = document.getElementById('saveSelector');
        const slotsList = document.getElementById('saveSlotsList');
        if (!selector || !slotsList)
            return;
        slotsList.innerHTML = '';
        // Check auto-save
        const autoSaveSlot = this.createSaveSlotElement(this.getSaveData(0));
        slotsList.appendChild(autoSaveSlot);
        // Check manual saves 1-5
        for (let i = 1; i <= 5; i++) {
            const saveSlot = this.createSaveSlotElement(this.getSaveData(i));
            slotsList.appendChild(saveSlot);
        }
        selector.style.display = 'flex';
    }
    hideSaveSelector() {
        const selector = document.getElementById('saveSelector');
        if (selector) {
            selector.style.display = 'none';
        }
    }
    getSaveData(slotNumber) {
        const saveKey = `geopolitical-save-${slotNumber}`;
        const saveData = localStorage.getItem(saveKey);
        if (!saveData) {
            return {
                slotNumber,
                exists: false
            };
        }
        try {
            const data = JSON.parse(saveData);
            return {
                slotNumber,
                exists: true,
                saveTime: data.saveTime,
                gameDate: data.gameState?.currentDate,
                version: data.version || '1.0.0',
                countries: data.gameState?.countries?.length || 0
            };
        }
        catch (error) {
            console.error(`Corrupted save in slot ${slotNumber}:`, error);
            return {
                slotNumber,
                exists: false
            };
        }
    }
    createSaveSlotElement(saveData) {
        const slot = document.createElement('div');
        slot.className = 'save-slot-item';
        if (!saveData.exists) {
            slot.classList.add('empty-slot');
            slot.innerHTML = `
                <div class="save-slot-header">
                    <h3>${saveData.slotNumber === 0 ? 'Auto-Save' : `Save Slot ${saveData.slotNumber}`}</h3>
                </div>
                <p class="empty-slot-text">Empty Slot</p>
            `;
            slot.style.cursor = 'not-allowed';
            slot.style.opacity = '0.5';
        }
        else {
            const saveDate = new Date(saveData.saveTime);
            const gameDate = saveData.gameDate;
            slot.innerHTML = `
                <div class="save-slot-header">
                    <h3>${saveData.slotNumber === 0 ? 'Auto-Save' : `Save Slot ${saveData.slotNumber}`}</h3>
                    <span class="save-slot-date">${saveDate.toLocaleDateString()} ${saveDate.toLocaleTimeString()}</span>
                </div>
                <div class="save-slot-info">
                    <span>📅 ${this.formatGameDate(gameDate)}</span>
                    <span>🌍 ${saveData.countries} Countries</span>
                    <span>v${saveData.version}</span>
                </div>
            `;
            slot.addEventListener('click', () => {
                this.onLoadGame(saveData.slotNumber);
            });
        }
        return slot;
    }
    formatGameDate(gameDate) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (!gameDate || typeof gameDate.month !== 'number' || gameDate.month < 1 || gameDate.month > 12) {
            return "Invalid Date";
        }
        return `${months[gameDate.month - 1]} ${gameDate.day}, ${gameDate.year}`;
    }
    animateBackground() {
        const canvas = document.getElementById('menuCanvas');
        if (!canvas)
            return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');
        // Animated globe particles
        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }
        const animate = () => {
            ctx.fillStyle = 'rgba(26, 26, 26, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(74, 158, 255, 0.5)';
            for (const particle of particles) {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
                particle.x += particle.vx;
                particle.y += particle.vy;
                if (particle.x < 0 || particle.x > canvas.width)
                    particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height)
                    particle.vy *= -1;
            }
            requestAnimationFrame(animate);
        };
        animate();
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = 'menu-notification';
        notification.textContent = message;
        notification.style.backgroundColor = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8';
        this.container.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2500);
    }
    hide() {
        if (this.menuElement) {
            this.menuElement.style.display = 'none';
        }
    }
    show() {
        if (this.menuElement) {
            this.menuElement.style.display = 'block';
        }
    }
    destroy() {
        if (this.menuElement && this.menuElement.parentNode) {
            this.menuElement.parentNode.removeChild(this.menuElement);
        }
    }
}
//# sourceMappingURL=mainMenu.js.map