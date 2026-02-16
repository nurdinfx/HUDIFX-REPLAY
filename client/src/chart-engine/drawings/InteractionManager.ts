import { Coordinate } from '../core/Coordinate';
import { Renderer } from '../core/Renderer';
import { DrawingTool } from './DrawingTool';

export class InteractionManager {
    renderer: Renderer;
    activeTool: DrawingTool | null = null;
    drawings: DrawingTool[] = [];

    // State
    isDrawing: boolean = false;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    setTool(tool: DrawingTool | null) {
        this.activeTool = tool;
        this.isDrawing = false;
    }

    handleMouseDown(e: React.MouseEvent, canvasRect: DOMRect) {
        if (!this.activeTool) return false; // Let chart handle pan

        const { time, price } = this.mouseToData(e, canvasRect);

        if (!this.isDrawing) {
            // Start Drawing
            this.activeTool.onMouseDown(time, price);
            this.isDrawing = true;
            this.renderer.addDrawing(this.activeTool); // Add to renderer immediately
        } else {
            // Finish Drawing
            this.activeTool.onMouseUp(time, price);
            if (this.activeTool.isFinished) {
                this.isDrawing = false;
                this.activeTool = null; // Reset tool or keep active for multi-draw? For now, reset.
            }
        }

        this.renderer.render();
        return true; // Stop propagation (prevent pan)
    }

    handleMouseMove(e: React.MouseEvent, canvasRect: DOMRect) {
        if (!this.activeTool || !this.isDrawing) return false;

        const { time, price } = this.mouseToData(e, canvasRect);

        // Update the tool's preview point
        // We need a standard method on tool for 'updateLastPoint' or 'onMouseMove'

        // If TrendLine has points[0], update points[1]
        // This logic belongs inside the tool usually, but we need to feed it data.
        this.activeTool.onMouseMove(time, price);
        this.renderer.render();
        return true;
    }

    // Helper: Convert screen mouse to Data (Time, Price)
    private mouseToData(e: React.MouseEvent, rect: DOMRect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const price = Coordinate.yToPrice(y, this.renderer.minPrice, this.renderer.maxPrice, this.renderer.height);

        // Time is tricky: X -> Index -> Time
        // We need X -> Index conversion from Coordinate/Renderer
        const index = Coordinate.xToIndex(x, this.renderer.startIndex, this.renderer.zoomLevel);
        const candle = this.renderer.data[Math.floor(index)];
        const time = candle ? candle.time : 0; // Fallback? 

        return { time, price };
    }
}
