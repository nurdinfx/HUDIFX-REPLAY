import { Coordinate } from '../core/Coordinate';
import type { Candle } from '../core/Renderer';

export interface IndicatorResult {
    time: number;
    value: number;
}

export abstract class Indicator {
    name: string;
    overlay: boolean; // True if drawn on main chart, false for separate pane

    constructor(name: string, overlay: boolean = true) {
        this.name = name;
        this.overlay = overlay;
    }

    /**
     * Calculates the indicator values based on the provided candles.
     */
    abstract calculate(candles: Candle[]): IndicatorResult[];

    /**
     * Renders the indicator on the canvas.
     * @param ctx Canvas context
     * @param data Calculated indicator data
     * @param startIndex First visible candle index
     * @param endIndex Last visible candle index
     * @param minPrice Min price in view (for scaling)
     * @param maxPrice Max price in view (for scaling)
     * @param height Canvas height
     * @param zoomLevel Pixels per candle
     */
    render(
        ctx: CanvasRenderingContext2D,
        data: IndicatorResult[],
        startIndex: number,
        endIndex: number,
        minPrice: number,
        maxPrice: number,
        height: number,
        zoomLevel: number
    ) {
        if (data.length === 0) return;

        ctx.strokeStyle = '#2962FF'; // Default Blue
        ctx.lineWidth = 2;
        ctx.beginPath();

        let started = false;

        for (let i = startIndex; i < endIndex; i++) {
            // Find data point matching the candle index?
            // Assuming data is aligned with candles 1:1 for now (simplification)
            // Ideally, we match by time or index. 
            // For simple indicators (SMA), result array length might be shorter due to warm-up period.
            // Let's assume data[i] corresponds to candles[i] for this initial implementation.

            const point = data[i];

            if (!point || isNaN(point.value)) {
                started = false; // Break line on gaps
                continue;
            }

            const x = Coordinate.indexToX(i, startIndex, zoomLevel);
            const y = Coordinate.priceToY(point.value, minPrice, maxPrice, height);

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
