import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await userService.getAllUsers();
    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await userService.getUserById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await userService.updateUser(id, req.body);
    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
