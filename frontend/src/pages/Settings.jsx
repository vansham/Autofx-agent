import { useState, useEffect } from 'react';
import { getWalletBalance } from '../lib/api';

export default function Settings() {
  const [balances, setBalances] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWalletBalance()
      .then(data => { setBalances(data.balances?.tokenBalances || data.balances || []); setNote(data.note || ''); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-lg font-semibold text-white">Settings</h1>
        <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
          wallet info and environment configuration
        </p>
      </div>

      {/* Wallet Balances */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Agent Wallet</h2>
        {loading ? (
          <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            loading<span style={{ animation: 'blink 1s infinite' }}>_</span>
          </p>
        ) : (
          <>
            {note && (
              <div className="mb-3 text-xs font-mono px-3 py-2 rounded badge-yellow">
                ⚠ {note}
              </div>
            )}
            <div className="space-y-2">
              {balances.map((b, i) => (
                <div key={i} className="flex justify-between items-center px-4 py-3 rounded"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <span className="font-mono text-xs text-white">{b.token?.symbol || 'Unknown'}</span>
                  <span className="font-mono text-xs" style={{ color: 'var(--accent-green)' }}>{b.amount}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Env Config */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Environment</h2>
        {[
          ['NETWORK', 'Arc Testnet'],
          ['BACKEND_PORT', '4000'],
          ['API_PREFIX', '/api/v1'],
          ['POLL_INTERVAL', '30s'],
          ['PROTOCOL', 'x402'],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-2.5"
            style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{k}</span>
            <span className="font-mono text-xs" style={{ color: 'var(--accent-blue)' }}>{v}</span>
          </div>
        ))}
        <div className="mt-4 rounded p-4 text-xs font-mono space-y-1"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)' }}># backend/.env</p>
          <p className="text-white">CIRCLE_API_KEY=<span style={{ color: 'var(--accent-yellow)' }}>TEST_API_KEY:...</span></p>
          <p className="text-white">CIRCLE_ENTITY_SECRET=<span style={{ color: 'var(--accent-yellow)' }}>...</span></p>
          <p className="text-white">GEMINI_API_KEY=<span style={{ color: 'var(--accent-yellow)' }}>AIza...</span></p>
          <p className="text-white">CIRCLE_WALLET_SET_ID=<span style={{ color: 'var(--accent-yellow)' }}>...</span></p>
        </div>
      </div>

      {/* Links */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Resources</h2>
        {[
          ['Circle Console', 'https://console.circle.com'],
          ['Arc Testnet Faucet', 'https://faucet.circle.com'],
          ['Arc Docs', 'https://developers.circle.com/arc'],
          ['x402 Protocol', 'https://github.com/coinbase/x402'],
          ['Hackathon Page', 'https://lablab.ai/event/agentic-commerce-on-arc'],
        ].map(([label, url]) => (
          <a key={url} href={url} target="_blank" rel="noreferrer"
            className="flex items-center justify-between py-2.5 transition-colors group"
            style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="font-mono text-xs text-white group-hover:text-blue-400 transition-colors">{label}</span>
            <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
