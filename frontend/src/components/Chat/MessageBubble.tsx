import type { Message } from '../../types';

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%]">
          <div className="bg-sage-500 text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed">
            {message.content}
          </div>
          <p className="text-right text-xs text-gray-400 mt-1 pr-1">{time}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-3 max-w-[80%]">
      <div className="w-8 h-8 rounded-full bg-sage-100 dark:bg-sage-900 text-sage-700 dark:text-sage-300 flex items-center justify-center shrink-0 text-sm font-medium">
        S
      </div>
      <div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
          {message.content}
        </div>
        <p className="text-xs text-gray-400 mt-1 pl-1">{time}</p>
      </div>
    </div>
  );
}
