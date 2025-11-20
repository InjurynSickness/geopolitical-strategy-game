// /src/rendering/MapRenderer.ts

import { CanvasManager } from './CanvasManager.js';
import { CameraController } from '../camera/CameraController.js';

export class MapRenderer {
    constructor(
        private canvasManager: CanvasManager,
        private cameraController: CameraController
    ) {}

    public render(): void {
        const ctx = this.canvasManager.visibleCtx;
        const camera = this.cameraController.camera;

        ctx.save();

        // HOI4-style ocean background - darker blue
        ctx.fillStyle = '#2d4458';
        ctx.fillRect(0, 0, this.canvasManager.visibleCanvas.width, this.canvasManager.visibleCanvas.height);

        // Apply camera transform
        ctx.translate(camera.x, camera.y);
        ctx.scale(camera.zoom, camera.zoom);

        ctx.imageSmoothingEnabled = false;

        // Add subtle terrain texture for depth (like HOI4)
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.25;
        ctx.drawImage(this.canvasManager.processedTerrainCanvas, 0, 0);

        // Draw political colors at slightly reduced opacity for muted HOI4 look
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.75;
        ctx.drawImage(this.canvasManager.politicalCanvas, 0, 0);

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1.0;

        // Draw rivers
        ctx.globalAlpha = 0.8; // Slightly increased from 0.7 to 0.8
        ctx.drawImage(this.canvasManager.recoloredRiversCanvas, 0, 0);
        ctx.globalAlpha = 1.0;

        // Draw borders
        ctx.drawImage(this.canvasManager.borderCanvas, 0, 0);
        
        // Draw overlays (selection, labels)
        ctx.drawImage(this.canvasManager.overlayCanvas, 0, 0);
        
        ctx.restore();
    }
}