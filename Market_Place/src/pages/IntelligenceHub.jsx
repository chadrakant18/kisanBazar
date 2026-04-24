import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CloudRain, TrendingUp, BarChart3, Map, Wind, Droplets, Thermometer, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const IntelligenceHub = () => {
  const navigate = useNavigate();

  const marketData = [
    { name: 'Tomato', price: '₹22/kg', change: '+12%', up: true, high: '₹25', low: '₹18', volume: '450 Tons' },
    { name: 'Ragi', price: '₹34/kg', change: '+5%', up: true, high: '₹36', low: '₹32', volume: '1200 Tons' },
    { name: 'Banana', price: '₹14/kg', change: '-2%', up: false, high: '₹16', low: '₹13', volume: '800 Tons' },
    { name: 'Onion', price: '₹28/kg', change: '+18%', up: true, high: '₹30', low: '₹22', volume: '2100 Tons' },
    { name: 'Mango', price: '₹140/kg', change: '-8%', up: false, high: '₹160', low: '₹130', volume: '350 Tons' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Premium Header */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-green-600 transition-colors uppercase tracking-widest"
          >
            <ChevronLeft size={20} />
            Back to Dashboard
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-black text-gray-900 tracking-tighter">Intelligence <span className="text-green-600">Hub</span></h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Real-time Agricultural Data</p>
          </div>
          <div className="w-20"></div> {/* Spacer */}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12 space-y-12">
        {/* Intro */}
        <div className="space-y-4">
          <h2 className="text-5xl font-black text-gray-900 tracking-tight">Market & Climate <span className="text-green-600">Analytics</span></h2>
          <p className="text-xl text-gray-500 font-medium max-w-3xl">Comprehensive insights to optimize your harvesting and procurement strategies. Data updated every 15 minutes from APMC and weather satellites.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Detailed Weather Section */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[40px] p-10 text-white shadow-2xl shadow-blue-900/20">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <CloudRain size={28} />
                  Detailed Forecast
                </h3>
                <span className="px-4 py-1.5 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest">Tumkur Region</span>
              </div>

              <div className="flex flex-col items-center mb-12">
                <span className="text-9xl font-black tracking-tighter">28°</span>
                <p className="text-2xl font-bold mt-2">Scattered Rain</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/10">
                  <Wind size={20} className="mb-3 opacity-60" />
                  <p className="text-lg font-black leading-none">12 km/h</p>
                  <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest mt-1">Wind Speed</p>
                </div>
                <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/10">
                  <Droplets size={20} className="mb-3 opacity-60" />
                  <p className="text-lg font-black leading-none">65%</p>
                  <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest mt-1">Humidity</p>
                </div>
                <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/10">
                  <Thermometer size={20} className="mb-3 opacity-60" />
                  <p className="text-lg font-black leading-none">31°C</p>
                  <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest mt-1">Feels Like</p>
                </div>
                <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/10">
                  <Map size={20} className="mb-3 opacity-60" />
                  <p className="text-lg font-black leading-none">High</p>
                  <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest mt-1">Sowing Index</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
               <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6">7-Day Precipitation Plan</h4>
               <div className="flex items-end justify-between h-32 gap-2">
                 {[40, 70, 30, 90, 50, 20, 60].map((h, i) => (
                   <div key={i} className="flex-1 bg-blue-100 rounded-lg group relative transition-all hover:bg-blue-600" style={{ height: `${h}%` }}>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{h}%</span>
                   </div>
                 ))}
               </div>
               <div className="flex justify-between mt-4 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
               </div>
            </div>
          </div>

          {/* Detailed Market Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-2xl shadow-green-900/5">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center shadow-inner">
                    <BarChart3 size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">APMC Market Analysis</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Consolidated Regional Data</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-black text-gray-600 hover:bg-gray-200 transition-all">7 DAYS</button>
                   <button className="px-4 py-2 bg-green-600 rounded-xl text-xs font-black text-white shadow-lg shadow-green-200">30 DAYS</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Commodity</th>
                      <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Avg Price</th>
                      <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Change</th>
                      <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Range (L/H)</th>
                      <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {marketData.map((item) => (
                      <tr key={item.name} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-6 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-600 group-hover:bg-green-100 group-hover:text-green-700 transition-all">
                              {item.name.charAt(0)}
                            </div>
                            <span className="font-black text-gray-900">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-6 px-4 font-black text-gray-900">{item.price}</td>
                        <td className="py-6 px-4">
                          <div className={`flex items-center gap-1 font-black text-xs ${item.up ? 'text-green-600' : 'text-red-600'}`}>
                            {item.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {item.change}
                          </div>
                        </td>
                        <td className="py-6 px-4">
                           <div className="flex items-center gap-2">
                             <span className="text-xs font-bold text-gray-400">{item.low}</span>
                             <div className="flex-1 h-1 bg-gray-100 rounded-full min-w-[60px] relative">
                                <div className="absolute inset-y-0 left-1/4 right-1/4 bg-green-500 rounded-full"></div>
                             </div>
                             <span className="text-xs font-bold text-gray-900">{item.high}</span>
                           </div>
                        </td>
                        <td className="py-6 px-4 font-bold text-gray-500 text-sm">{item.volume}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-orange-50 border border-orange-100 rounded-[32px] p-8">
                  <h5 className="font-black text-orange-800 uppercase tracking-widest text-[10px] mb-2">Expert Advice</h5>
                  <p className="text-orange-900 font-bold leading-tight mb-4">Onion prices are expected to peak in 10 days. If you have cold storage, hold stock until Wednesday.</p>
                  <button className="text-[10px] font-black text-orange-700 underline decoration-orange-300">READ FULL ANALYSIS</button>
               </div>
               <div className="bg-emerald-50 border border-emerald-100 rounded-[32px] p-8">
                  <h5 className="font-black text-emerald-800 uppercase tracking-widest text-[10px] mb-2">Market Sentiment</h5>
                  <p className="text-emerald-900 font-bold leading-tight mb-4">Strong demand for Ragi from Bengaluru and Mysuru regions. Buyers are actively seeking Grade-A quality.</p>
                  <button className="text-[10px] font-black text-emerald-700 underline decoration-emerald-300">VIEW BUYER TRENDS</button>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IntelligenceHub;
