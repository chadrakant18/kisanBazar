import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { Sprout, TrendingUp, Leaf } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50/30 flex flex-col">
      {/* Navbar Minimal */}
      <nav className="w-full z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-lg">
              <Leaf className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-green-900 leading-none">KisanBazaar</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center animate-slide-up">
          Welcome to KisanBazaar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl animate-slide-up stagger-2" style={{ opacity: 1 }}>
          
          {/* Farmer Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-100 flex flex-col items-center text-center transform hover:-translate-y-1 transition-all">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6 text-green-600">
              <Sprout size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('imFarmer') || 'I am a Farmer'}</h3>
            <p className="text-gray-500 mb-8">Sell your fresh produce directly to bulk buyers.</p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => navigate('/login/farmer')}
                className="flex-1 py-3 px-4 bg-green-50 text-green-700 rounded-xl font-semibold hover:bg-green-100 transition-colors"
              >
                {t('login')}
              </button>
              <button
                onClick={() => navigate('/register/farmer')}
                className="flex-1 py-3 px-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 shadow-lg shadow-green-600/30 transition-all"
              >
                {t('register')}
              </button>
            </div>
          </div>

          {/* Buyer Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-amber-100 flex flex-col items-center text-center transform hover:-translate-y-1 transition-all">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6 text-amber-600">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('imBuyer') || 'I am a Buyer'}</h3>
            <p className="text-gray-500 mb-8">Source fresh produce directly from farmers.</p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => navigate('/login/buyer')}
                className="flex-1 py-3 px-4 bg-amber-50 text-amber-700 rounded-xl font-semibold hover:bg-amber-100 transition-colors"
              >
                {t('login')}
              </button>
              <button
                onClick={() => navigate('/register/buyer')}
                className="flex-1 py-3 px-4 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 shadow-lg shadow-amber-500/30 transition-all"
              >
                {t('register')}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
