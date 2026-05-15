import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { moodApi } from '../services/api';
import type { MoodLog } from '../types';
import MoodChart from '../components/Dashboard/MoodChart';
import StreakCard from '../components/Dashboard/StreakCard';
import WeeklySummary from '../components/Dashboard/WeeklySummary';
import ThemeToggle from '../components/Layout/ThemeToggle';
import Sidebar from '../components/Layout/Sidebar';

export default function DashboardPage() {
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    moodApi.getLogs(days)
      .then(setLogs)
      .finally(() => setLoading(false));
  }, [days]);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Mood Dashboard</h1>
          <div className="flex items-center gap-3">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-gray-700 dark:text-gray-300 outline-none"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <ThemeToggle />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-6 h-6 border-2 border-sage-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="p-6 space-y-6 max-w-3xl">
            {/* Streak + Weekly summary row */}
            <div className="grid grid-cols-2 gap-4">
              <StreakCard logs={logs} />
              <WeeklySummary logs={logs} />
            </div>

            {/* Mood chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Mood over time
              </h3>
              <MoodChart logs={logs} />
            </div>

            {/* Log list */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Recent check-ins
              </h3>
              {logs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400 mb-3">No check-ins yet.</p>
                  <Link
                    to="/"
                    className="text-sm text-sage-600 dark:text-sage-400 font-medium hover:underline"
                  >
                    Start a session →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {logs.slice(0, 10).map((log) => (
                    <div
                      key={log._id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900"
                    >
                      <span className="text-xl">
                        {['', '😔', '😕', '😐', '🙂', '😊'][log.score]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                          {log.note || ['', 'Really low', 'Not great', 'Okay', 'Pretty good', 'Great'][log.score]}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(log.createdAt).toLocaleDateString('en-US', {
                            weekday: 'short', month: 'short', day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
