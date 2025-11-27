import { prisma } from "../config/prisma";

export class UserService {
  async getAllUsers() {
    return prisma.user.findMany({
      include: {
        packages: true,
        notifications: true,
      }
    });
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        packages: true,
        notifications: true,
        attendance: true,
      }
    });
  }

  async updateUser(id: string, data: any) {
    const allowedFields = ["name", "phone", "avatar", "isActive", "role"];

    const filteredData: any = {};
    for (const key of allowedFields) {
      if (data[key] !== undefined) filteredData[key] = data[key];
    }

    return prisma.user.update({
      where: { id },
      data: filteredData,
    });
  }
}
