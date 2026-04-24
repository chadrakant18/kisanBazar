import { Mic, MicOff, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ChatInput({ 
  input, 
  setInput, 
  isListening, 
  isLoading, 
  onVoiceInput, 
  onSend,
  inputRef 
}) {
  const { t } = useLanguage();

  return (
    <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.02)] shrink-0">
      <form onSubmit={onSend} className="relative flex items-center gap-4">
        <button
          type="button"
          onClick={onVoiceInput}
          className={`p-4 rounded-2xl transition-all duration-300 flex-shrink-0 shadow-lg
            ${isListening 
              ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-100' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:scale-105 active:scale-95'}`}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        <div className="relative flex-1 group">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : t('typeMessage')}
            disabled={isLoading}
            className="w-full pl-6 pr-16 py-5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/10
              focus:border-green-500 outline-none bg-gray-50/50 focus:bg-white transition-all text-base
              font-medium placeholder:text-gray-400 shadow-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 top-2 p-3 rounded-xl transition-all duration-300
              ${input.trim() && !isLoading
                ? 'bg-green-700 text-white shadow-lg shadow-green-700/30 hover:scale-105 active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            <Send size={24} />
          </button>
        </div>
      </form>
      <p className="text-[10px] text-center mt-4 text-gray-400 font-medium uppercase tracking-[0.2em]">
        Powered by KisanMarket Machine Learning Division
      </p>
    </div>
  );
}
