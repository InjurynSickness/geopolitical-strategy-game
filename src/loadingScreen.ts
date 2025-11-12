// /src/loadingScreen.ts

export class LoadingScreen {
    private container: HTMLElement;
    private loadingElement: HTMLElement | null = null;
    private progressBar: HTMLElement | null = null;
    private statusText: HTMLElement | null = null;
    private tipText: HTMLElement | null = null;
    
    private tips = [
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

    constructor(container: HTMLElement) {
        this.container = container;
    }

    public show(): void {
        this.loadingElement = document.createElement('div');
        this.loadingElement.id = 'loadingScreen';
        this.loadingElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #d4af37;
        `;
        this.loadingElement.innerHTML = `
            <div style="text-align: center; max-width: 600px; padding: 40px;">
                <h1 style="font-size: 48px; margin-bottom: 20px; color: #d4af37; text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);">Geopolitical Strategy</h1>
                <div style="width: 60px; height: 60px; border: 4px solid rgba(212, 175, 55, 0.3); border-top-color: #d4af37; border-radius: 50%; margin: 30px auto; animation: spin 1s linear infinite;"></div>

                <div style="margin: 40px 0;">
                    <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; margin-bottom: 15px;">
                        <div id="progressBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #d4af37, #ffd700); transition: width 0.3s ease;"></div>
                    </div>
                    <p id="loadingStatus" style="color: #d4af37; font-size: 16px; margin: 0;">Initializing...</p>
                </div>

                <div style="margin-top: 60px; padding: 20px; background: rgba(212, 175, 55, 0.1); border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.3);">
                    <p style="color: #d4af37; font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">TIP:</p>
                    <p id="tipText" style="color: #fff; font-size: 14px; margin: 0; line-height: 1.6;">${this.getRandomTip()}</p>
                </div>
            </div>
        `;

        // Add spinner animation
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        this.container.appendChild(this.loadingElement);
        this.progressBar = document.getElementById('progressBar');
        this.statusText = document.getElementById('loadingStatus');
        this.tipText = document.getElementById('tipText');
    }

    public updateProgress(progress: number, status: string): void {
        if (this.progressBar) {
            this.progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }
        if (this.statusText) {
            this.statusText.textContent = status;
        }
    }

    public hide(): void {
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

    private getRandomTip(): string {
        return this.tips[Math.floor(Math.random() * this.tips.length)];
    }

    public rotateTip(): void {
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