import { Request, Response } from 'express';
import { Candle } from '../models/Candle';
export const getCandles = async (req, res) => {
    const { symbol, timeframe, from, to } = req.query;
    try {
        const query = {
            symbol: symbol || 'EURUSD',
            timeframe: timeframe || '1m',
        };
        if (from || to) {
            query.time = {};
            if (from)
                query.time.$gte = Number(from);
            if (to)
                query.time.$lte = Number(to);
        }
        const candles = await Candle.find(query).sort({ time: 1 }).limit(5000); // Limit to prevent overload
        res.json(candles);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching candles' });
    }
};
//# sourceMappingURL=marketController.js.map