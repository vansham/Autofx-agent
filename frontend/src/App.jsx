import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Settings from './pages/Settings';

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* Top Nav */}
      <nav className="border-b border-slate-800 px-6 py-3 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">A</div>
          <span className="font-semibold text-white text-sm">AutoFX Agent</span>
          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">Arc Testnet</span>
        </div>
        <div className="flex gap-1 ml-4">
          <NavItem to="/" label="Dashboard" />
          <NavItem to="/history" label="History" />
          <NavItem to="/settings" label="Settings" />
        </div>
      </nav>

      {/* Page content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
