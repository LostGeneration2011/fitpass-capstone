import { prisma } from "../config/prisma";

export class EnrollmentService {
  // POST /api/enrollments - Student enroll in class
  async createEnrollment(studentId: string, classId: string) {
    // Check if class exists and has capacity
    const existingClass = await prisma.class.findUnique({
      where: { id: classId },
      include: { _count: { select: { enrollments: true } } }
    });

    if (!existingClass) {
      throw new Error("Class not found");
    }

    if (existingClass._count.enrollments >= existingClass.capacity) {
      throw new Error("Class is full");
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        studentId_classId: { studentId, classId }
      }
    });

    if (existing) {
      throw new Error("Already enrolled in this class");
    }

    return await prisma.enrollment.create({
      data: { studentId, classId },
      include: {
        student: { select: { id: true, fullName: true, email: true } },
        class: { select: { id: true, name: true, description: true } }
      }
    });
  }

  // GET enrollments by class
  async getEnrollmentsByClass(classId: string) {
    return await prisma.enrollment.findMany({
      where: { classId },
      include: {
        student: { select: { id: true, fullName: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // GET enrollments by student
  async getEnrollmentsByStudent(studentId: string) {
    return await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        class: { 
          select: { 
            id: true, 
            name: true, 
            description: true, 
            teacher: { select: { fullName: true } }
          } 
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // DELETE unenroll
  async deleteEnrollment(studentId: string, classId: string) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_classId: { studentId, classId }
      }
    });

    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    return await prisma.enrollment.delete({
      where: {
        studentId_classId: { studentId, classId }
      }
    });
  }
}