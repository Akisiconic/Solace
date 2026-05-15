import type { MoodLog } from '../../types';

interface Props {
  logs: MoodLog[];
}

function computeStreak(logs: MoodLog[]): number {
  if (logs.length === 0) return 0;

  const uniqueDays = [
    ...new Set(logs.map((l) => new Date(l.createdAt).toDateString())),
  ];

  // uniqueDays is already sorted newest-first (logs are sorted -createdAt from API)
  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]);
    const curr = new Date(uniqueDays[i]);
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  // If today has no entry, the streak is broken (check against today)
  const today = new Date().toDateString();
  if (uniqueDays[0] !== today) return 0;

  return streak;
}

export default function StreakCard({ logs }: Props) {
  const streak = computeStreak(logs);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
      <div className="text-4xl">🔥</div>
      <div>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{streak}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {streak === 1 ? 'day streak' : 'day streak'}
        </p>
        {streak === 0 && (
          <p className="text-xs text-gray-400 mt-0.5">Check in today to start one!</p>
        )}
      </div>
    </div>
  );
}
