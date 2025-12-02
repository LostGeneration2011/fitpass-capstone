import { Router } from 'express';
import { 
  createSession, 
  getSessions, 
  getSessionById, 
  updateSessionStatus,
  updateSession,
  deleteSession 
} from '../controllers/session.controller';

const router = Router();

// POST /api/sessions - Create session
router.post('/', createSession);

// GET /api/sessions - Get all sessions or by classId
// GET /api/sessions?classId=xxx - Get sessions by class
router.get('/', getSessions);

// GET /api/sessions/:id - Get session by ID
router.get('/:id', getSessionById);

// PATCH /api/sessions/:id/status - Update session status
router.patch('/:id/status', updateSessionStatus);

// PATCH /api/sessions/:id - General update session
router.patch('/:id', updateSession);

// DELETE /api/sessions/:id - Delete session
router.delete('/:id', deleteSession);

export default router;
