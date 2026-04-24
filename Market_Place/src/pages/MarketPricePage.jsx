import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, TrendingUp, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react';

const MarketPricePage = () => {
  const navigate = useNavigate();

  const marketData = [
    { name: 'Tomato', price: '₹22/kg', change: '+12%', up: true, high: '₹26', low: '₹18', volume: '450 Tons', msp: '-' },
    { name: 'Ragi', price: '₹34/kg', change: '+5%', up: true, high: '₹38', low: '₹32', volume: '1200 Tons', msp: '₹3,846/q' },
    { name: 'Banana', price: '₹14/kg', change: '-2%', up: false, high: '₹16', low: '₹13', volume: '800 Tons', msp: '-' },
    { name: 'Onion', price: '₹28/kg', change: '+18%', up: true, high: '₹35', low: '₹22', volume: '2100 Tons', msp: '-' },
    { name: 'Mango', price: '₹140/kg', change: '-8%', up: false, high: '₹200', low: '₹100', volume: '350 Tons', msp: '-' },
    { name: 'Rice (Paddy)', price: '₹23/kg', change: '+3%', up: true, high: '₹28', low: '₹22', volume: '3500 Tons', msp: '₹2,300/q' },
    { name: 'Wheat', price: '₹24/kg', change: '+2%', up: true, high: '₹26', low: '₹22', volume: '2800 Tons', msp: '₹2,275/q' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-green-600 transition-colors uppercase tracking-widest">
            <ChevronLeft size={20} /> Back
          </button>
          <h1 className="text-xl font-black text-gray-900 tracking-tighter">Market <span className="text-green-600">Prices</span></h1>
          <div className="w-16"></div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-12 space-y-10">
        <div className="space-y-3">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">APMC Market <span className="text-green-600">Analysis</span></h2>
          <p className="text-lg text-gray-500 font-medium">Real-time prices from regional APMC mandis. Updated every 15 minutes.</p>
        </div>

        {/* Price Table */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                <BarChart3 size={20} />
              </div>
              <span className="font-black text-gray-900 uppercase tracking-widest text-xs">Consolidated Regional Data</span>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-black text-gray-600">7 DAYS</button>
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
                  <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">MSP</th>
                  <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {marketData.map((item) => (
                  <tr key={item.name} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center font-black text-xs text-gray-600 group-hover:bg-green-100 group-hover:text-green-700 transition-all">
                          {item.name.charAt(0)}
                        </div>
                        <span className="font-black text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-5 px-4 font-black text-gray-900">{item.price}</td>
                    <td className="py-5 px-4">
                      <div className={`flex items-center gap-1 font-black text-xs ${item.up ? 'text-green-600' : 'text-red-600'}`}>
                        {item.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {item.change}
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400">{item.low}</span>
                        <div className="flex-1 h-1 bg-gray-100 rounded-full min-w-[50px] relative">
                          <div className="absolute inset-y-0 left-1/4 right-1/4 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-xs font-bold text-gray-900">{item.high}</span>
                      </div>
                    </td>
                    <td className="py-5 px-4 font-bold text-gray-500 text-sm">{item.msp}</td>
                    <td className="py-5 px-4 font-bold text-gray-500 text-sm">{item.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Advisory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-orange-50 border border-orange-100 rounded-[32px] p-8">
            <h5 className="font-black text-orange-800 uppercase tracking-widest text-[10px] mb-3">Expert Advice</h5>
            <p className="text-orange-900 font-bold leading-relaxed">Onion prices expected to peak in 10 days. If you have cold storage, hold stock until next Wednesday for maximum profit.</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-[32px] p-8">
            <h5 className="font-black text-emerald-800 uppercase tracking-widest text-[10px] mb-3">Market Sentiment</h5>
            <p className="text-emerald-900 font-bold leading-relaxed">Strong demand for Ragi from Bengaluru and Mysuru regions. Buyers actively seeking Grade-A quality. Good time to list.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketPricePage;
