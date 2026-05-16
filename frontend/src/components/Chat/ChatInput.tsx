import { useState } from 'react';
import type { KeyboardEvent } from 'react';

interface Props {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="p-3 lg:p-4 bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm px-4 py-3 focus-within:border-sage-400 focus-within:shadow-md transition-all">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Solace…"
            rows={1}
            disabled={disabled}
            className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 resize-none outline-none max-h-40 leading-relaxed"
            style={{ height: 'auto' }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = 'auto';
              el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
            }}
          />
          <button
            onClick={submit}
            disabled={!value.trim() || disabled}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-sage-500 hover:bg-sage-600 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white disabled:text-gray-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-2">
          Solace is an AI companion, not a licensed therapist.
        </p>
      </div>
    </div>
  );
}
