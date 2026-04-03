import { useState, useEffect } from 'react';
import { getAgentStatus, startAgent, stopAgent, analyzeMarket } from '../lib/api';

export default function AgentStatus() {
  const [status, setStatus] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const fetchStatus = async () => {
    try { setStatus(await getAgentStatus()); }
    catch { setStatus({ isRunning: false, lastUpdate: null }); }
  };

  useEffect(() => {
    fetchStatus();
    const i = setInterval(fetchStatus, 10000);
    return () => clearInterval(i);
  }, []);

  const toggle = async () => {
    try {
      if (status?.isRunning) await stopAgent();
      else await startAgent();
      fetchStatus();
    } catch (err) { console.error(err); }
  };

  const handleAnalyze = async () => {
    setLoadingAnalysis(true);
    try { setAnalysis((await analyzeMarket()).analysis); }
    catch { setAnalysis('Rate limit hit. Try again in 1 minute.'); }
    finally { setLoadingAnalysis(false); }
  };

  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-white font-semibold text-sm">Agent Status</h2>
            {status?.isRunning && (
              <span className="w-2 h-2 rounded-full bg-green-400"
                style={{ animation: 'pulse-green 2s infinite' }} />
            )}
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {status?.lastUpdate
              ? `Last poll: ${new Date(status.lastUpdate).toLocaleTimeString()}`
              : 'Not started'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono px-2 py-1 rounded ${status?.isRunning ? 'badge-green' : 'badge-red'}`}>
            {status?.isRunning ? 'ACTIVE' : 'STOPPED'}
          </span>
          <button onClick={toggle}
            className={`text-xs px-3 py-1.5 rounded font-medium transition-all border ${
              status?.isRunning
                ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                : 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10'
            }`}>
            {status?.isRunning ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'NETWORK', value: 'Arc Testnet' },
          { label: 'INTERVAL', value: '30s' },
          { label: 'PROTOCOL', value: 'x402' },
        ].map(({ label, value }) => (
          <div key={label} className="rounded p-2.5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <p className="text-xs font-mono text-blue-400">{value}</p>
          </div>
        ))}
      </div>

      <button onClick={handleAnalyze} disabled={loadingAnalysis}
        className="w-full text-xs py-2 rounded transition-all font-mono disabled:opacity-50"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
        {loadingAnalysis
          ? <span>analyzing<span style={{ animation: 'blink 1s infinite' }}>_</span></span>
          : '✦ AI market analysis'}
      </button>

      {analysis && (
        <div className="mt-3 text-xs rounded p-3 leading-relaxed font-mono"
          style={{ background: 'rgba(63,185,80,0.05)', border: '1px solid rgba(63,185,80,0.15)', color: '#7ee787' }}>
          {analysis}
        </div>
      )}
    </div>
  );
}
