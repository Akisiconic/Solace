import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { MoodLog } from '../../types';

const EMOJI: Record<number, string> = { 1: '😔', 2: '😕', 3: '😐', 4: '🙂', 5: '😊' };

interface Props {
  logs: MoodLog[];
}

export default function MoodChart({ logs }: Props) {
  const data = [...logs]
    .reverse()
    .map((l) => ({
      date: new Date(l.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: l.score,
      emoji: EMOJI[l.score],
    }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
        No mood data yet. Start a session to log your first check-in.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[1, 5]}
          ticks={[1, 2, 3, 4, 5]}
          tickFormatter={(v) => EMOJI[v]}
          tick={{ fontSize: 14 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 shadow-sm text-sm">
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {d.emoji} {['', 'Really low', 'Not great', 'Okay', 'Pretty good', 'Great'][d.score]}
                </p>
                <p className="text-gray-400 text-xs">{d.date}</p>
              </div>
            );
          }}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#4d7c4d"
          strokeWidth={2.5}
          dot={{ fill: '#4d7c4d', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
