import type { MoodLog } from '../../types';

interface Props {
  logs: MoodLog[];
}

const LABELS = ['', 'Really low', 'Not great', 'Okay', 'Pretty good', 'Great'];
const EMOJI: Record<number, string> = { 1: '😔', 2: '😕', 3: '😐', 4: '🙂', 5: '😊' };

export default function WeeklySummary({ logs }: Props) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const thisWeek = logs.filter((l) => new Date(l.createdAt) >= weekAgo);

  if (thisWeek.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">This week</h3>
        <p className="text-sm text-gray-400">No check-ins this week yet.</p>
      </div>
    );
  }

  const avg = thisWeek.reduce((sum, l) => sum + l.score, 0) / thisWeek.length;
  const roundedAvg = Math.round(avg) as 1 | 2 | 3 | 4 | 5;
  const highest = Math.max(...thisWeek.map((l) => l.score));
  const lowest = Math.min(...thisWeek.map((l) => l.score));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">This week</h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl">{EMOJI[roundedAvg]}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Avg mood</p>
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{LABELS[roundedAvg]}</p>
        </div>
        <div>
          <p className="text-2xl">{EMOJI[highest]}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Best day</p>
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{LABELS[highest]}</p>
        </div>
        <div>
          <p className="text-2xl">{EMOJI[lowest]}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hardest day</p>
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{LABELS[lowest]}</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">{thisWeek.length} check-in{thisWeek.length !== 1 ? 's' : ''} this week</p>
    </div>
  );
}
