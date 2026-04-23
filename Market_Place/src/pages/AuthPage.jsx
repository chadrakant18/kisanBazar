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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50/30 flex items-center justify-center p-4">
      {/* Language toggle */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-green-700 hover:text-green-900 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 to-green-600 p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-3">
              <Leaf className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white">
              {isLogin ? (isFarmer ? t('farmerLogin') : t('buyerLogin')) : (isFarmer ? t('farmerRegister') : t('buyerRegister'))}
            </h1>
            <p className="text-green-200 text-sm mt-1">KisanBazaar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('name')}</label>
                <input
                  id="input-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={isFarmer ? 'Ramesh Kumar' : 'Karnataka Traders'}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                    focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('phone')}</label>
              <input
                id="input-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                  focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('location')}</label>
                <input
                  id="input-location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ramanagara, Karnataka"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                    focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                />
              </div>
            )}

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('password')}</label>
              <input
                id="input-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                  focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('confirmPassword')}</label>
                  <input
                    id="input-confirm-password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                      focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>

                {/* Role-specific fields */}
                {isFarmer ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('farmSize')}</label>
                      <input
                        id="input-farm-size"
                        type="text"
                        name="farmSize"
                        value={formData.farmSize}
                        onChange={handleChange}
                        placeholder="5"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                          focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('primaryCrops')}</label>
                      <input
                        id="input-primary-crops"
                        type="text"
                        name="primaryCrops"
                        value={formData.primaryCrops}
                        onChange={handleChange}
                        placeholder="Tomato, Ragi, Onion"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                          focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('businessName')}</label>
                      <input
                        id="input-business-name"
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="Karnataka Fresh Traders"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                          focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('produceType')}</label>
                      <input
                        id="input-produce-type"
                        type="text"
                        name="produceType"
                        value={formData.produceType}
                        onChange={handleChange}
                        placeholder="Vegetables, Fruits"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                          focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('orderVolume')}</label>
                      <input
                        id="input-order-volume"
                        type="text"
                        name="orderVolume"
                        value={formData.orderVolume}
                        onChange={handleChange}
                        placeholder="500 kg/week"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500
                          focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <button
              id="btn-submit-auth"
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-green-700 to-green-600 text-white rounded-xl
                font-semibold text-base shadow-lg shadow-green-600/20 hover:shadow-xl hover:from-green-800
                hover:to-green-700 transition-all duration-300 mt-2 cursor-pointer"
            >
              {isLogin ? t('login') : t('register')}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}{' '}
              <Link
                to={isLogin ? `/register/${role}` : `/login/${role}`}
                className="text-green-600 font-medium hover:text-green-700"
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
