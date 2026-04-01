import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getRates, refreshRates } from '../lib/api';

const PAIRS = ['USDC/EURC', 'EURC/USDC', 'USDC/MXNB', 'USDC/JPYC'];

export default function RateChart() {
  const [rates, setRates] = useState(null);
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState('USDC/EURC');
  const [refreshing, setRefreshing] = useState(false);

  const fetchRates = async () => {
    try {
      const data = await getRates();
      setRates(data);
      if (data[selected]) {
        setHistory(prev => [
          ...prev.slice(-19),
          { time: new Date().toLocaleTimeString(), value: parseFloat(data[selected]) },
        ]);
      }
    } catch (err) {
      console.error('Rate fetch error:', err);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, [selected]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try { await refreshRates(); await fetchRates(); }
    finally { setRefreshing(false); }
  };

  const currentRate = rates?.[selected];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">Live FX Rates</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="text-xs text-slate-400 hover:text-white transition-colors disabled:opacity-50"
        >
          {refreshing ? 'Refreshing...' : '↻ Refresh'}
        </button>
      </div>

      {/* Pair selector */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {PAIRS.map(pair => (
          <button
            key={pair}
            onClick={() => setSelected(pair)}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              selected === pair
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {pair}
          </button>
        ))}
      </div>

      {/* Current rate display */}
      <div className="mb-4">
        <span className="text-3xl font-bold text-white">
          {currentRate ? parseFloat(currentRate).toFixed(4) : '—'}
        </span>
        <span className="text-slate-500 text-sm ml-2">{selected}</span>
      </div>

      {/* Sparkline */}
      {history.length > 1 ? (
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={history}>
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <XAxis dataKey="time" hide />
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#94a3b8' }}
              itemStyle={{ color: '#60a5fa' }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-20 flex items-center justify-center text-xs text-slate-600">
          Collecting rate history...
        </div>
      )}

      <p className="text-xs text-slate-600 mt-2">
        Updated: {rates?.updatedAt ? new Date(rates.updatedAt).toLocaleTimeString() : '—'} · Polls every 30s
      </p>
    </div>
  );
}
