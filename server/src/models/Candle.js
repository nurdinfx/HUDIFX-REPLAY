import mongoose from 'mongoose';
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
export const Candle = mongoose.model('Candle', candleSchema);
//# sourceMappingURL=Candle.js.map