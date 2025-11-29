import { Router } from 'express';
import { 
  checkIn, 
  getAttendanceBySession, 
  getAttendanceByClass, 
  getAttendanceByStudent, 
  updateAttendance 
} from '../controllers/attendance.controller';

const router = Router();

// POST /api/attendance/check-in - Check in attendance
router.post('/check-in', checkIn);

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
