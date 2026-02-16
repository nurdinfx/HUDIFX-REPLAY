import { Indicator, type IndicatorResult } from '../Indicator';
import type { Candle } from '../../core/Renderer';

export class SMA extends Indicator {
    period: number;
    color: string;

    constructor(period: number, color: string = '#2962FF') {
        super(`SMA ${period}`, true);
        this.period = period;
        this.color = color;
    }

    calculate(candles: Candle[]): IndicatorResult[] {
        const results: IndicatorResult[] = [];

        for (let i = 0; i < candles.length; i++) {
            if (i < this.period - 1) {
                results.push({ time: candles[i].time, value: NaN });
                continue;
            }

            let sum = 0;
            for (let j = 0; j < this.period; j++) {
                sum += candles[i - j].close;
            }

            results.push({
                time: candles[i].time,
                value: sum / this.period
            });
        }

        return results;
    }

    // Override render to use custom color
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
        ctx.strokeStyle = this.color;
        super.render(ctx, data, startIndex, endIndex, minPrice, maxPrice, height, zoomLevel);
    }
}
