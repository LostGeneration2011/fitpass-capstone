import { Router } from 'express';
import { 
  createEnrollment, 
  getEnrollmentsByClass, 
  getEnrollmentsByStudent, 
  deleteEnrollment 
} from '../controllers/enrollment.controller';

const router = Router();

// POST /api/enrollments - Create enrollment
router.post('/', createEnrollment);

// GET /api/enrollments?classId=xxx - Get enrollments by class
// GET /api/enrollments?studentId=xxx - Get enrollments by student
router.get('/', (req, res) => {
  if (req.query.classId) {
    return getEnrollmentsByClass(req, res);
  } else if (req.query.studentId) {
    return getEnrollmentsByStudent(req, res);
  } else {
    return res.status(400).json({ error: "Either classId or studentId is required" });
  }
});

// DELETE /api/enrollments - Unenroll
router.delete('/', deleteEnrollment);

export default router;
