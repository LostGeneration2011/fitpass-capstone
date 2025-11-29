import { prisma } from "../config/prisma";
import { SessionStatus } from "@prisma/client";

export class SessionService {
  // POST /api/sessions
  async createSession(classId: string, startTime: Date, endTime: Date) {
    // Check if class exists
    const existingClass = await prisma.class.findUnique({
      where: { id: classId }
    });

    if (!existingClass) {
      throw new Error("Class not found");
    }

    // Validate time
    if (startTime >= endTime) {
      throw new Error("Start time must be before end time");
    }

    if (startTime < new Date()) {
      throw new Error("Start time must be in the future");
    }

    return await prisma.session.create({
      data: {
        classId,
        startTime,
        endTime,
        status: 'UPCOMING'
      },
      include: {
        class: { select: { id: true, name: true, description: true } }
      }
    });
  }

  // GET /api/sessions?classId=xxx
  async getSessionsByClass(classId: string) {
    return await prisma.session.findMany({
      where: { classId },
      include: {
        class: { select: { id: true, name: true, description: true } },
        _count: { select: { attendances: true } }
      },
      orderBy: { startTime: 'asc' }
    });
  }

  // GET /api/sessions
  async getAllSessions() {
    return await prisma.session.findMany({
      include: {
        class: { select: { id: true, name: true, description: true } },
        _count: { select: { attendances: true } }
      },
      orderBy: { startTime: 'asc' }
    });
  }

  // GET /api/sessions/:id
  async getSessionById(id: string) {
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        class: { select: { id: true, name: true, description: true } },
        attendances: {
          include: {
            student: { select: { id: true, fullName: true, email: true } }
          }
        }
      }
    });

    if (!session) {
      throw new Error("Session not found");
    }

    return session;
  }

  // PATCH session status
  async updateSessionStatus(id: string, status: SessionStatus) {
    const existingSession = await prisma.session.findUnique({
      where: { id }
    });

    if (!existingSession) {
      throw new Error("Session not found");
    }

    return await prisma.session.update({
      where: { id },
      data: { status },
      include: {
        class: { select: { id: true, name: true, description: true } }
      }
    });
  }

  // DELETE session
  async deleteSession(id: string) {
    const existingSession = await prisma.session.findUnique({
      where: { id },
      include: { _count: { select: { attendances: true } } }
    });

    if (!existingSession) {
      throw new Error("Session not found");
    }

    if (existingSession._count.attendances > 0) {
      throw new Error("Cannot delete session with attendance records");
    }

    return await prisma.session.delete({
      where: { id }
    });
  }
}