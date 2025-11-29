import { prisma } from "../config/prisma";

export class ClassService {
  async createClass(data: any) {
    console.log('ClassService: Creating class with data:', data);
    
    const allowed = ["name", "description", "capacity", "duration", "teacherId"];

    const filtered: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) filtered[key] = data[key];
    }

    console.log('ClassService: Filtered data:', filtered);

    if (!filtered.name) throw new Error("Class name is required.");
    if (!filtered.duration) throw new Error("Class duration is required.");

    // Validate teacherId if provided
    if (filtered.teacherId) {
      const teacher = await prisma.user.findUnique({
        where: { 
          id: filtered.teacherId,
          role: 'TEACHER' 
        }
      });
      if (!teacher) {
        throw new Error("Invalid teacher ID or user is not a teacher");
      }
    } else {
      // If no teacherId provided, set to null
      filtered.teacherId = null;
    }

    try {
      const result = await prisma.class.create({
        data: {
          ...filtered,
          capacity: filtered.capacity || 20,
        },
        include: {
          teacher: { select: { id: true, fullName: true, email: true } }
        }
      });
      
      console.log('ClassService: Created class:', result);
      return result;
    } catch (prismaError: any) {
      console.error('ClassService: Prisma error:', prismaError);
      throw new Error(`Database error: ${prismaError.message}`);
    }
  }

  async getAllClasses() {
    return prisma.class.findMany({
      include: {
        teacher: { select: { id: true, fullName: true, email: true } },
        sessions: true,
        _count: { select: { enrollments: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getClassById(id: string) {
    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        teacher: { select: { id: true, fullName: true, email: true } },
        sessions: true,
        enrollments: {
          include: {
            student: { select: { id: true, fullName: true, email: true } }
          }
        },
        _count: { select: { enrollments: true, sessions: true } }
      }
    });

    if (!classData) {
      throw new Error("Class not found");
    }

    return classData;
  }

  async updateClass(id: string, data: any) {
    const allowed = ["name", "description", "capacity", "duration", "teacherId"];

    const filtered: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) filtered[key] = data[key];
    }

    const existingClass = await prisma.class.findUnique({ where: { id } });
    if (!existingClass) {
      throw new Error("Class not found");
    }

    return prisma.class.update({
      where: { id },
      data: filtered,
      include: {
        teacher: { select: { id: true, fullName: true, email: true } }
      }
    });
  }

  async deleteClass(id: string) {
    const existingClass = await prisma.class.findUnique({
      where: { id },
      include: { _count: { select: { enrollments: true, sessions: true } } }
    });

    if (!existingClass) {
      throw new Error("Class not found");
    }

    if (existingClass._count.enrollments > 0 || existingClass._count.sessions > 0) {
      throw new Error("Cannot delete class with enrollments or sessions");
    }

    return prisma.class.delete({ where: { id } });
  }
}
