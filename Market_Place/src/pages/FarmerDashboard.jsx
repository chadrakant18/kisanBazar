import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingContext';
import LanguageToggle from '../components/LanguageToggle';
import CropCard from '../components/CropCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import AddListingPage from './AddListingPage';
import AIChatbot from './AIChatbot';
import {
  Leaf, LayoutDashboard, Bot, User, LogOut, Sparkles, TrendingUp,
  Package, BadgeCheck, Clock, Eye, Plus, Menu, X, ChevronRight, CloudRain
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { listings, getMyListings, deleteListing } = useListings();
  const [activeTab, setActiveTab] = useState('listings');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'farmer') {
      navigate('/login/farmer');
      return;
    }
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  const myListings = getMyListings(user?.name);
  const verifiedCount = myListings.filter(l => l.verified).length;
  const pendingCount = myListings.filter(l => !l.verified).length;
  const totalViews = myListings.reduce((sum, l) => sum + (l.views || 0), 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { id: 'listings', icon: LayoutDashboard, label: t('myListings') },
    { id: 'add', icon: Plus, label: t('addNewCrop') },
    { id: 'assistant', icon: Bot, label: t('aiAssistant') },
    { id: 'profile', icon: User, label: t('profile') },
  ];

  const stats = [
    { icon: Package, label: t('totalListings'), value: myListings.length, color: 'from-green-500 to-green-600', bg: 'bg-green-50' },
    { icon: BadgeCheck, label: t('verifiedListings'), value: verifiedCount, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
    { icon: Clock, label: t('pendingVerification'), value: pendingCount, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
    { icon: Eye, label: t('totalViews'), value: totalViews, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow">
                <Leaf className="text-white" size={22} />
              </div>
              <div>
                <h1 className="font-bold text-green-900 text-lg leading-none">KisanBazaar</h1>
                <p className="text-[10px] text-green-600 font-medium">{t('farmerDashboard')}</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 cursor-pointer">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-100">
          <div className="bg-green-50 rounded-xl p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0) || 'F'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200 cursor-pointer group
                ${activeTab === item.id
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                  : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                }`}
            >
              <item.icon size={20} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'assistant' && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold
                  ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}>
                  AI
                </span>
              )}
              <ChevronRight size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity
                ${activeTab === item.id ? 'opacity-100' : ''}`} />
            </button>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-gray-100 space-y-2">
          <LanguageToggle className="w-full justify-center" />
          <button
            id="btn-logout"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50
              rounded-xl text-sm font-medium transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-3 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              <Menu size={22} />
            </button>
            <div className="hidden sm:block">
               <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {activeTab === 'listings' && t('myListings')}
                {activeTab === 'add' && t('addNewCrop')}
                {activeTab === 'assistant' && t('aiAssistant')}
                {activeTab === 'profile' && t('profile')}
              </h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Dashboard / {activeTab}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 hidden md:flex items-center gap-2">
               <Sparkles size={16} className="text-orange-500" />
               <span className="text-[11px] font-black text-orange-700 uppercase tracking-widest">Premium Member</span>
            </div>
            {activeTab === 'listings' && (
              <button
                id="btn-add-listing-top"
                onClick={() => setActiveTab('add')}
                className="flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-2xl text-sm font-black tracking-widest shadow-2xl shadow-gray-200 hover:bg-black hover:scale-105 active:scale-95 transition-all"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">{t('addNewCrop')}</span>
              </button>
            )}
          </div>
        </header>

        <div className="p-6 md:p-10 space-y-10">
          {activeTab === 'listings' && (
            <div className="animate-fade-in space-y-12">
              {/* Premium Greeting & Intro */}
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200">
                  <BadgeCheck size={12} />
                  Operational Mode: ACTIVE
                </div>
                <h3 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">
                  Harvest Console: <span className="text-green-600 italic">{user.name}</span>
                </h3>
                <p className="text-lg text-gray-500 font-medium tracking-tight leading-relaxed">
                  Your marketplace analytics for <span className="text-gray-900 font-bold underline decoration-green-200 decoration-4">{user.location}</span>. 
                  Currently reaching <span className="text-gray-900 font-bold">{totalViews} potential buyers</span> across the region.
                </p>
              </div>

              {/* Spacing Gap */}
              <div className="h-4"></div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                  <StatCard key={i} {...stat} delay={i * 0.1} />
                ))}
              </div>

              {/* Large Spacing Gap */}
              <div className="h-10"></div>

              {/* Quick Navigation Icons */}
              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => navigate('/weather')}
                  className="group flex items-center gap-5 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[28px] text-white shadow-xl shadow-blue-200/50 hover:shadow-2xl hover:scale-[1.02] transition-all active:scale-[0.98]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-white/30 transition-all">
                    <CloudRain size={28} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-lg tracking-tight">Weather Forecast</p>
                    <p className="text-xs font-medium opacity-70">28° • Scattered Rain</p>
                  </div>
                  <ChevronRight size={20} className="ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  onClick={() => navigate('/market-prices')}
                  className="group flex items-center gap-5 p-6 bg-gradient-to-br from-green-600 to-emerald-700 rounded-[28px] text-white shadow-xl shadow-green-200/50 hover:shadow-2xl hover:scale-[1.02] transition-all active:scale-[0.98]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-white/30 transition-all">
                    <TrendingUp size={28} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-lg tracking-tight">Market Prices</p>
                    <p className="text-xs font-medium opacity-70">APMC Live Rates</p>
                  </div>
                  <ChevronRight size={20} className="ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              </div>

              {/* Extra Large Spacing Gap */}
              <div className="h-16"></div>

              {/* Active Listings Section */}
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-xl">
                      <Package size={24} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">My Marketplace Listings</h4>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Live harvest available for bulk purchase</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="hidden sm:flex items-center gap-3 px-8 py-4 bg-green-600 text-white rounded-2xl text-xs font-black tracking-widest hover:bg-green-700 transition-all shadow-xl shadow-green-200 active:scale-95"
                  >
                    <Plus size={18} />
                    ADD NEW HARVEST
                  </button>
                </div>

                {loading ? (
                  <LoadingSkeleton count={3} />
                ) : myListings.length === 0 ? (
                  <div className="bg-white rounded-[40px] border-2 border-dashed border-gray-100 py-32 text-center shadow-inner">
                    <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                      <Package size={32} className="text-green-300" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">No active listings</h3>
                    <p className="text-gray-400 font-medium max-w-sm mx-auto mb-8 text-base">You haven't listed any crops for sale yet. Start by adding your first harvest.</p>
                    <button
                      onClick={() => setActiveTab('add')}
                      className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
                    >
                      {t('addNewCrop')}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {myListings.map((listing) => (
                      <div key={listing.id} className="hover:-translate-y-2 transition-all duration-300">
                        <CropCard 
                          listing={{
                            ...listing, 
                            onDelete: (id) => {
                              if (window.confirm("Are you sure you want to delete this listing?")) {
                                deleteListing(id);
                              }
                            },
                            onEdit: (listing) => alert("Edit feature coming soon!") 
                          }} 
                          showContact={false} 
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'add' && (
            <AddListingPage onSuccess={() => setActiveTab('listings')} />
          )}

          {activeTab === 'assistant' && (
            <AIChatbot />
          )}

          {activeTab === 'profile' && (
            <div className="max-w-lg animate-fade-in">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-2xl font-bold">
                    {user.name?.charAt(0) || 'F'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.location}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">{t('phone')}</span>
                    <span className="font-medium text-gray-900">{user.phone}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">{t('farmSize')}</span>
                    <span className="font-medium text-gray-900">{user.farmSize} acres</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">{t('primaryCrops')}</span>
                    <span className="font-medium text-gray-900">{user.primaryCrops}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-gray-500 text-sm">{t('totalListings')}</span>
                    <span className="font-medium text-gray-900">{myListings.length}</span>
                  </div>
                </div>
                
                <div className="mt-10 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Account Actions</h4>
                  <button
                    onClick={() => {
                      if (window.confirm("This will remove all your listings and saved items. Are you sure you want to reset everything?")) {
                        import('../services/storageService').then(m => m.storageService.clearData());
                      }
                    }}
                    className="w-full py-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors border border-red-100"
                  >
                    Reset All Marketplace Data
                  </button>
                  <p className="text-[10px] text-gray-400 mt-2 text-center uppercase tracking-tight">
                    Removes all persisted listings and preferences from local storage
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
