import { Router } from "express";
import { 
  createClass, 
  getAllClasses, 
  getClassById, 
  updateClass, 
  deleteClass 
} from "../controllers/class.controller";

const router = Router();

router.post("/", createClass);
router.get("/", getAllClasses);
router.get("/:id", getClassById);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);

export default router;
