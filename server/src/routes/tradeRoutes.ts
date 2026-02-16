import express from 'express';
import { createTrade, closeTrade, getTrades, getTradeStats } from '../controllers/tradeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTrade);
router.get('/', protect, getTrades);
router.get('/stats', protect, getTradeStats);
router.post('/:id/close', protect, closeTrade);

export default router;
