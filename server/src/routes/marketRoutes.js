import express from 'express';
import { getCandles } from '../controllers/marketController';
import { protect } from '../middlewares/authMiddleware';
const router = express.Router();
router.get('/candles', protect, getCandles);
export default router;
//# sourceMappingURL=marketRoutes.js.map