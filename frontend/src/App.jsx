import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Settings from './pages/Settings';
import { getRates } from './lib/api';

function Ticker({ rates }) {
  const pairs = Object.entries(rates).filter(([k]) => k !== 'updatedAt');
  if (!pairs.length) return null;
  const items = [...pairs, ...pairs];
  return (
    <div className="ticker-wrap py-1.5">
      <div className="ticker-inner">
        {items.map(([pair, rate], i) => (
          <span key={i} className="font-mono text-xs mx-8 text-gray-400">
            <span className="text-blue-400">{pair}</span>
            <span className="ml-2 text-green-400">{parseFloat(rate).toFixed(4)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [rates, setRates] = useState({});
  const location = useLocation();

  useEffect(() => {
    getRates().then(setRates).catch(() => {});
    const i = setInterval(() => getRates().then(setRates).catch(() => {}), 30000);
    return () => clearInterval(i);
  }, []);

  const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/history', label: 'History' },
    { to: '/settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Top Nav */}
      <nav style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
        className="px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
            <span className="font-mono text-blue-400 text-xs font-bold">AF</span>
          </div>
          <span className="font-semibold text-white text-sm tracking-wide">AutoFX Agent</span>
          <span className="font-mono text-xs px-2 py-0.5 rounded badge-green">● LIVE</span>
          <span className="font-mono text-xs px-2 py-0.5 rounded badge-blue">Arc Testnet</span>
        </div>
        <div className="flex items-center gap-1">
          {navItems.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `px-3 py-1.5 rounded text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }>{label}</NavLink>
          ))}
        </div>
      </nav>

      {/* Live ticker */}
      <Ticker rates={rates} />

      {/* Page */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
