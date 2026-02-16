import express from 'express';
import { createSession, getSession, updateSession, getAllSessions } from '../controllers/replayController.js';
import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.post('/', createSession);
router.get('/active', getSession);
router.get('/all', getAllSessions);
router.put('/:id', updateSession);
export default router;
//# sourceMappingURL=replayRoutes.js.map