import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { HiOutlineDocumentSearch, HiOutlineClock, HiOutlineSparkles } from 'react-icons/hi';
import Home from './pages/Home';
import History from './pages/History';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-surface-900 bg-grid">
        {/* ── Navbar ──────────────────────────────────────────────────── */}
        <nav className="sticky top-0 z-50 glass-card border-t-0 border-x-0 rounded-none px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
                <HiOutlineDocumentSearch className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">ReceiptAI</h1>
                <p className="text-xs text-slate-500">Smart OCR Scanner</p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <HiOutlineSparkles className="w-4 h-4" />
                Scan
              </NavLink>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <HiOutlineClock className="w-4 h-4" />
                History
              </NavLink>
            </div>
          </div>
        </nav>

        {/* ── Page Content ────────────────────────────────────────────── */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
