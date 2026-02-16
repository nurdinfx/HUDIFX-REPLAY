import type { Request, Response } from 'express';
import { Trade } from '../models/Trade.js';

interface AuthRequest extends Request {
    user?: any;
}

export const createTrade = async (req: AuthRequest, res: Response) => {
    const { symbol, entryPrice, lotSize, direction, stopLoss, takeProfit, sessionId, openTime } = req.body;

    try {
        const trade = await Trade.create({
            userId: req.user.id,
            sessionId,
            symbol,
            entryPrice,
            lotSize,
            direction,
            stopLoss,
            takeProfit,
            openTime: openTime || Date.now(),
            status: 'OPEN'
        });

        res.status(201).json(trade);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating trade' });
    }
};

export const closeTrade = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { exitPrice, closeTime } = req.body;

    try {
        const trade = await Trade.findOne({ _id: id, userId: req.user.id } as any);

        if (!trade) {
            return res.status(404).json({ message: 'Trade not found' });
        }

        if (trade.status === 'CLOSED') {
            return res.status(400).json({ message: 'Trade already closed' });
        }

        const profit = trade.direction === 'BUY'
            ? (exitPrice - trade.entryPrice) * trade.lotSize * 10000 // Simple pip calc for forex
            : (trade.entryPrice - exitPrice) * trade.lotSize * 10000;

        trade.exitPrice = exitPrice;
        trade.closeTime = closeTime || Date.now();
        trade.profit = profit;
        trade.status = 'CLOSED';

        await trade.save();

        res.json(trade);
    } catch (error) {
        res.status(500).json({ message: 'Server error closing trade' });
    }
};

export const getTrades = async (req: AuthRequest, res: Response) => {
    const { sessionId } = req.query;

    try {
        const query: any = { userId: req.user.id };
        if (sessionId) {
            query.sessionId = sessionId;
        }

        const trades = await Trade.find(query).sort({ createdAt: -1 });
        res.json(trades);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching trades' });
    }
};

export const getTradeStats = async (req: AuthRequest, res: Response) => {
    try {
        const trades = await Trade.find({ userId: req.user.id });

        const totalTrades = trades.length;
        const wins = trades.filter(t => (t.profit || 0) > 0).length;
        const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

        // Calculate other stats as needed
        const totalProfit = trades.reduce((sum, t) => sum + (t.profit || 0), 0);

        res.json({
            totalTrades,
            winRate,
            totalProfit,
            trades // Sending all trades for now, can optimize later by not sending this if not needed
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching trade stats' });
    }
};
