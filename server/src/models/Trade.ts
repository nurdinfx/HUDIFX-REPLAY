import mongoose from 'mongoose';

export interface ITrade extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    sessionId?: mongoose.Types.ObjectId;
    symbol: string;
    entryPrice: number;
    exitPrice?: number;
    stopLoss?: number;
    takeProfit?: number;
    profit?: number;
    lotSize: number;
    direction: 'BUY' | 'SELL';
    status: 'OPEN' | 'CLOSED';
    openTime: number;
    closeTime?: number;
}

const tradeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ReplaySession' },
    symbol: { type: String, required: true },
    entryPrice: { type: Number, required: true },
    exitPrice: { type: Number },
    stopLoss: { type: Number },
    takeProfit: { type: Number },
    profit: { type: Number },
    lotSize: { type: Number, required: true },
    direction: { type: String, enum: ['BUY', 'SELL'], required: true },
    status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN' },
    openTime: { type: Number, required: true },
    closeTime: { type: Number },
}, { timestamps: true });

export const Trade = mongoose.model<ITrade>('Trade', tradeSchema);
