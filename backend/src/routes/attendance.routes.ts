import { Router } from 'express';
import { 
  checkIn, 
  qrCheckIn,
  getAttendanceBySession, 
  getAttendanceByClass, 
  getAttendanceByStudent, 
  updateAttendance 
} from '../controllers/attendance.controller';

const router = Router();

// POST /api/attendance/check-in - Check in attendance
router.post('/check-in', checkIn);

// QR-based check-in endpoint (supports both GET and POST)
router.get('/checkin', qrCheckIn);
router.post('/checkin', qrCheckIn);

// GET /api/attendance/session/:sessionId - Get attendance by session (alternative route)
router.get('/session/:sessionId', (req, res) => {
  req.query.sessionId = req.params.sessionId;
  return getAttendanceBySession(req, res);
});

// PATCH /api/attendance/:id - Update attendance by id
router.patch('/:id', updateAttendance);

// GET /api/attendance?sessionId=xxx - Get attendance by session
// GET /api/attendance?classId=xxx - Get attendance by class  
// GET /api/attendance?studentId=xxx - Get attendance by student
router.get('/', (req, res) => {
  if (req.query.sessionId) {
    return getAttendanceBySession(req, res);
  } else if (req.query.classId) {
    return getAttendanceByClass(req, res);
  } else if (req.query.studentId) {
    return getAttendanceByStudent(req, res);
  } else {
    return res.status(400).json({ error: "One of sessionId, classId, or studentId is required" });
  }
});

// PATCH /api/attendance - Update attendance (admin only)
router.patch('/', updateAttendance);

export default router;
