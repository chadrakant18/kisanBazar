import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { Leaf, ArrowRight, ShieldCheck, Zap, HeartHandshake, Sparkles, Bot } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col selection:bg-green-100 selection:text-green-900 w-full">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-green-200/30 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/30 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 px-6 lg:px-16 py-8 w-full shrink-0">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-xl shadow-green-200/50 group-hover:rotate-12 transition-transform duration-500">
              <Leaf className="text-white" size={28} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic">Kisan<span className="text-green-600">Bazaar</span></h1>
               <div className="h-1 w-0 bg-green-500 group-hover:w-full transition-all duration-500 rounded-full mt-1"></div>
            </div>
          </div>
          <div className="flex items-center gap-10">
            <LanguageToggle />
            <button 
              onClick={() => navigate('/login/farmer')}
              className="text-sm font-black text-gray-600 hover:text-green-700 transition-colors uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-green-100/50"
            >
              {t('login')}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 w-full px-6 lg:px-24 py-12 flex-1 flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          <div className="space-y-12">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-green-100/50 border border-green-200/50 rounded-full animate-fade-in shadow-sm">
              <Sparkles className="text-green-600" size={18} />
              <span className="text-xs font-black text-green-700 uppercase tracking-[0.2em]">{t('heroTaglineKn') || "India's #1 Agri-Marketplace"}</span>
            </div>
            
            <h2 className="text-6xl lg:text-[5.5rem] font-black text-gray-900 tracking-tight leading-[1.05] animate-slide-up">
              Farm Fresh,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 italic">Direct to You.</span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-gray-600 font-medium leading-relaxed max-w-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {t('heroSubtitle')} Empowering Bharat's farmers with AI-driven insights and direct buyer connections.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-8 animate-slide-up w-full max-w-2xl" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={() => navigate('/login/farmer')}
                className="group flex-1 py-6 px-6 bg-gray-900 text-white rounded-3xl font-black text-xl tracking-wide hover:bg-black transition-all shadow-2xl shadow-gray-300 flex items-center justify-center gap-3 hover:-translate-y-1"
              >
                {t('imFarmer')}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
              </button>
              <button
                onClick={() => navigate('/login/buyer')}
                className="flex-1 py-6 px-6 bg-white text-gray-900 border-2 border-gray-200 rounded-3xl font-black text-xl tracking-wide hover:border-green-600 hover:text-green-700 transition-all shadow-xl shadow-gray-200 flex items-center justify-center hover:-translate-y-1"
              >
                {t('imBuyer')}
              </button>
            </div>
          </div>

          {/* Interactive Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10 relative">
             <FeatureCard 
               icon={<ShieldCheck className="text-green-600" size={32} />} 
               title={t('featVerification') || "AI Verification"} 
               desc={t('featVerificationDesc') || "Machine learning ensures crop quality and authenticity."} 
               color="bg-green-100/50"
               borderColor="border-green-200"
             />
             <FeatureCard 
               icon={<Zap className="text-amber-600" size={32} />} 
               title={t('featCropListing') || "Instant Listing"} 
               desc={t('featCropListingDesc') || "Post your harvest in seconds with smart forms."} 
               color="bg-amber-100/50"
               borderColor="border-amber-200"
               delay="100ms"
             />
             <FeatureCard 
               icon={<Bot className="text-blue-600" size={32} />} 
               title={t('featAssistant') || "KisanMitra AI"} 
               desc={t('featAssistantDesc') || "Multilingual farming expert in your pocket."} 
               color="bg-blue-100/50"
               borderColor="border-blue-200"
               delay="200ms"
             />
             <FeatureCard 
               icon={<HeartHandshake className="text-rose-600" size={32} />} 
               title={t('featContact') || "Direct Connect"} 
               desc={t('featContactDesc') || "Chat directly with verified buyers via WhatsApp."} 
               color="bg-rose-100/50"
               borderColor="border-rose-200"
               delay="300ms"
             />
          </div>
        </div>
      </main>

      {/* Footer Mini */}
      <footer className="relative z-10 py-10 w-full border-t border-gray-200 bg-white/50 backdrop-blur-md shrink-0">
         <div className="w-full px-6 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-8 text-xs font-black uppercase tracking-[0.3em] text-gray-500">
            <span>© 2026 KisanBazaar Global Technologies</span>
            <div className="flex gap-12">
               <a href="#" className="hover:text-green-700 transition-colors">Privacy</a>
               <a href="#" className="hover:text-green-700 transition-colors">Terms</a>
               <a href="#" className="hover:text-green-700 transition-colors">Contact</a>
            </div>
         </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color, borderColor, delay = '0ms' }) {
  return (
    <div 
      className={`p-8 lg:p-10 bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border ${borderColor} flex flex-col gap-6 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-500 cursor-default animate-slide-up h-full`}
      style={{ animationDelay: delay }}
    >
      <div className={`w-16 h-16 lg:w-20 lg:h-20 ${color} rounded-3xl flex items-center justify-center shadow-inner shrink-0`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight mb-3">{title}</h4>
        <p className="text-base lg:text-lg text-gray-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
