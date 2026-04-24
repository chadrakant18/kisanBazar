import ChatMessage from './ChatMessage';
import { Bot } from 'lucide-react';

export default function MessageList({ messages, isLoading, onSpeak, messagesEndRef }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-gray-50/30 custom-scrollbar">
      {messages.map((msg, i) => (
        <ChatMessage key={i} msg={msg} onSpeak={onSpeak} i={i} />
      ))}
      
      {isLoading && (
        <div className="flex gap-4 animate-fade-in">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-lg">
            <Bot size={20} className="text-white" />
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm h-14 flex items-center">
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '200ms' }} />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '400ms' }} />
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
