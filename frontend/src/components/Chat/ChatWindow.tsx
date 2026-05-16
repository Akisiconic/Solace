import { useEffect, useRef, useState } from 'react';
import type { ChatSession, Message } from '../../types';
import { chatApi } from '../../services/api';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import MoodCheckIn from './MoodCheckIn';
import TypingIndicator from './TypingIndicator';

interface Props {
  session: ChatSession;
  onSessionUpdate: (session: ChatSession) => void;
}

export default function ChatWindow({ session, onSessionUpdate }: Props) {
  const [messages, setMessages] = useState<Message[]>(session.messages);
  const [typing, setTyping] = useState(false);
  const [checkedIn, setCheckedIn] = useState(session.messages.length > 0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(session.messages);
    setCheckedIn(session.messages.length > 0);
  }, [session._id, session.messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  async function handleSend(content: string) {
    const optimistic: Message = { role: 'user', content, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, optimistic]);
    setTyping(true);

    try {
      const { message } = await chatApi.sendMessage(session._id, content);
      const assistant: Message = { ...message, role: 'assistant' as const };
      setMessages((prev) => [...prev, assistant]);
      const updated = await chatApi.getSession(session._id);
      onSessionUpdate(updated);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please try again.', timestamp: new Date().toISOString() },
      ]);
    } finally {
      setTyping(false);
    }
  }

  if (!checkedIn) {
    return <MoodCheckIn onComplete={() => setCheckedIn(true)} />;
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 bg-white dark:bg-gray-900 chat-scroll">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-40">
              <p className="text-sm text-gray-400 dark:text-gray-600">
                Say hello — Solace is here to listen.
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <MessageBubble key={i} message={m} />
          ))}
          {typing && (
            <div className="px-4 py-2">
              <TypingIndicator />
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <ChatInput onSend={handleSend} disabled={typing} />
    </div>
  );
}
