import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import MoodLog from '../models/MoodLog';

export async function getLogs(req: AuthRequest, res: Response): Promise<void> {
  // Default to last 30 days; support ?days=N query param
  const days = Math.min(Number(req.query.days) || 30, 365);
  const since = new Date();
  since.setDate(since.getDate() - days);

  const logs = await MoodLog.find({ userId: req.userId, createdAt: { $gte: since } }).sort({
    createdAt: -1,
  });

  res.json(logs);
}

export async function createLog(req: AuthRequest, res: Response): Promise<void> {
  const { score, note, tags } = req.body;

  if (!score || score < 1 || score > 5) {
    res.status(400).json({ message: 'Score must be between 1 and 5' });
    return;
  }

  const log = await MoodLog.create({ userId: req.userId, score, note, tags });
  res.status(201).json(log);
}

export async function deleteLog(req: AuthRequest, res: Response): Promise<void> {
  const result = await MoodLog.deleteOne({ _id: req.params.id, userId: req.userId });
  if (result.deletedCount === 0) {
    res.status(404).json({ message: 'Log not found' });
    return;
  }
  res.json({ message: 'Log deleted' });
}
