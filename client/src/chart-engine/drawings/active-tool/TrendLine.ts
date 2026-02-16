import { DrawingTool, type Point } from '../DrawingTool';
import { Coordinate } from '../../core/Coordinate';

export class TrendLine extends DrawingTool {
    constructor() {
        super('Trend Line');
    }

    onMouseDown(time: number, price: number) {
        if (this.points.length === 0) {
            this.points.push({ time, price }); // Start Point
            // Add a temp end point for preview
            this.points.push({ time, price });
        } else if (this.points.length === 2) {
            // We already have start and temp end.
            // Finialize end point.
            this.points[1] = { time, price };
            this.isFinished = true;
        }
    }

    onMouseMove(time: number, price: number) {
        if (this.points.length >= 1 && !this.isFinished) {
            // Update preview point (index 1)
            this.points[1] = { time, price };
        }
    }

    onMouseUp(time: number, price: number) {
        // If we want click-drag-release behavior:
        // MouseDown starts. MouseMove updates. MouseUp finishes.
        // If we want click-move-click behavior:
        // MouseDown starts. MouseMove updates. MouseDown finishes.

        // InteractionManager implementation seems to trigger onMouseDown for clicks.
        // Let's assume click-move-click for now as per previous logic, 
        // BUT InteractionManager passes MouseUp too.

        // If we want standard drag behavior:
        if (this.points.length >= 2 && !this.isFinished) {
            this.points[1] = { time, price };
            this.isFinished = true;
        }
    }

    render(
        ctx: CanvasRenderingContext2D,
        data: { time: number, open: number, high: number, low: number, close: number }[],
        startIndex: number,
        endIndex: number,
        minPrice: number,
        maxPrice: number,
        height: number,
        zoomLevel: number,
        padding: number
    ) {
        if (this.points.length < 2) return;

        ctx.strokeStyle = '#2962FF';
        ctx.lineWidth = 2;
        ctx.beginPath();

        let started = false;

        for (const point of this.points) {
            let index = -1;
            for (let i = 0; i < data.length; i++) {
                if (data[i].time === point.time) {
                    index = i;
                    break;
                }
            }

            if (index === -1) continue;

            const x = (index - startIndex) * zoomLevel;
            const y = Coordinate.priceToY(point.price, minPrice, maxPrice, height, padding);

            if (!started) {
                ctx.moveTo(x, y);
                started = true;
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.stroke();
    }
}
