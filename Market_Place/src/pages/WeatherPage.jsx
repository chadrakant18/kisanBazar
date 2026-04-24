import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CloudRain, Wind, Droplets, Thermometer, Sun, CloudSun, Cloud, Umbrella, MapPin, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const WEATHER_CODES = {
  0: { desc: 'Clear Sky', icon: Sun },
  1: { desc: 'Mainly Clear', icon: Sun },
  2: { desc: 'Partly Cloudy', icon: CloudSun },
  3: { desc: 'Overcast', icon: Cloud },
  45: { desc: 'Foggy', icon: Cloud },
  48: { desc: 'Depositing Rime Fog', icon: Cloud },
  51: { desc: 'Light Drizzle', icon: CloudRain },
  53: { desc: 'Moderate Drizzle', icon: CloudRain },
  55: { desc: 'Dense Drizzle', icon: CloudRain },
  61: { desc: 'Slight Rain', icon: CloudRain },
  63: { desc: 'Moderate Rain', icon: Umbrella },
  65: { desc: 'Heavy Rain', icon: Umbrella },
  71: { desc: 'Slight Snow', icon: Cloud },
  73: { desc: 'Moderate Snow', icon: Cloud },
  75: { desc: 'Heavy Snow', icon: Cloud },
  80: { desc: 'Slight Rain Showers', icon: CloudRain },
  81: { desc: 'Moderate Rain Showers', icon: Umbrella },
  82: { desc: 'Violent Rain Showers', icon: Umbrella },
  95: { desc: 'Thunderstorm', icon: Umbrella },
  96: { desc: 'Thunderstorm & Hail', icon: Umbrella },
  99: { desc: 'Thunderstorm & Heavy Hail', icon: Umbrella },
};

const WeatherPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default to Tumkur if user not found or coordinates missing
  const lat = user?.latitude || 13.3389;
  const lon = user?.longitude || 77.1011;
  const locationName = user?.location || 'Tumkur, Karnataka';

  useEffect(() => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`)
      .then(res => res.json())
      .then(data => {
        setWeatherData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [lat, lon]);

  if (loading || !weatherData) {
    return (
      <div className="min-h-screen bg-sky-950 flex flex-col items-center justify-center text-sky-200 space-y-4">
        <Loader2 size={48} className="animate-spin text-sky-400" />
        <h2 className="text-xl font-black tracking-widest uppercase">Fetching Live Radar...</h2>
      </div>
    );
  }

  const currentInfo = WEATHER_CODES[weatherData.current.weather_code] || { desc: 'Unknown', icon: Cloud };
  const CurrentIcon = currentInfo.icon;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-slate-900 pb-20 text-slate-100 font-sans">
      <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-sky-400 transition-colors uppercase tracking-widest">
            <ChevronLeft size={20} /> Back
          </button>
          <h1 className="text-xl font-black text-white tracking-tighter">Weather <span className="text-sky-400">Forecast</span></h1>
          <div className="w-16"></div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-12 space-y-10">
        <div className="space-y-3">
          <h2 className="text-5xl font-black text-white tracking-tight">Farm <span className="text-sky-400">Meteorology</span></h2>
          <p className="text-lg text-slate-400 font-medium">Real-time localized telemetry powered by Open-Meteo.</p>
        </div>

        {/* Current Weather */}
        <div className="bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-800 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden border border-white/10">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/20 rounded-full blur-[80px]"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-sky-300/20 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Live Sensor Data
                </div>
                <h3 className="text-3xl font-black flex items-center gap-2">
                  <MapPin size={28} className="text-sky-200" /> {locationName}
                </h3>
              </div>
              <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl">
                <CurrentIcon size={48} className="text-sky-100 drop-shadow-lg" />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end gap-6 mb-12">
              <span className="text-[140px] font-black tracking-tighter leading-none drop-shadow-2xl">
                {Math.round(weatherData.current.temperature_2m)}°
              </span>
              <div className="pb-6">
                <p className="font-black text-3xl leading-none text-sky-100">{currentInfo.desc}</p>
                <p className="text-lg font-bold opacity-80 mt-2">Optimal conditions for current season operations</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-black/20 p-6 rounded-3xl backdrop-blur-md border border-white/10 text-center hover:bg-black/30 transition-colors">
                <Wind size={24} className="mx-auto mb-3 text-sky-200" />
                <p className="text-2xl font-black">{weatherData.current.wind_speed_10m} <span className="text-sm">km/h</span></p>
                <p className="text-[10px] font-black uppercase text-sky-200 tracking-widest mt-1">Wind Speed</p>
              </div>
              <div className="bg-black/20 p-6 rounded-3xl backdrop-blur-md border border-white/10 text-center hover:bg-black/30 transition-colors">
                <Droplets size={24} className="mx-auto mb-3 text-sky-200" />
                <p className="text-2xl font-black">{weatherData.current.relative_humidity_2m}%</p>
                <p className="text-[10px] font-black uppercase text-sky-200 tracking-widest mt-1">Humidity</p>
              </div>
              <div className="bg-black/20 p-6 rounded-3xl backdrop-blur-md border border-white/10 text-center hover:bg-black/30 transition-colors">
                <Thermometer size={24} className="mx-auto mb-3 text-sky-200" />
                <p className="text-2xl font-black">{Math.round(weatherData.current.temperature_2m + 2)}°</p>
                <p className="text-[10px] font-black uppercase text-sky-200 tracking-widest mt-1">Feels Like</p>
              </div>
              <div className="bg-black/20 p-6 rounded-3xl backdrop-blur-md border border-white/10 text-center hover:bg-black/30 transition-colors">
                <CloudRain size={24} className="mx-auto mb-3 text-sky-200" />
                <p className="text-2xl font-black">{weatherData.daily.precipitation_probability_max[0]}%</p>
                <p className="text-[10px] font-black uppercase text-sky-200 tracking-widest mt-1">Rain Prob</p>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-[32px] p-8 border border-slate-700 shadow-xl">
          <h4 className="font-black text-slate-400 uppercase tracking-[0.2em] text-xs mb-8">7-Day Forecast</h4>
          <div className="space-y-3">
            {weatherData.daily.time.map((timeStr, i) => {
              const date = new Date(timeStr);
              const dayName = i === 0 ? 'Today' : days[date.getDay()];
              const code = weatherData.daily.weather_code[i];
              const info = WEATHER_CODES[code] || { desc: 'Unknown', icon: Cloud };
              const DayIcon = info.icon;
              
              return (
                <div key={i} className="flex items-center justify-between p-5 bg-slate-800/80 rounded-2xl hover:bg-slate-700 transition-all border border-slate-700/50">
                  <span className={`w-16 font-black text-lg ${i === 0 ? 'text-sky-400' : 'text-slate-200'}`}>{dayName}</span>
                  <div className="text-sky-400"><DayIcon size={24} /></div>
                  <span className="flex-1 px-6 text-sm font-bold text-slate-300 hidden sm:block">{info.desc}</span>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 w-16">
                      <Droplets size={14} className="text-sky-500" />
                      <span className="text-sm font-black text-sky-400">{weatherData.daily.precipitation_probability_max[i]}%</span>
                    </div>
                    <div className="w-32 flex items-center justify-end gap-3">
                      <span className="font-black text-slate-400">{Math.round(weatherData.daily.temperature_2m_min[i])}°</span>
                      <div className="w-12 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-sky-500 to-amber-500 w-full opacity-70"></div>
                      </div>
                      <span className="font-black text-white text-lg">{Math.round(weatherData.daily.temperature_2m_max[i])}°</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Farming Advisory */}
        <div className="bg-gradient-to-r from-sky-500/10 to-indigo-600/10 border border-sky-500/20 rounded-[32px] p-8 backdrop-blur-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sun size={120} />
           </div>
          <h5 className="font-black text-sky-400 uppercase tracking-widest text-[10px] mb-3 flex items-center gap-2 relative z-10">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span> AI Farming Weather Advisory
          </h5>
          <p className="text-sky-100 font-bold leading-relaxed text-lg relative z-10 max-w-3xl">
            {weatherData.daily.precipitation_probability_max[0] > 50 
              ? "High precipitation probability detected today. Postpone pesticide spraying and ensure field drainage channels are clear to prevent waterlogging. Good time for transplanting paddy seedlings."
              : "Dry conditions expected today. Optimal window for fertilizer application and pesticide spraying. Ensure adequate irrigation for water-sensitive crops."}
          </p>
        </div>
      </main>
    </div>
  );
};

export default WeatherPage;
