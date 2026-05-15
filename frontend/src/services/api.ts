import type { ChatSession, MoodLog, User } from '../types';

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include', // always send the httpOnly cookie
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }

  return res.json();
}

// Auth
export const authApi = {
  register: (name: string, email: string, password: string) =>
    request<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  login: (email: string, password: string) =>
    request<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
  me: () => request<User>('/auth/me'),
};

// Chat
export const chatApi = {
  getSessions: () => request<ChatSession[]>('/chat'),
  getSession: (id: string) => request<ChatSession>(`/chat/${id}`),
  createSession: () => request<ChatSession>('/chat', { method: 'POST' }),
  sendMessage: (sessionId: string, content: string) =>
    request<{ message: { role: string; content: string; timestamp: string } }>(
      `/chat/${sessionId}/messages`,
      { method: 'POST', body: JSON.stringify({ content }) }
    ),
  deleteSession: (id: string) => request<void>(`/chat/${id}`, { method: 'DELETE' }),
};

// Mood
export const moodApi = {
  getLogs: (days = 30) => request<MoodLog[]>(`/mood?days=${days}`),
  createLog: (score: number, note?: string, tags?: string[]) =>
    request<MoodLog>('/mood', { method: 'POST', body: JSON.stringify({ score, note, tags }) }),
  deleteLog: (id: string) => request<void>(`/mood/${id}`, { method: 'DELETE' }),
};
