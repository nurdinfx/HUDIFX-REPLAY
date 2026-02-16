import { Request, Response } from 'express';
import { ReplaySession } from '../models/ReplaySession.js';
import { Candle } from '../models/Candle.js';
export const createSession = async (req, res) => {
    const { symbol, timeframe, startTime } = req.body;
    try {
        // Find the candle index for the start time
        // For simplicity, we assume the client sends a timestamp and we find the closest candle
        // faster approach would be to just store the timestamp and query candles <= timestamp
        // Find count of candles before this time to set index
        const count = await Candle.countDocuments({
            symbol,
            timeframe,
            time: { $lt: startTime }
        });
        const session = await ReplaySession.create({
            userId: req.user.id,
            symbol,
            timeframe,
            startTime,
            currentCandleIndex: count,
        });
        res.status(201).json(session);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error creating session', error: error.message });
    }
};
export const getSession = async (req, res) => {
    try {
        const session = await ReplaySession.findOne({
            userId: req.user.id,
            isActive: true
        }).sort({ createdAt: -1 });
        if (!session) {
            return res.status(404).json({ message: 'No active session' });
        }
        res.json(session);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching session' });
    }
};
export const updateSession = async (req, res) => {
    const { id } = req.params;
    const { currentCandleIndex, isActive } = req.body;
    try {
        const session = await ReplaySession.findByIdAndUpdate(id, { currentCandleIndex, isActive }, { new: true });
        res.json(session);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error updating session' });
    }
};
export const getAllSessions = async (req, res) => {
    try {
        const sessions = await ReplaySession.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        res.json(sessions);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching sessions' });
    }
};
//# sourceMappingURL=replayController.js.map