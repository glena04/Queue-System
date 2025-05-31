import { Request, Response } from 'express';
import { login, register } from '../services/authService';

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const authResponse = await login(email, password);
    // Pass the complete response (user and token) to the client
    res.json(authResponse);
  } catch (error: any) {
    res.status(401).json({ message: error.message || 'Authentication failed' });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role, fullName } = req.body;
    const user = await register(email, password, role, fullName);
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Registration failed' });
  }
};