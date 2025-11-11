// /src/loadingScreen.ts
export class LoadingScreen {
    container;
    loadingElement = null;
    progressBar = null;
    statusText = null;
    tipText = null;
    tips = [
        "Build strong economies to support your military ambitions",
        "Diplomatic relations can prevent costly wars",
        "High corruption reduces your political power gain",
        "Economic growth increases stability and public support",
        "Alliances provide mutual defense and trade benefits",
        "Natural resources drive industrial production",
        "Infrastructure investment pays off in the long run",
        "Monitor your national debt to avoid economic crisis",
        "Political power is your most valuable resource",
        "Technology advances give strategic advantages"
    ];
    constructor(container) {
        this.container = container;
    }
    show() {
        this.loadingElement = document.createElement('div');
        this.loadingElement.id = 'loadingScreen';
        this.loadingElement.innerHTML = `
            <div class="loading-content">
                <div class="loading-header">
                    <h1 class="loading-title">Geopolitical Strategy</h1>
                    <div class="loading-spinner"></div>
                </div>
                
                <div class="loading-progress">
                    <div class="progress-bar-container">
                        <div class="progress-bar" id="progressBar"></div>
                    </div>
                    <p class="loading-status" id="loadingStatus">Initializing...</p>
                </div>
                
                <div class="loading-tip">
                    <p class="tip-label">TIP:</p>
                    <p class="tip-text" id="tipText">${this.getRandomTip()}</p>
                </div>
            </div>
        `;
        this.container.appendChild(this.loadingElement);
        this.progressBar = document.getElementById('progressBar');
        this.statusText = document.getElementById('loadingStatus');
        this.tipText = document.getElementById('tipText');
    }
    updateProgress(progress, status) {
        if (this.progressBar) {
            this.progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }
        if (this.statusText) {
            this.statusText.textContent = status;
        }
    }
    hide() {
        if (this.loadingElement) {
            this.loadingElement.style.opacity = '0';
            this.loadingElement.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => {
                if (this.loadingElement && this.loadingElement.parentNode) {
                    this.loadingElement.parentNode.removeChild(this.loadingElement);
                    this.loadingElement = null;
                }
            }, 500);
        }
    }
    getRandomTip() {
        return this.tips[Math.floor(Math.random() * this.tips.length)];
    }
    rotateTip() {
        if (this.tipText) {
            this.tipText.style.opacity = '0';
            setTimeout(() => {
                if (this.tipText) {
                    this.tipText.textContent = this.getRandomTip();
                    this.tipText.style.opacity = '1';
                }
            }, 300);
        }
    }
}
//# sourceMappingURL=loadingScreen.js.map