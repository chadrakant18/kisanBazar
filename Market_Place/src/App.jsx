import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ListingProvider } from './context/ListingContext';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import IntelligenceHub from './pages/IntelligenceHub';
import WeatherPage from './pages/WeatherPage';
import MarketPricePage from './pages/MarketPricePage';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <ListingProvider>
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login/:role" element={<AuthPage mode="login" />} />
                  <Route path="/register/:role" element={<AuthPage mode="register" />} />
                  <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
                  <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
                  <Route path="/intelligence" element={<IntelligenceHub />} />
                  <Route path="/weather" element={<WeatherPage />} />
                  <Route path="/market-prices" element={<MarketPricePage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </ListingProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
