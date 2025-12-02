import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register(name, email, password);
    res.status(201).json({ message: "User registered", user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log('Login request body:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    console.log('Login attempt for:', email);
    const { user, token } = await authService.login(email, password);
    console.log('Login successful for:', email);
    return res.json({ message: "Login successful", token, user });
  } catch (err: any) {
    console.error('Login error:', err.message);
    return res.status(400).json({ error: err.message });
  }
};

export const me = async (req: any, res: Response) => {
  try {
    const user = await authService.getMe(req.user.id);
    return res.json({ user });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.json({ message: "Logout success" });
};
