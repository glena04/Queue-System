import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
  // Return both user (without password) and token
  const userWithoutPassword = {
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName
  };
  return { user: userWithoutPassword, token };
};

export const register = async (email: string, password: string, role: string, fullName: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword, role, fullName });
  return user;
};