import { useState, useEffect } from 'react';
import { getWalletBalance } from '../lib/api';

export default function Settings() {
  const [balances, setBalances] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWalletBalance()
      .then(data => {
        setBalances(data.balances || []);
        setNote(data.note || '');
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const InfoRow = ({ label, value, mono }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-800">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`text-sm text-white ${mono ? 'font-mono text-xs bg-slate-800 px-2 py-1 rounded' : ''}`}>{value}</span>
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Wallet info and environment configuration.</p>
      </div>

      {/* Wallet Balances */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h2 className="text-white font-semibold mb-4">Agent Wallet Balances</h2>
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : (
          <>
            {note && <p className="text-xs text-yellow-400 mb-3 bg-yellow-900/20 px-3 py-2 rounded-lg">{note}</p>}
            <div className="space-y-2">
              {balances.map((b, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-800/60 rounded-lg px-4 py-3">
                  <span className="text-sm font-medium text-white">{b.token?.symbol || 'Unknown'}</span>
                  <span className="text-sm text-blue-400 font-mono">{b.amount}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Environment config guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h2 className="text-white font-semibold mb-4">Environment Setup</h2>
        <div>
          <InfoRow label="Network" value="Arc Testnet" />
          <InfoRow label="Backend Port" value="4000" />
          <InfoRow label="API Prefix" value="/api/v1" mono />
          <InfoRow label="Poll Interval" value="30 seconds" />
        </div>
        <div className="mt-4 bg-slate-800 rounded-lg p-4 text-xs font-mono text-slate-300 space-y-1">
          <p className="text-slate-500"># backend/.env</p>
          <p>CIRCLE_API_KEY=<span className="text-yellow-400">your_key</span></p>
          <p>CIRCLE_BASE_URL=https://api-sandbox.circle.com</p>
          <p>ANTHROPIC_API_KEY=<span className="text-yellow-400">your_key</span></p>
          <p>CIRCLE_WALLET_SET_ID=<span className="text-yellow-400">from_console</span></p>
          <p>CIRCLE_AGENT_WALLET_ID=<span className="text-yellow-400">from_console</span></p>
        </div>
      </div>

      {/* Links */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h2 className="text-white font-semibold mb-4">Quick Links</h2>
        {[
          ['Circle Console', 'https://console.circle.com'],
          ['Circle Docs', 'https://developers.circle.com'],
          ['Arc Testnet Faucet', 'https://faucet.circle.com'],
          ['Hackathon Page', 'https://lablab.ai/event/agentic-commerce-on-arc'],
          ['x402 Protocol', 'https://github.com/coinbase/x402'],
        ].map(([label, url]) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between py-2.5 border-b border-slate-800 hover:text-blue-400 transition-colors group"
          >
            <span className="text-sm text-slate-300 group-hover:text-blue-400">{label}</span>
            <span className="text-xs text-slate-600">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
