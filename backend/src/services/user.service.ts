import { prisma } from "../config/prisma";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

export class UserService {
  // GET all users (admin only)
  async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // GET user by ID
  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            classesTeaching: true,
            enrollments: true,
            attendances: true
          }
        }
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  // UPDATE user (admin only)
  async updateUser(id: string, data: { fullName?: string; role?: UserRole; email?: string }) {
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Check if email is taken by another user
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email }
      });
      
      if (emailExists) {
        throw new Error("Email already exists");
      }
    }

    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  // DELETE user (admin only)
  async deleteUser(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            classesTeaching: true,
            enrollments: true,
            attendances: true
          }
        }
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user has dependencies
    const { _count } = user;
    if (_count.classesTeaching > 0) {
      throw new Error("Cannot delete user who is teaching classes");
    }

    return await prisma.user.delete({
      where: { id }
    });
  }

  // Create user (admin only)
  async createUser(email: string, fullName: string, role: UserRole, password?: string) {
    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    // Default password if not provided
    const defaultPassword = password || 'password123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    return await prisma.user.create({
      data: {
        email,
        fullName,
        role,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
}
