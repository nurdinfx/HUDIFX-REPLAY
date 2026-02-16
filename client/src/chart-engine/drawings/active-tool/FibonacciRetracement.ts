import { DrawingTool, type Point } from '../DrawingTool';
import { Coordinate } from '../../core/Coordinate';

export class FibonacciRetracement extends DrawingTool {
    constructor() {
        super('Fibonacci Retracement');
    }

    onMouseDown(time: number, price: number) {
        if (this.points.length === 0) {
            this.points.push({ time, price }); // Start Point
            this.points.push({ time, price }); // Temp End Point
        } else if (this.points.length === 2) {
            this.points[1] = { time, price }; // Finalize End Point
            this.isFinished = true;
        }
    }

    onMouseMove(time: number, price: number) {
        if (this.points.length >= 1 && !this.isFinished) {
            // Update preview point
            this.points[1] = { time, price };
        }
    }

    onMouseUp(time: number, price: number) {
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

        const p1 = this.points[0];
        const p2 = this.points[1];

        // 1. Calculate Coordinates
        let x1 = -1, x2 = -1;

        // Find X for P1
        for (let i = 0; i < data.length; i++) {
            if (data[i].time === p1.time) {
                x1 = (i - startIndex) * zoomLevel;
                break;
            }
        }

        // Find X for P2
        for (let i = 0; i < data.length; i++) {
            if (data[i].time === p2.time) {
                x2 = (i - startIndex) * zoomLevel;
                break;
            }
        }

        // If points not found (e.g. data missing), skip
        if (x1 === -1 || x2 === -1) return;

        const y1 = Coordinate.priceToY(p1.price, minPrice, maxPrice, height, padding);
        const y2 = Coordinate.priceToY(p2.price, minPrice, maxPrice, height, padding);

        // 2. Draw Trendline (Diagonal)
        ctx.strokeStyle = '#aaaaaa';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);

        // 3. Draw Levels
        const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
        const priceDiff = p2.price - p1.price;
        const width = Math.abs(x2 - x1);
        const leftX = Math.min(x1, x2);
        const rightX = Math.max(x1, x2);

        ctx.font = '10px Arial';
        ctx.textAlign = 'left';

        levels.forEach(level => {
            const levelPrice = p1.price + (priceDiff * level);
            const levelY = Coordinate.priceToY(levelPrice, minPrice, maxPrice, height, padding);

            // Color based on level?
            ctx.strokeStyle = level === 0 || level === 1 || level === 0.5 ? '#ffffff' : '#2962FF';
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.moveTo(leftX, levelY);
            ctx.lineTo(rightX, levelY);
            ctx.stroke();

            // Text
            ctx.fillStyle = "#cccccc";
            ctx.fillText(`${(level * 100).toFixed(1)}%`, rightX + 5, levelY + 3);
        });
    }
}
