import { Bot, User, Volume2 } from 'lucide-react';

export default function ChatMessage({ msg, onSpeak, i }) {
  const isAssistant = msg.role === 'assistant';

  return (
    <div
      className={`flex gap-4 animate-slide-up ${!isAssistant ? 'flex-row-reverse' : ''}`}
      style={{ animationDelay: `${i * 100}ms` }}
    >
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transform transition-transform hover:scale-110
        ${isAssistant
          ? 'bg-gradient-to-br from-green-600 to-green-800'
          : 'bg-gradient-to-br from-amber-500 to-orange-600'
        }`}
      >
        {isAssistant ? (
          <Bot size={20} className="text-white" />
        ) : (
          <User size={20} className="text-white" />
        )}
      </div>
      <div className={`max-w-[85%] px-6 py-4 rounded-2xl text-[15px] leading-relaxed shadow-sm border
        ${isAssistant
          ? 'bg-white border-gray-100 text-gray-800 rounded-tl-sm'
          : 'bg-green-700 text-white border-green-800 rounded-tr-sm shadow-green-900/10'
        }`}
      >
        <div className="whitespace-pre-wrap">{msg.content}</div>
        {isAssistant && (
          <div className="mt-2 flex justify-end">
            <button 
              onClick={() => onSpeak(msg.content)}
              className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
              title="Speak again"
            >
              <Volume2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
