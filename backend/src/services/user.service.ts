import { prisma } from '../config/prisma';

export class UserService {
  async getAllUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  async updateUser(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data
    });
  }
}
