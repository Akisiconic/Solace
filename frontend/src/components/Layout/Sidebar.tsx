import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { chatApi } from '../../services/api';
import type { ChatSession } from '../../types';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    chatApi.getSessions().then(setSessions).catch(() => {});
  }, [id]); // re-fetch when active session changes (new session created)

  async function handleNewChat() {
    const session = await chatApi.createSession();
    navigate(`/chat/${session._id}`);
  }

  async function handleLogout() {
    await logout();
    navigate('/auth');
  }

  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Logo */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-800">
        <span className="text-xl font-semibold text-sage-600 dark:text-sage-400 tracking-tight">
          Solace
        </span>
      </div>

      {/* New chat */}
      <div className="p-3">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New conversation
        </button>
      </div>

      {/* Session list */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
        {sessions.map((s) => (
          <Link
            key={s._id}
            to={`/chat/${s._id}`}
            className={`block px-3 py-2 rounded-lg text-sm truncate transition-colors ${
              id === s._id
                ? 'bg-sage-100 dark:bg-sage-900 text-sage-800 dark:text-sage-200 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {s.title}
          </Link>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Mood Dashboard
        </Link>

        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-xs text-gray-500 dark:text-gray-500 truncate">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
