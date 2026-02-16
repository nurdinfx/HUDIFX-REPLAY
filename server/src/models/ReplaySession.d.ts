import mongoose from 'mongoose';
export interface IReplaySession extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    symbol: string;
    timeframe: string;
    startTime: number;
    currentCandleIndex: number;
    balance: number;
    isActive: boolean;
}
export declare const ReplaySession: mongoose.Model<IReplaySession, {}, {}, {}, mongoose.Document<unknown, {}, IReplaySession, {}, mongoose.DefaultSchemaOptions> & IReplaySession & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IReplaySession>;
//# sourceMappingURL=ReplaySession.d.ts.map