export class Coordinate {
    /**
     * Converts a price value to a Y-pixel coordinate.
     * @param price The price value to convert.
     * @param minPrice The minimum price visible in the viewport.
     * @param maxPrice The maximum price visible in the viewport.
     * @param height The height of the canvas in pixels.
     * @param padding The padding (top/bottom) in pixels.
     */
    static priceToY(
        price: number,
        minPrice: number,
        maxPrice: number,
        height: number,
        padding: number = 20
    ): number {
        const range = maxPrice - minPrice;
        if (range === 0) return height / 2;

        // Invert Y axis: higher price = lower Y value (top of screen is 0)
        return height - padding - ((price - minPrice) / range) * (height - 2 * padding);
    }

    /**
     * Converts a Y-pixel coordinate back to a price value.
     */
    static yToPrice(
        y: number,
        minPrice: number,
        maxPrice: number,
        height: number,
        padding: number = 20
    ): number {
        const range = maxPrice - minPrice;
        if (range === 0) return minPrice;

        const effectiveHeight = height - 2 * padding;
        const normalizedY = (height - padding - y) / effectiveHeight;
        return minPrice + normalizedY * range;
    }

    /**
     * Converts a time index (candle index) to an X-pixel coordinate.
     * @param index The index of the candle in the data array.
     * @param startIndex The index of the first visible candle on the left.
     * @param candleWidth The width of a single candle in pixels (including gap).
     */
    static indexToX(
        index: number,
        startIndex: number,
        candleWidth: number
    ): number {
        return (index - startIndex) * candleWidth;
    }

    /**
     * Converts an X-pixel coordinate back to a time index.
     */
    static xToIndex(
        x: number,
        startIndex: number,
        candleWidth: number
    ): number {
        return Math.floor(x / candleWidth) + startIndex;
    }
}
