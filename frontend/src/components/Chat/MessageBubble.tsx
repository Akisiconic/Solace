import type { Message } from '../../types';

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end px-4 py-2">
        <div className="max-w-[85%] lg:max-w-[70%] bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 px-4 py-2 max-w-[85%] lg:max-w-[70%]">
      <div className="w-7 h-7 rounded-full bg-sage-500 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
        S
      </div>
      <div className="text-sm leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap pt-0.5">
        {message.content}
      </div>
    </div>
  );
}
