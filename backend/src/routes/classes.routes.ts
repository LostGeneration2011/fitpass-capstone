import { Router } from 'express';
import { 
  createClass, 
  getAllClasses, 
  getClassById, 
  updateClass, 
  deleteClass 
} from '../controllers/class.controller';

const router = Router();

// POST /api/classes - Create class
router.post('/', createClass);

// GET /api/classes - Get all classes
router.get('/', getAllClasses);

// GET /api/classes/:id - Get class by ID
router.get('/:id', getClassById);

// PATCH /api/classes/:id - Update class
router.patch('/:id', updateClass);

// PUT /api/classes/:id - Update class (alternative)
router.put('/:id', updateClass);

// DELETE /api/classes/:id - Delete class
router.delete('/:id', deleteClass);

export default router;
