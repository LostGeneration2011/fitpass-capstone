import { Request, Response } from "express";
import { AttendanceService } from "../services/attendance.service";
import { AttendanceStatus } from "@prisma/client";

const attendanceService = new AttendanceService();

export const checkIn = async (req: Request, res: Response) => {
  try {
    const { sessionId, studentId, status = 'PRESENT' } = req.body;

    if (!sessionId || !studentId) {
      return res.status(400).json({ error: "sessionId and studentId are required" });
    }

    const attendance = await attendanceService.checkIn(sessionId, studentId, status as AttendanceStatus);
    return res.status(201).json({ message: "Check-in successful", attendance });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const getAttendanceBySession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    const attendances = await attendanceService.getAttendanceBySession(sessionId as string);
    return res.json({ attendances });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const getAttendanceByClass = async (req: Request, res: Response) => {
  try {
    const { classId } = req.query;

    if (!classId) {
      return res.status(400).json({ error: "classId is required" });
    }

    const attendances = await attendanceService.getAttendanceByClass(classId as string);
    return res.json({ attendances });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const getAttendanceByStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ error: "studentId is required" });
    }

    const attendances = await attendanceService.getAttendanceByStudent(studentId as string);
    return res.json({ attendances });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const updateAttendance = async (req: Request, res: Response) => {
  try {
    // Support both route formats: /attendance/:id and /attendance with body params
    const attendanceId = req.params.id;
    
    if (attendanceId) {
      // Format: PATCH /attendance/:id with { status }
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "status is required" });
      }
      
      const attendance = await attendanceService.updateAttendanceById(attendanceId, status as AttendanceStatus);
      return res.json({ message: "Attendance updated successfully", attendance });
    } else {
      // Format: PATCH /attendance with { sessionId, studentId, status }
      const { sessionId, studentId, status } = req.body;

      if (!sessionId || !studentId || !status) {
        return res.status(400).json({ error: "sessionId, studentId, and status are required" });
      }

      const attendance = await attendanceService.updateAttendance(sessionId, studentId, status as AttendanceStatus);
      return res.json({ message: "Attendance updated successfully", attendance });
    }
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};