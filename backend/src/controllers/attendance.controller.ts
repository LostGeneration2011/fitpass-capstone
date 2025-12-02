import { Request, Response } from "express";
import { AttendanceService } from "../services/attendance.service";
import { AttendanceStatus } from "@prisma/client";
import { nonceStore } from "../utils/nonce-store";

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

// QR-based checkin endpoint
export const qrCheckIn = async (req: Request, res: Response) => {
  try {
    // Get payload from query (for GET) or body (for POST)
    const payloadData = req.query.payload || req.body.payload;
    
    if (!payloadData) {
      return res.status(400).json({ error: "Missing payload" });
    }

    // Decode base64 payload
    let payload;
    try {
      const decodedPayload = Buffer.from(payloadData as string, 'base64').toString('utf8');
      payload = JSON.parse(decodedPayload);
    } catch (error) {
      return res.status(400).json({ error: "Invalid QR payload" });
    }

    // Validate payload structure
    const { sessionId, nonce, expiresAt } = payload;
    if (!sessionId || !nonce || !expiresAt) {
      return res.status(400).json({ error: "Invalid QR payload structure" });
    }

    // Check if QR is expired
    if (Date.now() > expiresAt) {
      return res.status(400).json({ error: "QR code expired" });
    }

    // Check if nonce already used
    if (nonceStore.isUsed(nonce)) {
      return res.status(400).json({ error: "QR already used" });
    }

    // Store nonce to prevent reuse
    nonceStore.store(nonce);

    // Get authenticated user (student)
    const user = (req as any).user;
    if (!user || user.role !== 'STUDENT') {
      return res.status(403).json({ error: "Only students can check in" });
    }

    // Validate session exists and is active/upcoming
    const session = await attendanceService.getSessionById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.status !== 'ACTIVE' && session.status !== 'UPCOMING') {
      return res.status(400).json({ error: "Session is not active or upcoming" });
    }

    // Check if student is enrolled in the class
    const enrollment = await attendanceService.getEnrollmentByStudentAndClass(user.id, session.classId);
    if (!enrollment) {
      return res.status(403).json({ error: "You are not enrolled in this class" });
    }

    // Create attendance record
    const attendance = await attendanceService.checkIn(sessionId, user.id, 'PRESENT');
    
    return res.status(200).json({ 
      success: true, 
      message: "Checked in successfully", 
      data: { sessionId, studentId: user.id }
    });

  } catch (err: any) {
    console.error('QR CheckIn Error:', err);
    return res.status(500).json({ error: err.message || "Internal server error" });
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