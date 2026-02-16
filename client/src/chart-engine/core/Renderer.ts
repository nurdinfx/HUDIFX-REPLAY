import { Coordinate } from './Coordinate';
import { Indicator, type IndicatorResult } from '../indicators/Indicator';
import { DrawingTool } from '../drawings/DrawingTool';

export interface Candle {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}

export class Renderer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    data: Candle[] = [];
    indicators: { instance: Indicator, result: IndicatorResult[] }[] = [];
    drawings: DrawingTool[] = [];

    // Viewport State
    scrollOffset: number = 0; // Number of candles from the right edge
    zoomLevel: number = 10;   // Pixels per candle (width)
    padding: number = 20;     // Vertical padding for price scale

    // Public State for InteractionManager
    minPrice: number = 0;
    maxPrice: number = 100;
    startIndex: number = 0;
    endIndex: number = 0;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const context = canvas.getContext('2d', { alpha: false }); // Optimize for speed
        if (!context) throw new Error("Could not get 2D context");
        this.ctx = context;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    setData(data: Candle[]) {
        this.data = data;
        this.render();
    }

    setSize(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.render();
    }

    setZoom(level: number) {
        this.zoomLevel = Math.max(1, Math.min(100, level));
        this.render();
    }

    setScroll(offset: number) {
        // Prevent scrolling past limits
        const maxScroll = Math.max(0, this.data.length - (this.width / this.zoomLevel));
        this.scrollOffset = Math.max(0, Math.min(maxScroll, offset));
        this.render();
    }

    addIndicator(indicator: Indicator) {
        const result = indicator.calculate(this.data);
        this.indicators.push({ instance: indicator, result });
        this.render();
    }

    clearIndicators() {
        this.indicators = [];
        this.render();
    }

    addDrawing(drawing: DrawingTool) {
        this.drawings.push(drawing);
        this.render();
    }

    clearDrawings() {
        this.drawings = [];
        this.render();
    }

    /**
     * Main Render Loop
     */
    render() {
        // 1. Clear Canvas
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.width, this.height);

        // 2. Default Scale if no data
        this.minPrice = 0;
        this.maxPrice = 100;
        this.startIndex = 0;
        this.endIndex = 0;

        if (this.data.length > 0) {
            // Calculate Visible Range
            const visibleCandlesCount = Math.ceil(this.width / this.zoomLevel);
            this.endIndex = this.data.length - Math.floor(this.scrollOffset);
            this.startIndex = Math.max(0, this.endIndex - visibleCandlesCount);

            // Calculate Scale (Min/Max Price in View)
            this.minPrice = Infinity;
            this.maxPrice = -Infinity;

            for (let i = this.startIndex; i < this.endIndex; i++) {
                const candle = this.data[i];
                if (candle.low < this.minPrice) this.minPrice = candle.low;
                if (candle.high > this.maxPrice) this.maxPrice = candle.high;
            }

            // Handle flat flat line
            if (this.minPrice === Infinity) { this.minPrice = 0; this.maxPrice = 100; }
            if (this.minPrice === this.maxPrice) { this.minPrice -= 1; this.maxPrice += 1; }
        }

        // 3. Draw Grid
        this.drawGrid(this.minPrice, this.maxPrice);

        if (this.data.length === 0) {
            // Draw "No Data" text
            this.ctx.fillStyle = "#555";
            this.ctx.font = "20px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText("Waiting for Data...", this.width / 2, this.height / 2);
            return;
        }

        // 4. Draw Candles
        const wickWidth = Math.max(1, Math.floor(this.zoomLevel * 0.1));
        const bodyWidth = Math.max(1, Math.floor(this.zoomLevel * 0.7));

        for (let i = this.startIndex; i < this.endIndex; i++) {
            const candle = this.data[i];

            // X Coordinate
            const x = (i - this.startIndex) * this.zoomLevel;

            // Y Coordinates
            const openY = Coordinate.priceToY(candle.open, this.minPrice, this.maxPrice, this.height, this.padding);
            const closeY = Coordinate.priceToY(candle.close, this.minPrice, this.maxPrice, this.height, this.padding);
            const highY = Coordinate.priceToY(candle.high, this.minPrice, this.maxPrice, this.height, this.padding);
            const lowY = Coordinate.priceToY(candle.low, this.minPrice, this.maxPrice, this.height, this.padding);

            // Color
            const isUp = candle.close >= candle.open;
            this.ctx.fillStyle = isUp ? "#089981" : "#f23645"; // TradingView Green/Red

            // Draw Wick
            this.ctx.fillRect(
                x + (this.zoomLevel - wickWidth) / 2,
                highY,
                wickWidth,
                Math.abs(lowY - highY)
            );

            // Draw Body
            let bodyHeight = Math.abs(closeY - openY);
            if (bodyHeight < 1) bodyHeight = 1; // Ensure body is visible

            this.ctx.fillRect(
                x + (this.zoomLevel - bodyWidth) / 2,
                Math.min(openY, closeY),
                bodyWidth,
                bodyHeight
            );
        }

        // 5. Draw Indicators
        for (const ind of this.indicators) {
            ind.instance.render(
                this.ctx,
                ind.result,
                this.startIndex,
                this.endIndex,
                this.minPrice,
                this.maxPrice,
                this.height,
                this.zoomLevel
            );
        }

        // 6. Draw Drawings
        for (const drawing of this.drawings) {
            drawing.render(
                this.ctx,
                this.data, // Pass Data
                this.startIndex,
                this.endIndex,
                this.minPrice,
                this.maxPrice,
                this.height,
                this.zoomLevel,
                this.padding // Add Padding
            );
        }
    }

    drawGrid(minPrice: number, maxPrice: number) {
        this.ctx.strokeStyle = "rgba(42, 46, 57, 0.2)";
        this.ctx.lineWidth = 1;

        const range = maxPrice - minPrice;
        const steps = 10;
        const stepValue = range / steps;

        this.ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
            const price = minPrice + (i * stepValue);
            const y = Coordinate.priceToY(price, minPrice, maxPrice, this.height, this.padding);

            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
        }
        this.ctx.stroke();
    }
}
