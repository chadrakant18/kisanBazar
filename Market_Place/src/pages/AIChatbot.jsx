import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Bot, Send, User, Sparkles, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

export default function AIChatbot() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: t('chatWelcome') || "Hello! I'm KisanMitra, your farming assistant powered by Python ML. How can I help?",
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Setup Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = (text) => {
    if (!isSpeechEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const reply = data.response;
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      speak(reply);
    } catch {
      const errorMsg = "An error occurred while connecting to the Python ML backend.";
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
      speak(errorMsg);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col pt-4 animate-fade-in px-4 md:px-0">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden h-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-600 p-5 flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
            <Bot size={28} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              {t('kisanMitra')}
              <Sparkles size={16} className="text-amber-300 animate-pulse" />
            </h3>
            <p className="text-green-100/80 text-xs font-medium tracking-wide">
              Intelligence System • Active
            </p>
          </div>
          <div className="flex items-center gap-2">
             <button 
              onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
              className={`p-2.5 rounded-xl transition-all duration-300 ${isSpeechEnabled ? 'bg-white/10 text-white' : 'bg-red-500/20 text-red-100 border border-red-500/30'}`}
              title={isSpeechEnabled ? "Disable Voice" : "Enable Voice"}
            >
              {isSpeechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <div className="hidden sm:flex items-center gap-1.5 bg-black/10 border border-white/20 text-white text-[10px] px-3 py-1.5 rounded-full uppercase font-bold tracking-tighter">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Realtime ML
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-gray-50/30 custom-scrollbar">
          {messages.map((msg, i) => (
            <div
              key={i}
               className={`flex gap-4 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
               style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transform transition-transform hover:scale-110
                ${msg.role === 'assistant'
                  ? 'bg-gradient-to-br from-green-600 to-green-800'
                  : 'bg-gradient-to-br from-amber-500 to-orange-600'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <Bot size={20} className="text-white" />
                ) : (
                  <User size={20} className="text-white" />
                )}
              </div>
              <div className={`max-w-[85%] px-6 py-4 rounded-2xl text-[15px] leading-relaxed shadow-sm border
                ${msg.role === 'assistant'
                  ? 'bg-white border-gray-100 text-gray-800 rounded-tl-sm'
                  : 'bg-green-700 text-white border-green-800 rounded-tr-sm shadow-green-900/10'
                }`}
              >
                {msg.content}
                {msg.role === 'assistant' && (
                  <div className="mt-2 flex justify-end">
                    <button 
                      onClick={() => speak(msg.content)}
                      className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                      title="Speak again"
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
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

        {/* Input Form */}
        <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
          <form onSubmit={sendMessage} className="relative flex items-center gap-4">
            <button
              type="button"
              onClick={handleVoiceInput}
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
                  font-medium placeholder:text-gray-400"
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
      </div>
    </div>
  );
}
