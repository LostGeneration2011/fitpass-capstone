import { Request, Response } from "express";
import { ClassService } from "../services/class.service";

const classService = new ClassService();

export const createClass = async (req: Request, res: Response) => {
  try {
    const created = await classService.createClass(req.body);
    return res.status(201).json(created);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const getAllClasses = async (req: Request, res: Response) => {
  try {
    const classes = await classService.getAllClasses();
    return res.json(classes);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getClassById = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;
    
    if (!classId) {
      return res.status(400).json({ error: "Class ID is required" });
    }
    
    const cls = await classService.getClassById(classId);

    if (!cls) return res.status(404).json({ error: "Class not found" });

    return res.json(cls);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateClass = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    if (!id) {
      return res.status(400).json({ error: "Class ID is required" });
    }
    
    const updated = await classService.updateClass(id, req.body);
    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    if (!id) {
      return res.status(400).json({ error: "Class ID is required" });
    }
    
    await classService.deleteClass(id);
    return res.json({ message: "Class deleted" });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
