import { Router } from 'express';
import { login, register, logout, me } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);

// 🔥 Thêm route quan trọng
router.get('/me', authMiddleware, me);

export default router;
