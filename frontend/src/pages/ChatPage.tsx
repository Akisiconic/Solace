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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-base font-semibold text-sage-600 dark:text-sage-400">Solace</span>
          <ThemeToggle />
        </div>

        {/* Desktop theme toggle */}
        <div className="absolute top-3 right-4 z-10 hidden lg:block">
          <ThemeToggle />
        </div>

        {!id && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400 dark:text-gray-600 text-sm px-4 text-center">
            <p>Select a conversation or start a new one.</p>
            <button
              onClick={async () => {
                const session = await chatApi.createSession();
                navigate(`/chat/${session._id}`);
              }}
              className="lg:hidden flex items-center gap-2 px-5 py-3 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium transition-colors shadow-lg shadow-sage-300/40"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New conversation
            </button>
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
