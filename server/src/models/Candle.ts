import mongoose from 'mongoose';

export interface ICandle extends mongoose.Document {
    symbol: string;
    timeframe: string;
    time: number; // Unix timestamp
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

const candleSchema = new mongoose.Schema({
    symbol: { type: String, required: true, index: true },
    timeframe: { type: String, required: true, index: true },
    time: { type: Number, required: true, index: true },
    open: { type: Number, required: true },
    high: { type: Number, required: true },
    low: { type: Number, required: true },
    close: { type: Number, required: true },
    volume: { type: Number, required: true },
}, { timestamps: false });

// Compound index for fast querying
candleSchema.index({ symbol: 1, timeframe: 1, time: 1 }, { unique: true });

export const Candle = mongoose.model<ICandle>('Candle', candleSchema);
