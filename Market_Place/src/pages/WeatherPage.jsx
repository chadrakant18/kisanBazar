import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CloudRain, Wind, Droplets, Thermometer, Sun, CloudSun, Cloud, Umbrella } from 'lucide-react';

const WeatherPage = () => {
  const navigate = useNavigate();

  const forecast = [
    { day: 'Mon', icon: <CloudRain size={20} />, temp: '28°', rain: '40%', desc: 'Scattered Rain' },
    { day: 'Tue', icon: <Umbrella size={20} />, temp: '26°', rain: '70%', desc: 'Heavy Rain' },
    { day: 'Wed', icon: <CloudSun size={20} />, temp: '30°', rain: '30%', desc: 'Partly Cloudy' },
    { day: 'Thu', icon: <Umbrella size={20} />, temp: '25°', rain: '90%', desc: 'Thunderstorm' },
    { day: 'Fri', icon: <Cloud size={20} />, temp: '29°', rain: '50%', desc: 'Cloudy' },
    { day: 'Sat', icon: <Sun size={20} />, temp: '32°', rain: '20%', desc: 'Mostly Sunny' },
    { day: 'Sun', icon: <CloudRain size={20} />, temp: '27°', rain: '60%', desc: 'Light Rain' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-green-600 transition-colors uppercase tracking-widest">
            <ChevronLeft size={20} /> Back
          </button>
          <h1 className="text-xl font-black text-gray-900 tracking-tighter">Weather <span className="text-blue-600">Forecast</span></h1>
          <div className="w-16"></div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-12 space-y-10">
        {/* Current Weather */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] opacity-80">Current Conditions</h3>
                <p className="text-3xl font-black mt-1">Tumkur, Karnataka</p>
              </div>
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                <CloudRain size={40} />
              </div>
            </div>
            <div className="flex items-end gap-6 mb-10">
              <span className="text-9xl font-black tracking-tighter leading-none">28°</span>
              <div className="pb-4">
                <p className="font-bold text-2xl leading-none">Scattered Rain</p>
                <p className="text-base font-medium opacity-70 mt-1">Ideal for sowing season</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/10 text-center">
                <Wind size={20} className="mx-auto mb-2 opacity-60" />
                <p className="text-lg font-black">12 km/h</p>
                <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Wind</p>
              </div>
              <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/10 text-center">
                <Droplets size={20} className="mx-auto mb-2 opacity-60" />
                <p className="text-lg font-black">65%</p>
                <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Humidity</p>
              </div>
              <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/10 text-center">
                <Thermometer size={20} className="mx-auto mb-2 opacity-60" />
                <p className="text-lg font-black">31°C</p>
                <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Feels Like</p>
              </div>
              <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/10 text-center">
                <Sun size={20} className="mx-auto mb-2 opacity-60" />
                <p className="text-lg font-black">6:12 AM</p>
                <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Sunrise</p>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl">
          <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-8">7-Day Forecast</h4>
          <div className="space-y-4">
            {forecast.map((day, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-all">
                <span className="w-12 font-black text-gray-700">{day.day}</span>
                <div className="text-blue-600">{day.icon}</div>
                <span className="w-32 text-sm font-bold text-gray-600">{day.desc}</span>
                <span className="font-black text-gray-900 text-lg">{day.temp}</span>
                <div className="flex items-center gap-2">
                  <Droplets size={14} className="text-blue-400" />
                  <span className="text-sm font-bold text-blue-600">{day.rain}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Farming Advisory */}
        <div className="bg-amber-50 border border-amber-100 rounded-[32px] p-8">
          <h5 className="font-black text-amber-800 uppercase tracking-widest text-[10px] mb-3">Farming Weather Advisory</h5>
          <p className="text-amber-900 font-bold leading-relaxed">Heavy rain expected mid-week (Thursday). Postpone pesticide spraying until Saturday. Good time for transplanting paddy seedlings. Ensure field drainage channels are clear to prevent waterlogging.</p>
        </div>
      </main>
    </div>
  );
};

export default WeatherPage;
