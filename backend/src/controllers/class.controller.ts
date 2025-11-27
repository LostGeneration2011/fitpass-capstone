import { Request, Response } from "express";
import { ClassService } from "../services/class.service";

const classService = new ClassService();

export const createClass = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, description, capacity, duration } = req.body;

    // Validate required fields
    if (!name || !duration) {
      return res.status(400).json({ 
        error: "Name and duration are required fields",
        requiredFields: {
          name: "string",
          duration: "number (minutes)"
        },
        optionalFields: {
          description: "string",
          capacity: "number (default: 20)"
        }
      });
    }

    const classData = {
      name,
      description,
      capacity: capacity ? Number(capacity) : undefined,
      duration: Number(duration)
    };

    const created = await classService.createClass(classData);
    return res.status(201).json(created);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const getAllClasses = async (req: Request, res: Response): Promise<Response> => {
  try {
    const data = await classService.getAllClasses();
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getClassById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Class ID is required" });
    }

    const data = await classService.getClassById(id);

    if (!data) {
      return res.status(404).json({ error: "Class not found" });
    }

    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateClass = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Class ID is required" });
    }

    const updated = await classService.updateClass(id, req.body);

    return res.json(updated);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const deleteClass = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Class ID is required" });
    }

    const deleted = await classService.deleteClass(id);

    return res.json({
      message: "Class soft-deleted",
      deleted
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
