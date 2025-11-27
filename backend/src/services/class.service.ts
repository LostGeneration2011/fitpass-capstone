import { prisma } from "../config/prisma";

interface CreateClassData {
  name: string;
  description?: string;
  capacity?: number;
  duration: number;
}

interface UpdateClassData {
  name?: string;
  description?: string;
  capacity?: number;
  duration?: number;
  isActive?: boolean;
}

export class ClassService {
  async createClass(data: CreateClassData) {
    // Validate and filter only allowed fields
    const validData = {
      name: data.name,
      description: data.description,
      capacity: data.capacity || 20,
      duration: data.duration,
    };

    return prisma.class.create({
      data: validData,
      include: {
        sessions: true,
        enrollments: true
      }
    });
  }

  async getAllClasses() {
    return prisma.class.findMany({
      where: { isActive: true },
      include: {
        sessions: {
          include: {
            teacher: true
          }
        },
        enrollments: true
      }
    });
  }

  async getClassById(id: string) {
    return prisma.class.findUnique({
      where: { id },
      include: {
        sessions: {
          include: {
            teacher: true
          }
        },
        enrollments: {
          include: {
            user: true
          }
        }
      }
    });
  }

  async updateClass(id: string, data: UpdateClassData) {
    // Validate and filter only allowed fields
    const validData: any = {};
    
    if (data.name !== undefined) validData.name = data.name;
    if (data.description !== undefined) validData.description = data.description;
    if (data.capacity !== undefined) validData.capacity = data.capacity;
    if (data.duration !== undefined) validData.duration = data.duration;
    if (data.isActive !== undefined) validData.isActive = data.isActive;

    return prisma.class.update({
      where: { id },
      data: validData,
      include: {
        sessions: {
          include: {
            teacher: true
          }
        },
        enrollments: {
          include: {
            user: true
          }
        }
      }
    });
  }

  async deleteClass(id: string) {
    return prisma.class.update({
      where: { id },
      data: { isActive: false }
    });
  }
}
