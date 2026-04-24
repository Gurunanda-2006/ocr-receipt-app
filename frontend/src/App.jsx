import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import History from './pages/History';
import LandingPage from './pages/LandingPage';
import AppNavbar from './components/AppNavbar';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* App Section */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-black text-primary selection:bg-primary selection:text-black relative overflow-x-hidden">
              <div className="noise-overlay opacity-20 pointer-events-none" />
              <div className="fixed inset-0 bg-grid opacity-5 pointer-events-none" />
              <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
              
              <AppNavbar />
              
              <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                <Routes>
                  <Route path="/scan" element={<Home />} />
                  <Route path="/history" element={<History />} />
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
