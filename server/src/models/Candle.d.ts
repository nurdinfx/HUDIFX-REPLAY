import mongoose from 'mongoose';
export interface ICandle extends mongoose.Document {
    symbol: string;
    timeframe: string;
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}
export declare const Candle: mongoose.Model<ICandle, {}, {}, {}, mongoose.Document<unknown, {}, ICandle, {}, mongoose.DefaultSchemaOptions> & ICandle & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICandle>;
//# sourceMappingURL=Candle.d.ts.map