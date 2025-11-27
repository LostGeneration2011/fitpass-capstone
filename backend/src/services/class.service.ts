import { prisma } from "../config/prisma";

export class ClassService {
  async createClass(data: any) {
    const allowed = ["name", "description", "capacity", "duration", "isActive"];

    const filtered: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) filtered[key] = data[key];
    }

    if (!filtered.name) throw new Error("Class name is required.");
    if (!filtered.duration) throw new Error("Class duration is required.");

    return prisma.class.create({
      data: {
        ...filtered,
        capacity: filtered.capacity || 20,
      },
    });
  }

  async getAllClasses() {
    return prisma.class.findMany({
      include: {
        sessions: true,
        enrollments: true,
      }
    });
  }

  async getClassById(id: string) {
    return prisma.class.findUnique({
      where: { id },
      include: {
        sessions: true,
        enrollments: true,
      }
    });
  }

  async updateClass(id: string, data: any) {
    const allowed = ["name", "description", "capacity", "duration", "isActive"];

    const filtered: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) filtered[key] = data[key];
    }

    return prisma.class.update({
      where: { id },
      data: filtered,
    });
  }

  async deleteClass(id: string) {
    return prisma.class.delete({ where: { id } });
  }
}
