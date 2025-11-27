import { Router } from "express";
import { getAllUsers, getUserById, updateUser } from "../controllers/userController";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);

export default router;
