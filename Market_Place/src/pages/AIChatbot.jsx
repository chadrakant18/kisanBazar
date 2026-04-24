import { useRef } from 'react';
import { useAIChat } from '../hooks/useAIChat';
import ChatHeader from '../components/chat/ChatHeader';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';

export default function AIChatbot() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    isListening,
    isSpeechEnabled,
    setIsSpeechEnabled,
    messagesEndRef,
    handleVoiceInput,
    sendMessage,
    speak,
    suggestions,
    sendSuggestion
  } = useAIChat();

  const inputRef = useRef(null);

  const handleSend = (e) => {
    sendMessage(e);
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col pt-4 animate-fade-in px-4 md:px-0">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden h-full">
        <ChatHeader 
          isSpeechEnabled={isSpeechEnabled} 
          setIsSpeechEnabled={setIsSpeechEnabled} 
        />
        
        <MessageList 
          messages={messages} 
          isLoading={isLoading} 
          onSpeak={speak} 
          messagesEndRef={messagesEndRef} 
        />

        {/* Suggestions chips */}
        {!isLoading && messages.length < 3 && (
          <div className="px-4 py-2 flex flex-wrap gap-2 animate-fade-in">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => sendSuggestion(suggestion)}
                className="px-4 py-2 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 hover:bg-green-100 transition-colors shadow-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <ChatInput 
          input={input}
          setInput={setInput}
          isListening={isListening}
          isLoading={isLoading}
          onVoiceInput={handleVoiceInput}
          onSend={handleSend}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
}
