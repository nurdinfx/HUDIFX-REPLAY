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
export declare const Trade: mongoose.Model<ITrade, {}, {}, {}, mongoose.Document<unknown, {}, ITrade, {}, mongoose.DefaultSchemaOptions> & ITrade & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITrade>;
//# sourceMappingURL=Trade.d.ts.map