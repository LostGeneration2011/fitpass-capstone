import { Router } from 'express';
import { 
  getAllEnrollments,
  createEnrollment, 
  getEnrollmentsByClass, 
  getEnrollmentsByStudent, 
  deleteEnrollment 
} from '../controllers/enrollment.controller';

const router = Router();

// POST /api/enrollments - Create enrollment
router.post('/', createEnrollment);

// GET /api/enrollments - Get all enrollments (or filtered by classId/studentId)
router.get('/', (req, res) => {
  if (req.query.classId) {
    return getEnrollmentsByClass(req, res);
  } else if (req.query.studentId) {
    return getEnrollmentsByStudent(req, res);
  } else {
    return getAllEnrollments(req, res);
  }
});

// DELETE /api/enrollments - Unenroll
router.delete('/', deleteEnrollment);

export default router;
