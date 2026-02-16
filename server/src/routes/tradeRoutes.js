import express from 'express';
import { createTrade, closeTrade, getTrades, getTradeStats } from '../controllers/tradeController.js';
import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.post('/', createTrade);
router.get('/', getTrades);
router.get('/stats', getTradeStats);
router.post('/:id/close', closeTrade);
router.get('/', protect, getTrades);
export default router;
//# sourceMappingURL=tradeRoutes.js.map