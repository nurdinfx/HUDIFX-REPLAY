import type { Request, Response } from 'express';
import { ReplaySession } from '../models/ReplaySession.js';
import { Candle } from '../models/Candle.js';

interface AuthRequest extends Request {
    user?: any;
}

export const createSession = async (req: AuthRequest, res: Response) => {
    const { name, symbol, broker, balance, startDate, endDate, type } = req.body;

    try {
        // For the quick session, we might not have a specific startTime yet
        // In a real app, we'd find the first candle for the given asset/broker after startDate
        const startTime = new Date(startDate).getTime();

        const session = await ReplaySession.create({
            userId: req.user.id,
            name,
            symbol,
            broker,
            balance: balance || 100000,
            startDate,
            endDate,
            type,
            startTime,
            currentCandleIndex: 0 // Reset for new session
        });

        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating session', error: (error as Error).message });
    }
};

export const getSession = async (req: AuthRequest, res: Response) => {
    try {
        const session = await ReplaySession.findOne({
            userId: req.user.id,
            isActive: true
        }).sort({ createdAt: -1 });

        if (!session) {
            return res.status(404).json({ message: 'No active session' });
        }

        res.json(session);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching session' });
    }
}

export const updateSession = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { currentCandleIndex, isActive } = req.body;

    try {
        const session = await ReplaySession.findByIdAndUpdate(
            id,
            { currentCandleIndex, isActive },
            { new: true }
        );
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating session' });
    }
}

export const getSessionById = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const session = await ReplaySession.findById(id);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching session' });
    }
};

export const getAllSessions = async (req: AuthRequest, res: Response) => {
    try {
        const sessions = await ReplaySession.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching sessions' });
    }
};
