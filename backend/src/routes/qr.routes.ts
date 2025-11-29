import { Router } from 'express';
import { QRController } from '../controllers/qr.controller';

const router = Router();

// POST /api/sessions/:id/start - Teacher starts session and generates QR
router.post('/sessions/:id/start', QRController.startSession);

// POST /api/attendance/qr-checkin - Student check-in via QR scan
router.post('/attendance/qr-checkin', QRController.qrCheckIn);

export default router;