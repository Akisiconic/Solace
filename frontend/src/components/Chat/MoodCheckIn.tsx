import { useState } from 'react';
import { moodApi } from '../../services/api';

const MOODS: { score: 1 | 2 | 3 | 4 | 5; emoji: string; label: string }[] = [
  { score: 1, emoji: '😔', label: 'Really low' },
  { score: 2, emoji: '😕', label: 'Not great' },
  { score: 3, emoji: '😐', label: 'Okay' },
  { score: 4, emoji: '🙂', label: 'Pretty good' },
  { score: 5, emoji: '😊', label: 'Great' },
];

interface Props {
  onComplete: () => void;
}

export default function MoodCheckIn({ onComplete }: Props) {
  const [selected, setSelected] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!selected) return;
    setSubmitting(true);
    await moodApi.createLog(selected, note).catch(() => {});
    onComplete();
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
          How are you feeling?
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Take a moment to check in with yourself.
        </p>

        <div className="flex justify-between gap-2 mb-6">
          {MOODS.map(({ score, emoji, label }) => (
            <button
              key={score}
              onClick={() => setSelected(score)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                selected === score
                  ? 'border-sage-500 bg-sage-50 dark:bg-sage-900/30 scale-105'
                  : 'border-gray-200 dark:border-gray-700 hover:border-sage-300 dark:hover:border-sage-700'
              }`}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
            </button>
          ))}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Anything on your mind? (optional)"
          rows={3}
          className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder-gray-400 resize-none outline-none focus:border-sage-400 transition-colors"
        />

        <button
          onClick={handleSubmit}
          disabled={!selected || submitting}
          className="mt-4 w-full py-3 rounded-xl bg-sage-500 hover:bg-sage-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors"
        >
          {submitting ? 'Starting session…' : 'Start session'}
        </button>
      </div>
    </div>
  );
}
