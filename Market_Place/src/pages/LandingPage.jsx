import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { Leaf, ArrowRight, ShieldCheck, Zap, HeartHandshake, Sparkles, Bot } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#fcfdfb] overflow-hidden selection:bg-green-100 selection:text-green-900">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-green-200/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/20 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-800 flex items-center justify-center shadow-xl shadow-green-200/50 group-hover:rotate-12 transition-transform duration-500">
              <Leaf className="text-white" size={26} />
            </div>
            <div>
               <h1 className="text-2xl font-black text-gray-900 tracking-tighter italic">Kisan<span className="text-green-600">Bazaar</span></h1>
               <div className="h-1 w-0 bg-green-500 group-hover:w-full transition-all duration-500 rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <LanguageToggle />
            <button 
              onClick={() => navigate('/login/farmer')}
              className="text-sm font-black text-gray-400 hover:text-green-700 transition-colors uppercase tracking-widest"
            >
              {t('login')}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-full animate-fade-in">
              <Sparkles className="text-green-600" size={16} />
              <span className="text-[11px] font-black text-green-700 uppercase tracking-[0.2em]">{t('heroTaglineKn') || "India's #1 Agri-Marketplace"}</span>
            </div>
            
            <h2 className="text-7xl md:text-8xl font-black text-gray-900 tracking-tight leading-[0.9] animate-slide-up">
              Farm Fresh,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 italic">Direct to You.</span>
            </h2>
            
            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {t('heroSubtitle')} Empowering Bharat's farmers with AI-driven insights and direct buyer connections.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={() => navigate('/login/farmer')}
                className="group px-10 py-6 bg-gray-900 text-white rounded-3xl font-black text-lg tracking-wide hover:bg-black transition-all shadow-2xl shadow-gray-200 flex items-center justify-center gap-4"
              >
                {t('imFarmer')}
                <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
              </button>
              <button
                onClick={() => navigate('/login/buyer')}
                className="px-10 py-6 bg-white text-gray-900 border-2 border-gray-100 rounded-3xl font-black text-lg tracking-wide hover:border-green-600 hover:text-green-700 transition-all shadow-xl shadow-gray-100 flex items-center justify-center"
              >
                {t('imBuyer')}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-10 pt-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
               <div className="flex flex-col gap-1">
                  <span className="text-2xl font-black text-gray-900">50K+</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Active Farmers</span>
               </div>
               <div className="h-10 w-px bg-gray-300"></div>
               <div className="flex flex-col gap-1">
                  <span className="text-2xl font-black text-gray-900">₹10Cr+</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Trade Volume</span>
               </div>
               <div className="h-10 w-px bg-gray-300"></div>
               <div className="flex flex-col gap-1">
                  <span className="text-2xl font-black text-gray-900">4.9/5</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">User Rating</span>
               </div>
            </div>
          </div>

          {/* Interactive Feature Cards */}
          <div className="grid grid-cols-2 gap-6 relative">
             {/* Abstract Visual Decor */}
             <div className="absolute inset-0 bg-green-600/5 blur-3xl rounded-full scale-125 -z-10 animate-pulse"></div>

             <div className="space-y-6 pt-12">
                <FeatureCard 
                  icon={<ShieldCheck className="text-green-600" />} 
                  title={t('featVerification') || "AI Verification"} 
                  desc={t('featVerificationDesc') || "Machine learning ensures crop quality and authenticity."} 
                  color="bg-green-50"
                />
                <FeatureCard 
                  icon={<Bot className="text-blue-600" />} 
                  title={t('featAssistant') || "KisanMitra AI"} 
                  desc={t('featAssistantDesc') || "Multilingual farming expert in your pocket."} 
                  color="bg-blue-50"
                  delay="200ms"
                />
             </div>
             <div className="space-y-6">
                <FeatureCard 
                  icon={<Zap className="text-amber-600" />} 
                  title={t('featCropListing') || "Instant Listing"} 
                  desc={t('featCropListingDesc') || "Post your harvest in seconds with smart forms."} 
                  color="bg-amber-50"
                  delay="100ms"
                />
                <FeatureCard 
                  icon={<HeartHandshake className="text-rose-600" />} 
                  title={t('featContact') || "Direct Connect"} 
                  desc={t('featContactDesc') || "Chat directly with verified buyers via WhatsApp."} 
                  color="bg-rose-50"
                  delay="300ms"
                />
             </div>
          </div>
        </div>
      </main>

      {/* Footer Mini */}
      <footer className="relative z-10 py-10 border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 text-[10px] font-black uppercase tracking-[0.3em]">
            <span>© 2026 KisanBazaar Global Technologies</span>
            <div className="flex gap-10">
               <a href="#" className="hover:text-green-700">Privacy</a>
               <a href="#" className="hover:text-green-700">Terms</a>
               <a href="#" className="hover:text-green-700">Contact</a>
            </div>
         </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color, delay = '0ms' }) {
  return (
    <div 
      className="p-8 bg-white rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-50 flex flex-col gap-5 hover:scale-105 transition-all duration-500 cursor-default animate-slide-up"
      style={{ animationDelay: delay }}
    >
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-inner`}>
        {icon}
      </div>
      <div>
        <h4 className="text-xl font-black text-gray-900 tracking-tight mb-2">{title}</h4>
        <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
