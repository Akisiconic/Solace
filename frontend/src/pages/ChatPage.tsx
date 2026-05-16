import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chatApi } from '../services/api';
import type { ChatSession } from '../types';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Layout/Sidebar';
import ChatWindow from '../components/Chat/ChatWindow';
import ThemeToggle from '../components/Layout/ThemeToggle';

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
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

  async function handleNewChat() {
    const session = await chatApi.createSession();
    navigate(`/chat/${session._id}`);
  }

  async function handleLogout() {
    await logout();
    navigate('/auth');
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <span className="text-base font-semibold text-sage-600 dark:text-sage-400">Solace</span>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={handleNewChat}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="New chat"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
              title="Sign out"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop theme toggle */}
        <div className="absolute top-3 right-4 z-10 hidden lg:block">
          <ThemeToggle />
        </div>

        {!id && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400 dark:text-gray-600 text-sm px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-sage-500 flex items-center justify-center mb-2">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">How can Solace help you today?</p>
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium transition-colors shadow-md shadow-sage-300/30"
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
