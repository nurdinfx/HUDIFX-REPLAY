import mongoose from 'mongoose';

export interface IReplaySession extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    symbol: string;
    broker: string;
    startDate: string;
    endDate: string;
    type: string;
    timeframe: string;
    startTime: number;
    currentCandleIndex: number;
    balance: number;
    isActive: boolean;
}

const replaySessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    broker: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    type: { type: String, required: true },
    timeframe: { type: String, default: '1h' },
    startTime: { type: Number, default: 0 }, // Timestamp of where replay started
    currentCandleIndex: { type: Number, default: 0 },
    balance: { type: Number, default: 100000 }, // Starting balance
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const ReplaySession = mongoose.model<IReplaySession>('ReplaySession', replaySessionSchema);
