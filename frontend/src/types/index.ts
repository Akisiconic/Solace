export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  _id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface MoodLog {
  _id: string;
  score: 1 | 2 | 3 | 4 | 5;
  note: string;
  tags: string[];
  createdAt: string;
}
