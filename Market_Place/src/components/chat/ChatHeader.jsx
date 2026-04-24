import { Bot, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ChatHeader({ isSpeechEnabled, setIsSpeechEnabled }) {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-600 p-5 flex items-center gap-4 shadow-lg shrink-0">
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
  );
}
