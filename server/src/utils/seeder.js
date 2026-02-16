import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Candle } from '../models/Candle';
import connectDB from '../config/db';
dotenv.config();
const generateCandles = (symbol, timeframe, count) => {
    const candles = [];
    let time = Math.floor(Date.now() / 1000) - count * 60; // Start 'count' minutes ago
    let price = 100.0;
    for (let i = 0; i < count; i++) {
        const open = price;
        const volatility = 0.5; // 0.5% volatility
        const change = (Math.random() - 0.5) * volatility;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * volatility * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * 0.5;
        candles.push({
            symbol,
            timeframe,
            time,
            open,
            high,
            low,
            close,
            volume: Math.floor(Math.random() * 1000) + 100
        });
        price = close;
        time += 60; // Add 1 minute (simplification for now)
    }
    return candles;
};
const seedData = async () => {
    try {
        await connectDB();
        await Candle.deleteMany({});
        console.log('Old data removed');
        const candles = generateCandles('EURUSD', '1m', 10000);
        await Candle.insertMany(candles);
        console.log(`Seeded ${candles.length} candles for EURUSD`);
        process.exit();
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
seedData();
//# sourceMappingURL=seeder.js.map