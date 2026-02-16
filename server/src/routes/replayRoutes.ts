import express from 'express';
import { createSession, getSession, updateSession, getAllSessions, getSessionById } from '../controllers/replayController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createSession);
router.get('/active', protect, getSession);
router.get('/all', protect, getAllSessions);
router.get('/:id', getSessionById);
router.put('/:id', protect, updateSession);

export default router;
