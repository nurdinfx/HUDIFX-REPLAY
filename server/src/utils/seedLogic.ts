import { Candle } from '../models/Candle.js';

export const generateCandles = (symbol: string, timeframe: string, count: number) => {
    const candles = [];

    // Determine interval in seconds
    let interval = 60;
    if (timeframe === '5m') interval = 5 * 60;
    else if (timeframe === '15m') interval = 15 * 60;
    else if (timeframe === '30m') interval = 30 * 60;
    else if (timeframe === '1h') interval = 60 * 60;
    else if (timeframe === '4h') interval = 4 * 60 * 60;
    else if (timeframe === '1D') interval = 24 * 60 * 60;
    else if (timeframe === '1M') interval = 30 * 24 * 60 * 60;

    // Start 'count' intervals ago
    let time = Math.floor(Date.now() / 1000) - (count * interval);

    // Base price generation (different for pairs to look realistic)
    let price = 1.1000; // EURUSD default
    if (symbol.includes('JPY')) price = 145.00;
    else if (symbol.includes('XAU')) price = 2000.00;
    else if (symbol.includes('AUD')) price = 0.6500;

    for (let i = 0; i < count; i++) {
        const open = price;
        // Volatility depends on timeframe to look realistic
        const volatilityBase = symbol.includes('JPY') || symbol.includes('XAU') ? 0.3 : 0.005;
        const volatility = interval * 0.0001 * volatilityBase; // More time = more movement

        const change = (Math.random() - 0.5) * (price * 0.005); // 0.5% move max per bar roughly

        const close = open + change;
        const high = Math.max(open, close) + Math.random() * (price * 0.001);
        const low = Math.min(open, close) - Math.random() * (price * 0.001);

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
        time += interval;
    }
    return candles;
};

export const seedDB = async () => {
    console.log('Starting seedDB function...');
    try {
        console.log('Attempting to delete old candles...');
        const deleteResult = await Candle.deleteMany({});
        console.log(`Old data removed. (Deleted ${deleteResult.deletedCount} items)`);

        const symbols = [
            // Forex
            'AUDCAD', 'AUDCHF', 'AUDJPY', 'AUDNZD', 'AUDUSD', 'CADCHF', 'CADJPY', 'CHFJPY',
            'EURAUD', 'EURCAD', 'EURCHF', 'EURGBP', 'EURJPY', 'EURNZD', 'EURUSD',
            'GBPAUD', 'GBPCAD', 'GBPCHF', 'GBPJPY', 'GBPNZD', 'GBPUSD',
            'NZDCAD', 'NZDCHF', 'NZDJPY', 'NZDUSD', 'USDCAD', 'USDCHF', 'USDJPY',
            // Metal
            'XAUUSD', 'XAGUSD',
            // Crypto
            'BTCUSD', 'ETHUSD', 'LTCUSD',
            // Indices
            'US30', 'SPX500', 'NAS100'
        ];

        // Comprehensive list of timeframes
        const timeframes = ['1m', '5m', '15m', '1h', '4h', '1D'];

        for (const symbol of symbols) {
            for (const tf of timeframes) {
                console.log(`Generating candles for ${symbol} (${tf})...`);

                // drastically increase counts for "infinite scroll" feel
                let count = 1000;
                if (tf === '1m') count = 50000; // ~34 days of minute data
                else if (tf === '5m') count = 25000; // ~86 days
                else if (tf === '15m') count = 25000; // ~260 days
                else if (tf === '1h') count = 50000; // ~5.7 years
                else if (tf === '4h') count = 25000; // ~11 years
                else if (tf === '1D') count = 73000; // ~200 years (requested by user)

                const candles = generateCandles(symbol, tf, count);

                // Insert in chunks to avoid memory issues if too large
                const chunkSize = 5000;
                for (let i = 0; i < candles.length; i += chunkSize) {
                    const chunk = candles.slice(i, i + chunkSize);
                    await Candle.insertMany(chunk);
                }

                console.log(`✅ Seeded ${candles.length} candles for ${symbol} (${tf})`);
            }
        }
        console.log('🌟 Seeding finished successfully!');
    } catch (error) {
        console.error('❌ Seeding error:', error);
    }
};
