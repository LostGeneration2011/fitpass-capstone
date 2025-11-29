import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";

export class AuthService {
  async register(name: string, email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Email already exists");

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { fullName: name, email, password: hashed }
    });

    return user;
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid email or password");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid email or password");

    const token = jwt.sign(
      { 
        id: user.id,
        userId: user.id, 
        email: user.email,
        role: user.role,
        fullName: user.fullName
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return { user, token };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true
      }
    });
    return user;
  }
}
