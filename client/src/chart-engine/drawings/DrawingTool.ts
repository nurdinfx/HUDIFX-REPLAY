import { Coordinate } from '../core/Coordinate';

export interface Point {
    time: number;
    price: number;
}

export abstract class DrawingTool {
    name: string;
    points: Point[] = [];
    isFinished: boolean = false;

    constructor(name: string) {
        this.name = name;
    }

    // Capture the initial click
    abstract onMouseDown(time: number, price: number): void;

    // Handle drag/move during drawing
    abstract onMouseMove(time: number, price: number): void;

    // Finalize the drawing
    abstract onMouseUp(time: number, price: number): void;

    // Render the drawing on the canvas
    abstract render(
        ctx: CanvasRenderingContext2D,
        data: { time: number, open: number, high: number, low: number, close: number }[], // Add Data
        startIndex: number,
        endIndex: number,
        minPrice: number,
        maxPrice: number,
        height: number,
        zoomLevel: number,
        padding: number // Add Padding
    ): void;
}
