import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import ChatSession from '../models/ChatSession';
import { getChatResponse, generateSessionTitle } from '../services/claudeService';

export async function getSessions(req: AuthRequest, res: Response): Promise<void> {
  const sessions = await ChatSession.find({ userId: req.userId })
    .select('title createdAt updatedAt')
    .sort({ updatedAt: -1 });
  res.json(sessions);
}

export async function getSession(req: AuthRequest, res: Response): Promise<void> {
  const session = await ChatSession.findOne({ _id: req.params.id, userId: req.userId });
  if (!session) {
    res.status(404).json({ message: 'Session not found' });
    return;
  }
  res.json(session);
}

export async function createSession(req: AuthRequest, res: Response): Promise<void> {
  const session = await ChatSession.create({ userId: req.userId, messages: [] });
  res.status(201).json(session);
}

export async function sendMessage(req: AuthRequest, res: Response): Promise<void> {
  const { content } = req.body;
  if (!content?.trim()) {
    res.status(400).json({ message: 'Message content is required' });
    return;
  }

  const session = await ChatSession.findOne({ _id: req.params.id, userId: req.userId });
  if (!session) {
    res.status(404).json({ message: 'Session not found' });
    return;
  }

  // Add the user's message to history
  session.messages.push({ role: 'user', content, timestamp: new Date() });

  // Get Claude's reply using the full conversation history
  const assistantContent = await getChatResponse(
    session.messages.slice(0, -1), // history before this message
    content
  );

  session.messages.push({ role: 'assistant', content: assistantContent, timestamp: new Date() });

  // Auto-generate a title from the first user message
  if (session.messages.length === 2 && session.title === 'New conversation') {
    session.title = await generateSessionTitle(content);
  }

  await session.save();

  res.json({ message: session.messages[session.messages.length - 1] });
}

export async function deleteSession(req: AuthRequest, res: Response): Promise<void> {
  const result = await ChatSession.deleteOne({ _id: req.params.id, userId: req.userId });
  if (result.deletedCount === 0) {
    res.status(404).json({ message: 'Session not found' });
    return;
  }
  res.json({ message: 'Session deleted' });
}
