import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const COOKIE_NAME = 'solace_token';
const COOKIE_OPTIONS = {
  httpOnly: true,    // JS cannot read this — blocks XSS token theft
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
  sameSite: 'lax' as const, // CSRF protection while allowing normal navigation
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

function signToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

export async function register(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ message: 'Email already in use' });
    return;
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user.id);

  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
  res.status(201).json({ user: { id: user.id, name: user.name, email: user.email } });
}

export async function login(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  const token = signToken(user.id);
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie(COOKIE_NAME);
  res.json({ message: 'Logged out' });
}

export async function getMe(req: Request & { userId?: string }, res: Response): Promise<void> {
  const user = await User.findById(req.userId).select('-password');
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json(user);
}
