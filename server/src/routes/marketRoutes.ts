import express from 'express';
import { getCandles, seedMarketData } from '../controllers/marketController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/candles', getCandles);
router.get('/seed', seedMarketData); // New manual seed endpoint

export default router;
