import connectDB from '../config/db.js';
import { Candle } from '../models/Candle.js';

const checkData = async () => {
    try {
        await connectDB();
        const count = await Candle.countDocuments();
        console.log(`Total candles in database: ${count}`);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkData();
