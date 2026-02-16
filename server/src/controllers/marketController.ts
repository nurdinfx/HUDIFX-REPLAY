import type { Request, Response } from 'express';
import { Candle } from '../models/Candle.js';
import { seedDB } from '../utils/seedLogic.js';

export const seedMarketData = async (req: Request, res: Response) => {
    try {
        // Run seeding in background or await it? Await for now to confirm.
        console.log("Manual seed triggered via API...");
        await seedDB();
        res.json({ message: 'Seeding completed successfully' });
    } catch (error) {
        console.error('Seeding error:', error);
        res.status(500).json({ message: 'Seeding failed' });
    }
};

export const getCandles = async (req: Request, res: Response) => {
    const { symbol, timeframe, from, to } = req.query;

    try {
        const query: any = {
            symbol: symbol || 'EURUSD',
            timeframe: timeframe || '1m',
        };

        if (from || to) {
            query.time = {};
            if (from) query.time.$gte = Number(from);
            if (to) query.time.$lte = Number(to);
        }

        const candles = await Candle.find(query).sort({ time: 1 }).limit(100000); // Increased limit to 100k for full history

        res.json(candles);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching candles' });
    }
};
