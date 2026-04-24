import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingContext';
import LanguageToggle from '../components/LanguageToggle';
import CropCard from '../components/CropCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { cropOptions, locations } from '../data/mockData';
import {
  Leaf, Search, SlidersHorizontal, LogOut, User, Bookmark,
  ShoppingBag, X, ChevronDown, Filter, Sparkles, TrendingUp, CloudRain
} from 'lucide-react';

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { listings, getSavedListingItems } = useListings();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse');
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState(200);

  useEffect(() => {
    if (!user || user.role !== 'buyer') {
      navigate('/login/buyer');
      return;
    }
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  const filteredListings = useMemo(() => {
    return listings.filter(l => {
      // Verified crops only for buyers
      if (!l.verified) return false;
      if (searchQuery && !l.cropName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !l.farmerName?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (cropFilter && l.cropName !== cropFilter) return false;
      if (locationFilter && l.location !== locationFilter) return false;
      if (l.price > maxPrice) return false;
      return true;
    });
  }, [listings, searchQuery, cropFilter, locationFilter, maxPrice]);

  const savedItems = getSavedListingItems();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCropFilter('');
    setLocationFilter('');
    setMaxPrice(200);
  };

  const activeFiltersCount = [cropFilter, locationFilter, maxPrice < 100].filter(Boolean).length;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Premium Gradient Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-lg shadow-green-200 rotate-3">
                <Leaf className="text-white" size={24} />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-black text-2xl text-gray-900 tracking-tight leading-none italic">Kisan<span className="text-green-600">Bazaar</span></h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Premium Marketplace</p>
              </div>
            </div>

            {/* Centered Navigation */}
            <div className="hidden md:flex items-center gap-1 bg-gray-100/50 rounded-2xl p-1.5 border border-gray-200/50">
              <button
                onClick={() => setActiveTab('browse')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all
                  ${activeTab === 'browse' ? 'bg-white text-green-700 shadow-md scale-105' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <ShoppingBag size={18} />
                {t('browseCrops')}
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative
                  ${activeTab === 'saved' ? 'bg-white text-green-700 shadow-md scale-105' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Bookmark size={18} />
                {t('savedListings')}
                {savedItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-black animate-bounce">
                    {savedItems.length}
                  </span>
                )}
              </button>
            </div>

            {/* Right Profile Section */}
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
              <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Buyer Account</p>
                  <p className="text-sm font-black text-gray-800">{user.name}</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-400 to-orange-600 flex items-center justify-center text-white font-black shadow-lg shadow-orange-100 border-2 border-white">
                  {user.name?.charAt(0) || 'B'}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {activeTab === 'browse' && (
          <div className="space-y-8 animate-fade-in">
            {/* Search Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200">
                  <Sparkles size={12} />
                  New Harvest Season 2026
                </div>
                <h2 className="text-6xl md:text-7xl font-black text-gray-900 tracking-tight mb-4 leading-[0.9]">
                  Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 italic">Best Harvest</span>
                </h2>
                <p className="text-xl text-gray-400 font-bold max-w-2xl leading-relaxed tracking-tight">
                  Direct sourcing from India's most trusted, AI-verified farmers. 
                  Experience zero middlemen and complete transparency in agriculture.
                </p>
              </div>

              {/* Large Spacing Gap */}
              <div className="h-10"></div>
            </div>
            </div>

            {/* Premium Filter Bar */}
            <div className="bg-white/40 backdrop-blur-3xl rounded-[40px] shadow-2xl shadow-green-900/5 border border-white p-3 overflow-hidden transition-all hover:shadow-green-900/10">
              <div className="flex flex-col lg:flex-row items-center gap-3">
                <div className="flex-1 relative w-full group">
                  <Search size={24} className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchCrops')}
                    className="w-full pl-20 pr-8 py-8 text-xl font-bold border-none focus:ring-0 placeholder:text-gray-300 rounded-[32px] bg-white/50 focus:bg-white transition-all shadow-inner"
                  />
                </div>
                
                <div className="h-12 w-px bg-gray-200 hidden lg:block"></div>

                <div className="flex items-center gap-3 p-2 w-full lg:w-auto">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-3 px-10 py-5 rounded-[24px] text-sm font-black tracking-widest transition-all
                      ${showFilters || activeFiltersCount > 0
                        ? 'bg-green-700 text-white shadow-2xl shadow-green-700/30 scale-105'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                  >
                    <SlidersHorizontal size={20} />
                    {showFilters ? 'CLOSE' : 'FILTERS'}
                    {activeFiltersCount > 0 && (
                      <span className="w-6 h-6 rounded-full bg-white text-green-700 text-xs flex items-center justify-center font-black ml-1 animate-pulse">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                  <button className="flex items-center gap-3 px-12 py-5 bg-gray-900 text-white rounded-[24px] text-sm font-black tracking-widest shadow-2xl shadow-gray-900/20 hover:bg-black hover:scale-105 active:scale-95 transition-all">
                    <Search size={20} />
                    SEARCH
                  </button>
                </div>
              </div>

              {/* Expanded Filter Panel */}
              {showFilters && (
                <div className="p-8 bg-gray-50/50 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-down">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Category</label>
                    <div className="relative group">
                       <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-green-600 transition-colors" />
                      <select
                        value={cropFilter}
                        onChange={(e) => setCropFilter(e.target.value)}
                        className="w-full pl-12 pr-10 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold appearance-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all outline-none shadow-sm"
                      >
                        <option value="">{t('allCrops')}</option>
                        {cropOptions.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Harvest Region</label>
                    <div className="relative group">
                       <Leaf size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-amber-600 transition-colors" />
                      <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="w-full pl-12 pr-10 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold appearance-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none shadow-sm"
                      >
                        <option value="">{t('filterLocation')}</option>
                        {locations.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center mb-1 pl-1">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Price Limit</label>
                      <span className="text-sm font-black text-green-700 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">₹{maxPrice}/kg</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="200"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                      className="w-full h-2.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-600 shadow-inner"
                    />
                    <div className="flex justify-between text-[10px] font-black text-gray-300 tracking-tighter">
                      <span>MIN ₹5</span>
                      <span>MAX ₹200</span>
                    </div>
                  </div>

                  <div className="md:col-span-3 flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 px-6 py-3 text-sm font-black text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <X size={18} />
                      {t('clearFilters') || "RESET ALL FILTERS"}
                    </button>
                  </div>
            
            {/* Spacing Gap */}
            <div className="h-20"></div>
                </div>
              )}
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 py-2">
              {/* Listings Column */}
              <div className="lg:col-span-3">
                 <div className="flex items-center gap-2 mb-6 text-gray-400 font-bold uppercase tracking-widest text-[11px] animate-fade-in">
                    <Sparkles size={14} className="text-amber-400" />
                    Realtime Discovery: Found <span className="text-gray-900 font-black underline decoration-green-500/30 decoration-4">{filteredListings.length} Premium Listings</span>
                 </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="bg-white rounded-3xl h-[450px] animate-pulse border border-gray-100 shadow-sm" />
                    ))}
                  </div>
                ) : filteredListings.length === 0 ? (
                  <div className="bg-white rounded-[40px] border-2 border-dashed border-gray-100 py-32 text-center shadow-inner animate-pulse">
                    <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-8">
                      <Search size={48} className="text-gray-200" />
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-2">No Active Listings</h3>
                    <p className="text-gray-400 font-medium max-w-sm mx-auto mb-8 text-lg">Real data is currently being verified. Check back soon for fresh harvest direct from farmers.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {filteredListings.map((listing, i) => (
                      <div key={listing.id} className="transform transition-all duration-700 hover:-translate-y-4" style={{ animationDelay: `${i * 100}ms` }}>
                        <CropCard listing={listing} showContact={true} showSave={true} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Links Sidebar */}
              <div className="lg:col-span-1 flex flex-col gap-6 pt-10 lg:pt-0">
                <button
                  onClick={() => navigate('/market-prices')}
                  className="w-full group relative overflow-hidden flex flex-col p-6 bg-gradient-to-br from-emerald-500 to-green-700 rounded-[32px] text-white shadow-[0_8px_30px_rgb(16,185,129,0.2)] hover:shadow-[0_8px_40px_rgb(16,185,129,0.4)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner">
                      <TrendingUp size={28} className="text-white drop-shadow-md" />
                    </div>
                    <div className="text-left">
                      <p className="font-black text-xl tracking-tight leading-none mb-1">Market Prices</p>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-100">APMC Live Rates</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/weather')}
                  className="w-full group relative overflow-hidden flex flex-col p-6 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-[32px] text-white shadow-[0_8px_30px_rgb(59,130,246,0.2)] hover:shadow-[0_8px_40px_rgb(59,130,246,0.4)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mb-10 transition-transform group-hover:scale-150"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner">
                      <CloudRain size={28} className="text-white drop-shadow-md" />
                    </div>
                    <div className="text-left">
                      <p className="font-black text-xl tracking-tight leading-none mb-1">Weather</p>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-blue-100">Realtime Radar</p>
                    </div>
                  </div>
                </button>

                <div className="w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black rounded-[32px] p-8 text-white shadow-2xl border border-gray-800">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                  <div className="relative z-10">
                    <h4 className="text-2xl font-black mb-3 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Bulk Sourcing?</h4>
                    <p className="text-sm font-medium text-gray-400 leading-relaxed mb-8">Connect with our regional procurement experts for direct-from-farm orders above 5,000 kg.</p>
                    <button 
                      onClick={() => window.open('https://wa.me/919876543210?text=Hello%20KisanBazaar%20Experts!%20I%20am%20a%20buyer%20interested%20in%20Bulk%20Sourcing%20(5000kg%2B).%20Please%20assist%20me.', '_blank')}
                      className="w-full flex justify-center items-center gap-2 py-4 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-white transition-all shadow-lg hover:shadow-emerald-500/50"
                    >
                      Request Quote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved Listings Tab */}
        {activeTab === 'saved' && (
          <div className="animate-fade-in space-y-12">
            <div>
              <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4 italic">Your <span className="text-orange-500 underline decoration-orange-200">Watchlist</span></h2>
              <p className="text-lg text-gray-500 font-medium tracking-tight">Keep track of the produce you're interested in for seasonal bulk buying.</p>
            </div>

            {savedItems.length === 0 ? (
              <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/40 p-24 text-center border border-gray-50">
                <div className="w-32 h-32 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-10 border-4 border-white shadow-lg">
                  <Bookmark size={56} className="text-orange-500" />
                </div>
                <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Your watchlist is empty</h3>
                <p className="text-gray-400 font-medium max-w-md mx-auto mb-12 text-xl tracking-tight leading-relaxed">Save the crops you like while browsing to keep them easily accessible for later negotiation.</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-12 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-[24px] font-black tracking-widest hover:shadow-2xl hover:shadow-green-200 transition-all active:scale-95 shadow-lg"
                >
                  START BROWSING
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
                {savedItems.map((listing) => (
                  <div key={listing.id} className="hover:-translate-y-2 transition-all">
                    <CropCard listing={listing} showContact={true} showSave={true} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Premium Footer Mini */}
      <footer className="max-w-7xl mx-auto px-4 py-20 opacity-50">
         <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-12"></div>
         <div className="flex flex-col md:flex-row items-center justify-between gap-6 uppercase tracking-[0.4em] text-[10px] font-black text-gray-400">
            <span>© 2026 KisanBazaar Global</span>
            <div className="flex gap-8">
               <span className="hover:text-green-600 cursor-pointer">Terms</span>
               <span className="hover:text-green-600 cursor-pointer">Privacy</span>
               <span className="hover:text-green-600 cursor-pointer">Sourcing Policy</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
