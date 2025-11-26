import { Router } from "express";
import { prisma } from "../config/prisma";

const router = Router();

router.get("/users", async (_req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "DB error", error });
  }
});

export default router;