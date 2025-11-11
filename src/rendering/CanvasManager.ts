// /src/rendering/CanvasManager.ts

export class CanvasManager {
    // Visible canvas (what user sees)
    public visibleCanvas: HTMLCanvasElement;
    public visibleCtx: CanvasRenderingContext2D;
    
    // Hidden canvas for province color-picking
    public hiddenCanvas: HTMLCanvasElement;
    public hiddenCtx: CanvasRenderingContext2D;
    
    // Political colors canvas
    public politicalCanvas: HTMLCanvasElement;
    public politicalCtx: CanvasRenderingContext2D;
    
    // Overlay canvas (hover/selection)
    public overlayCanvas: HTMLCanvasElement;
    public overlayCtx: CanvasRenderingContext2D;
    
    // Border canvas
    public borderCanvas: HTMLCanvasElement;
    public borderCtx: CanvasRenderingContext2D;
    
    // Recolored rivers canvas
    public recoloredRiversCanvas: HTMLCanvasElement;
    public recoloredRiversCtx: CanvasRenderingContext2D;
    
    // Processed terrain canvas
    public processedTerrainCanvas: HTMLCanvasElement;
    public processedTerrainCtx: CanvasRenderingContext2D;

    constructor(
        private container: HTMLElement,
        private mapWidth: number,
        private mapHeight: number
    ) {
        this.visibleCanvas = this.createVisibleCanvas();
        this.visibleCtx = this.visibleCanvas.getContext('2d')!;
        
        this.hiddenCanvas = this.createOffscreenCanvas(true);
        this.hiddenCtx = this.hiddenCanvas.getContext('2d', { willReadFrequently: true })!;
        
        this.politicalCanvas = this.createOffscreenCanvas();
        this.politicalCtx = this.politicalCanvas.getContext('2d')!;
        
        this.overlayCanvas = this.createOffscreenCanvas();
        this.overlayCtx = this.overlayCanvas.getContext('2d')!;
        
        this.borderCanvas = this.createOffscreenCanvas();
        this.borderCtx = this.borderCanvas.getContext('2d')!;
        
        this.recoloredRiversCanvas = this.createOffscreenCanvas();
        this.recoloredRiversCtx = this.recoloredRiversCanvas.getContext('2d')!;
        
        this.processedTerrainCanvas = this.createOffscreenCanvas();
        this.processedTerrainCtx = this.processedTerrainCanvas.getContext('2d', { willReadFrequently: true })!;
    }

    private createVisibleCanvas(): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = this.container.clientWidth;
        canvas.height = this.container.clientHeight;
        canvas.style.backgroundColor = '#334a5e';
        canvas.style.cursor = 'grab';
        this.container.appendChild(canvas);
        return canvas;
    }

    private createOffscreenCanvas(willReadFrequently: boolean = false): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = this.mapWidth;
        canvas.height = this.mapHeight;
        return canvas;
    }

    public resizeVisibleCanvas(): void {
        this.visibleCanvas.width = this.container.clientWidth;
        this.visibleCanvas.height = this.container.clientHeight;
    }

    public destroy(): void {
        if (this.visibleCanvas.parentElement) {
            this.visibleCanvas.parentElement.removeChild(this.visibleCanvas);
        }
    }
}