import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, TrendingUp, ArrowUpRight, ArrowDownRight, BarChart3, Loader2 } from 'lucide-react';

const MarketPricePage = () => {
  const navigate = useNavigate();
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/market-prices')
      .then(res => res.json())
      .then(data => {
        setMarketData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 pb-20 text-slate-100 font-sans">
      <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-emerald-400 transition-colors uppercase tracking-widest">
            <ChevronLeft size={20} /> Back
          </button>
          <h1 className="text-xl font-black text-white tracking-tighter">Market <span className="text-emerald-400">Prices</span></h1>
          <div className="w-16"></div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-12 space-y-10">
        <div className="space-y-3">
          <h2 className="text-5xl font-black text-white tracking-tight">APMC Market <span className="text-emerald-400">Live Data</span></h2>
          <p className="text-lg text-slate-400 font-medium">Real-time commodity pricing. Updates fetched continuously.</p>
        </div>

        {/* Price Table */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-[32px] p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <BarChart3 size={24} />
              </div>
              <span className="font-black text-white uppercase tracking-widest text-sm">Consolidated Market Feed</span>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-xl border border-emerald-400/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                LIVE
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-emerald-400 space-y-4">
              <Loader2 size={48} className="animate-spin opacity-80" />
              <p className="font-bold tracking-widest uppercase text-sm">Fetching real APMC data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="pb-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Commodity</th>
                    <th className="pb-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Avg Price</th>
                    <th className="pb-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Change</th>
                    <th className="pb-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Range (L/H)</th>
                    <th className="pb-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {marketData.map((item, idx) => (
                    <tr key={idx} className="group hover:bg-slate-700/30 transition-colors">
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center font-black text-sm text-slate-300 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-all border border-slate-600 group-hover:border-emerald-500/30 shadow-inner">
                            {item.name.charAt(0)}
                          </div>
                          <span className="font-black text-white text-base">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-6 px-4 font-black text-white text-lg">{item.price}</td>
                      <td className="py-6 px-4">
                        <div className={`flex items-center gap-1.5 font-black text-sm ${item.up ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'} px-3 py-1 rounded-lg w-fit`}>
                          {item.up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                          {item.change}
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-400 w-12 text-right">{item.low}</span>
                          <div className="flex-1 h-1.5 bg-slate-700 rounded-full min-w-[60px] relative overflow-hidden">
                            <div className={`absolute inset-y-0 left-1/4 right-1/4 rounded-full ${item.up ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                          </div>
                          <span className="text-xs font-bold text-white w-12">{item.high}</span>
                        </div>
                      </td>
                      <td className="py-6 px-4 font-bold text-slate-400 text-sm">{item.volume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Advisory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-[32px] p-8 backdrop-blur-sm">
            <h5 className="font-black text-amber-400 uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Expert Advice
            </h5>
            <p className="text-amber-100 font-bold leading-relaxed text-lg">Onion and Tomato prices are experiencing high volatility. If you have cold storage facilities, hold stock until the weekend for a projected 15% premium.</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-500/20 rounded-[32px] p-8 backdrop-blur-sm">
            <h5 className="font-black text-emerald-400 uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Market Sentiment
            </h5>
            <p className="text-emerald-100 font-bold leading-relaxed text-lg">Strong demand for staples across all major mandis. Buyers are actively seeking Grade-A quality produce. Exceptional time to list your harvest.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketPricePage;
