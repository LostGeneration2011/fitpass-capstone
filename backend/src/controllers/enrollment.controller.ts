import { Request, Response } from "express";
import { EnrollmentService } from "../services/enrollment.service";

const enrollmentService = new EnrollmentService();

export const getAllEnrollments = async (req: Request, res: Response) => {
  try {
    const enrollments = await enrollmentService.getAllEnrollments();
    return res.json({ enrollments });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const createEnrollment = async (req: Request, res: Response) => {
  try {
    const { studentId, classId } = req.body;

    if (!studentId || !classId) {
      return res.status(400).json({ error: "studentId and classId are required" });
    }

    const enrollment = await enrollmentService.createEnrollment(studentId, classId);
    return res.status(201).json({ message: "Enrolled successfully", enrollment });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const getEnrollmentsByClass = async (req: Request, res: Response) => {
  try {
    const { classId } = req.query;

    if (!classId) {
      return res.status(400).json({ error: "classId is required" });
    }

    const enrollments = await enrollmentService.getEnrollmentsByClass(classId as string);
    return res.json({ enrollments });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const getEnrollmentsByStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ error: "studentId is required" });
    }

    const enrollments = await enrollmentService.getEnrollmentsByStudent(studentId as string);
    return res.json({ enrollments });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const deleteEnrollment = async (req: Request, res: Response) => {
  try {
    const { studentId, classId } = req.body;

    if (!studentId || !classId) {
      return res.status(400).json({ error: "studentId and classId are required" });
    }

    await enrollmentService.deleteEnrollment(studentId, classId);
    return res.json({ message: "Unenrolled successfully" });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};