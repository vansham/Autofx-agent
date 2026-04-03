import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getRates, refreshRates } from '../lib/api';

const PAIRS = ['USDC/EURC', 'EURC/USDC', 'USDC/MXNB', 'USDC/JPYC'];
const COLORS = { 'USDC/EURC': '#58a6ff', 'EURC/USDC': '#3fb950', 'USDC/MXNB': '#bc8cff', 'USDC/JPYC': '#d29922' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded p-2 text-xs font-mono" style={{ background: '#1c2432', border: '1px solid #2d4a6e' }}>
      <p style={{ color: '#8b949e' }}>{label}</p>
      <p style={{ color: payload[0]?.color }}>{parseFloat(payload[0]?.value).toFixed(4)}</p>
    </div>
  );
};

export default function RateChart() {
  const [rates, setRates] = useState(null);
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState('USDC/EURC');
  const [refreshing, setRefreshing] = useState(false);
  const [change, setChange] = useState(null);

  const fetchRates = async () => {
    try {
      const data = await getRates();
      setRates(data);
      if (data[selected]) {
        const val = parseFloat(data[selected]);
        setHistory(prev => {
          if (prev.length > 1) {
            const first = prev[0].value;
            setChange(((val - first) / first * 100).toFixed(3));
          }
          return [...prev.slice(-29), { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), value: val }];
        });
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchRates();
    const i = setInterval(fetchRates, 30000);
    return () => clearInterval(i);
  }, [selected]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try { await refreshRates(); await fetchRates(); }
    finally { setRefreshing(false); }
  };

  const currentRate = rates?.[selected];
  const color = COLORS[selected];
  const isPositive = change >= 0;

  return (
    <div className="card p-5 animate-fade-in-delay-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-sm">Live FX Rates</h2>
        <button onClick={handleRefresh} disabled={refreshing}
          className="text-xs font-mono transition-colors disabled:opacity-50"
          style={{ color: 'var(--text-muted)' }}>
          {refreshing ? 'fetching...' : '↻ refresh'}
        </button>
      </div>

      {/* Pair tabs */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {PAIRS.map(pair => (
          <button key={pair} onClick={() => setSelected(pair)}
            className="text-xs font-mono px-2.5 py-1 rounded transition-all"
            style={selected === pair
              ? { background: `${COLORS[pair]}18`, color: COLORS[pair], border: `1px solid ${COLORS[pair]}40` }
              : { background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            {pair}
          </button>
        ))}
      </div>

      {/* Rate display */}
      <div className="flex items-end gap-3 mb-4">
        <span className="font-mono text-4xl font-bold" style={{ color }}>
          {currentRate ? parseFloat(currentRate).toFixed(4) : '-.----'}
        </span>
        {change !== null && (
          <span className={`font-mono text-xs mb-1.5 px-2 py-0.5 rounded ${isPositive ? 'badge-green' : 'badge-red'}`}>
            {isPositive ? '▲' : '▼'} {Math.abs(change)}%
          </span>
        )}
      </div>

      {/* Chart */}
      {history.length > 1 ? (
        <ResponsiveContainer width="100%" height={90}>
          <AreaChart data={history} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${selected}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.5}
              fill={`url(#grad-${selected})`} dot={false} />
            <XAxis dataKey="time" hide />
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip content={<CustomTooltip />} />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-20 flex items-center justify-center font-mono text-xs"
          style={{ color: 'var(--text-muted)' }}>
          collecting data<span style={{ animation: 'blink 1s infinite' }}>_</span>
        </div>
      )}

      <p className="text-xs font-mono mt-2" style={{ color: 'var(--text-muted)' }}>
        updated {rates?.updatedAt ? new Date(rates.updatedAt).toLocaleTimeString() : '—'} · polls every 30s
      </p>
    </div>
  );
}
