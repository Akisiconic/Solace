import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chatApi } from '../services/api';
import type { ChatSession } from '../types';
import Sidebar from '../components/Layout/Sidebar';
import ChatWindow from '../components/Chat/ChatWindow';
import ThemeToggle from '../components/Layout/ThemeToggle';

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    chatApi
      .getSession(id)
      .then(setSession)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-3 right-4 z-10">
          <ThemeToggle />
        </div>

        {!id && (
          <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
            Select a conversation or start a new one.
          </div>
        )}

        {id && loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-sage-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {id && !loading && session && (
          <ChatWindow session={session} onSessionUpdate={setSession} />
        )}
      </main>
    </div>
  );
}
