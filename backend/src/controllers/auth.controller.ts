import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await authService.register(name, email, password);

    res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await authService.login(email, password);

    res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const me = async (req: any, res: Response) => {
  try {
    const user = await authService.getMe(req.user.userId);

    res.json({ user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.json({ message: 'Logout success' });
};
