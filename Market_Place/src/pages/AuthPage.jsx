import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageToggle from '../components/LanguageToggle';
import { Leaf, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function AuthPage({ mode }) {
  const { role } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login, register: registerUser } = useAuth();
  const isLogin = mode === 'login';
  const isFarmer = role === 'farmer';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: '',
    farmSize: '',
    primaryCrops: '',
    businessName: '',
    produceType: '',
    orderVolume: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const userData = {
      name: formData.name || (isFarmer ? 'Ramesh Kumar' : 'Karnataka Traders'),
      phone: formData.phone || '9876543210',
      location: formData.location || 'Ramanagara',
      role: role,
      ...(isFarmer ? {
        farmSize: formData.farmSize || '5',
        primaryCrops: formData.primaryCrops || 'Tomato, Ragi',
      } : {
        businessName: formData.businessName || 'Karnataka Traders',
        produceType: formData.produceType || 'Vegetables',
        orderVolume: formData.orderVolume || '500 kg/week',
      }),
    };

    if (isLogin) {
      login(userData);
    } else {
      registerUser(userData);
    }

    navigate(isFarmer ? '/farmer/dashboard' : '/buyer/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8 relative overflow-hidden selection:bg-green-100 selection:text-green-900">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-green-200/30 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/30 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Language toggle */}
      <div className="fixed top-8 right-8 z-50">
        <LanguageToggle />
      </div>

      <div className="w-full max-w-lg relative z-10 mt-10 mb-10">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-gray-500 hover:text-green-600 mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-bold tracking-widest uppercase">Back to Home</span>
        </button>

        {/* Card */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-700 p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-xl rounded-full -mr-10 -mt-10"></div>
            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/20">
              <Leaf className="text-white" size={40} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              {isLogin ? (isFarmer ? t('farmerLogin') : t('buyerLogin')) : (isFarmer ? t('farmerRegister') : t('buyerRegister'))}
            </h1>
            <p className="text-green-100 text-sm font-bold uppercase tracking-[0.2em] mt-3">KisanBazaar Premium</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-5 rounded-2xl border border-red-100 flex items-center gap-3 font-medium">
                <span className="block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                {error}
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-3">{t('name')}</label>
                <input
                  id="input-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={isFarmer ? 'Ramesh Kumar' : 'Karnataka Traders'}
                  className="w-full px-6 py-5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/20
                    focus:border-green-500 outline-none transition-all bg-gray-50/50 text-gray-900 placeholder:text-gray-400 font-medium text-lg"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-3">{t('phone')}</label>
              <input
                id="input-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full px-6 py-5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/20
                  focus:border-green-500 outline-none transition-all bg-gray-50/50 text-gray-900 placeholder:text-gray-400 font-medium text-lg"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-3">{t('location')}</label>
                <input
                  id="input-location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ramanagara, Karnataka"
                  className="w-full px-6 py-5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/20
                    focus:border-green-500 outline-none transition-all bg-gray-50/50 text-gray-900 placeholder:text-gray-400 font-medium text-lg"
                />
              </div>
            )}

            <div className="relative">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-3">{t('password')}</label>
              <input
                id="input-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-6 py-5 pr-14 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/20
                  focus:border-green-500 outline-none transition-all bg-gray-50/50 text-gray-900 placeholder:text-gray-400 font-medium text-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-[52px] text-gray-400 hover:text-green-600 cursor-pointer transition-colors"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-3">{t('confirmPassword')}</label>
                  <input
                    id="input-confirm-password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-6 py-5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/20
                      focus:border-green-500 outline-none transition-all bg-gray-50/50 text-gray-900 placeholder:text-gray-400 font-medium text-lg"
                  />
                </div>

                {/* Role-specific fields */}
                {isFarmer ? (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-3">{t('farmSize')}</label>
                      <input
                        id="input-farm-size"
                        type="text"
                        name="farmSize"
                        value={formData.farmSize}
                        onChange={handleChange}
                        placeholder="5"
                        className="w-full px-6 py-5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/20
                          focus:border-green-500 outline-none transition-all bg-gray-50/50 text-gray-900 placeholder:text-gray-400 font-medium text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-3">{t('primaryCrops')}</label>
                      <input
                        id="input-primary-crops"
                        type="text"
                        name="primaryCrops"
                        value={formData.primaryCrops}
                        onChange={handleChange}
                        placeholder="Tomato, Ragi, Onion"
                        className="w-full px-6 py-5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/20
                          focus:border-green-500 outline-none transition-all bg-gray-50/50 text-gray-900 placeholder:text-gray-400 font-medium text-lg"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-3">{t('businessName')}</label>
                      <input
                        id="input-business-name"
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="Karnataka Fresh Traders"
                        className="w-full px-6 py-5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/20
                          focus:border-green-500 outline-none transition-all bg-gray-50/50 text-gray-900 placeholder:text-gray-400 font-medium text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-3">{t('produceType')}</label>
                      <input
                        id="input-produce-type"
                        type="text"
                        name="produceType"
                        value={formData.produceType}
                        onChange={handleChange}
                        placeholder="Vegetables, Fruits"
                        className="w-full px-6 py-5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/20
                          focus:border-green-500 outline-none transition-all bg-gray-50/50 text-gray-900 placeholder:text-gray-400 font-medium text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-3">{t('orderVolume')}</label>
                      <input
                        id="input-order-volume"
                        type="text"
                        name="orderVolume"
                        value={formData.orderVolume}
                        onChange={handleChange}
                        placeholder="500 kg/week"
                        className="w-full px-6 py-5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/20
                          focus:border-green-500 outline-none transition-all bg-gray-50/50 text-gray-900 placeholder:text-gray-400 font-medium text-lg"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <button
              id="btn-submit-auth"
              type="submit"
              className="w-full mt-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl
                font-black tracking-widest uppercase text-base shadow-xl shadow-green-600/30 hover:shadow-2xl hover:shadow-green-600/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {isLogin ? t('login') : t('register')}
            </button>

            <p className="text-center text-base text-gray-500 mt-8 font-medium">
              {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}{' '}
              <Link
                to={isLogin ? `/register/${role}` : `/login/${role}`}
                className="text-green-600 font-black hover:text-green-700 hover:underline decoration-2 underline-offset-4"
              >
                {isLogin ? t('registerHere') : t('loginHere')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
