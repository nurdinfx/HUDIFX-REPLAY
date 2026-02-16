import mongoose from 'mongoose';
const replaySessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true },
    timeframe: { type: String, required: true },
    startTime: { type: Number, required: true }, // Timestamp of where replay started
    currentCandleIndex: { type: Number, default: 0 },
    balance: { type: Number, default: 10000 }, // Starting balance
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
export const ReplaySession = mongoose.model('ReplaySession', replaySessionSchema);
//# sourceMappingURL=ReplaySession.js.map