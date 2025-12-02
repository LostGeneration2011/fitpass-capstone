import { Request, Response } from "express";
import { SessionService } from "../services/session.service";
import { SessionStatus } from "@prisma/client";

const sessionService = new SessionService();

export const createSession = async (req: Request, res: Response) => {
  try {
    const { classId, startTime, endTime } = req.body;

    if (!classId || !startTime || !endTime) {
      return res.status(400).json({ error: "classId, startTime, and endTime are required" });
    }

    const session = await sessionService.createSession(
      classId,
      new Date(startTime),
      new Date(endTime)
    );
    return res.status(201).json({ message: "Session created successfully", session });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const getSessions = async (req: Request, res: Response) => {
  try {
    const { classId } = req.query;

    let sessions;
    if (classId) {
      sessions = await sessionService.getSessionsByClass(classId as string);
    } else {
      sessions = await sessionService.getAllSessions();
    }

    return res.json({ sessions });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const getSessionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    const session = await sessionService.getSessionById(id);
    return res.json({ session });
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
};

export const updateSessionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ error: "Session ID and status are required" });
    }

    if (!['UPCOMING', 'ACTIVE', 'DONE', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const session = await sessionService.updateSessionStatus(id, status as SessionStatus);
    return res.json({ message: "Session status updated successfully", session });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

// General update session (supports status and other fields)
export const updateSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    // For now, only support status updates through general PATCH
    if (status) {
      if (!['UPCOMING', 'ACTIVE', 'DONE', 'CANCELLED'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const session = await sessionService.updateSessionStatus(id, status as SessionStatus);
      return res.json({ message: "Session updated successfully", session });
    }

    return res.status(400).json({ error: "No valid fields to update" });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const deleteSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    await sessionService.deleteSession(id);
    return res.json({ message: "Session deleted successfully" });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};