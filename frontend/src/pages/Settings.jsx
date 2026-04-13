import { useState, useEffect } from 'react';
import { getWalletBalance } from '../lib/api';
import axios from 'axios';

export default function Settings() {
  const [balances, setBalances] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendForm, setSendForm] = useState({ toAddress: '', amount: '', tokenSymbol: 'USDC' });
  const [sending, setSending] = useState(false);
  const [faucetLoading, setFaucetLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [txResult, setTxResult] = useState(null);
  const [activeTab, setActiveTab] = useState('wallet');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    Promise.all([
      getWalletBalance().then(d => setBalances(d.balances || [])),
      axios.get('/api/v1/wallet/info').then(d => setWallets(d.data.wallets || [])),
    ]).finally(() => setLoading(false));
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await axios.post('/api/v1/wallet/send', sendForm);
      setTxResult(res.data.transaction);
      showToast('Transaction submitted!');
      setSendForm({ toAddress: '', amount: '', tokenSymbol: 'USDC' });
      // Refresh balance
      getWalletBalance().then(d => setBalances(d.balances || []));
    } catch (err) {
      showToast(err.response?.data?.error || 'Send failed');
    } finally { setSending(false); }
  };

  const handleFaucet = async () => {
    setFaucetLoading(true);
    try {
      const res = await axios.post('/api/v1/wallet/faucet', {});
      if (res.data.success) {
        showToast('USDC requested from faucet!');
      } else {
        window.open(res.data.faucetUrl, '_blank');
        showToast('Opened faucet in new tab');
      }
    } catch { showToast('Faucet failed — try faucet.circle.com'); }
    finally { setFaucetLoading(false); }
  };

  const copyText = (text) => { navigator.clipboard.writeText(text); showToast('Copied!'); };

  const inputClass = "w-full text-sm font-mono rounded px-3 py-2 outline-none transition-all";
  const inputStyle = { background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' };
  const tabs = ['wallet', 'send', 'environment', 'resources'];

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 font-mono text-xs px-4 py-2 rounded badge-green"
          style={{ animation: 'fadeInUp 0.3s ease' }}>✓ {toast}</div>
      )}

      <div>
        <h1 className="text-lg font-semibold text-white">Settings</h1>
        <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
          wallet management and configuration
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="text-xs font-mono px-4 py-2 transition-all capitalize"
            style={activeTab === tab
              ? { color: 'var(--accent-blue)', borderBottom: '2px solid var(--accent-blue)', marginBottom: '-1px' }
              : { color: 'var(--text-muted)' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* WALLET TAB */}
      {activeTab === 'wallet' && (
        <div className="space-y-4">
          {/* Balances */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Agent Wallet Balances</h2>
              <button onClick={handleFaucet} disabled={faucetLoading}
                className="text-xs font-mono px-3 py-1.5 rounded transition-all disabled:opacity-50"
                style={{ background: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.3)', color: '#3fb950' }}>
                {faucetLoading ? 'requesting...' : '⬇ Get Testnet USDC'}
              </button>
            </div>
            {loading ? (
              <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>loading...</p>
            ) : (
              <div className="space-y-2">
                {balances.map((b, i) => (
                  <div key={i} className="flex justify-between items-center px-4 py-3 rounded"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold"
                        style={{ background: 'rgba(88,166,255,0.15)', color: 'var(--accent-blue)' }}>
                        {b.token?.symbol?.[0]}
                      </div>
                      <span className="font-mono text-xs text-white">{b.token?.symbol}</span>
                    </div>
                    <span className="font-mono text-sm font-bold" style={{ color: 'var(--accent-green)' }}>
                      {b.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wallet Addresses */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Wallet Addresses</h2>
            {wallets.length === 0 ? (
              <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>loading...</p>
            ) : (
              <div className="space-y-3">
                {wallets.map((w, i) => (
                  <div key={w.id} className="rounded p-3"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white">
                        {i === 0 ? '🤖 Agent Wallet' : `💼 Wallet ${i + 1}`}
                      </span>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${w.state === 'LIVE' ? 'badge-green' : 'badge-yellow'}`}>
                        {w.state}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono flex-1 truncate" style={{ color: 'var(--text-muted)' }}>
                        {w.address}
                      </code>
                      <button onClick={() => copyText(w.address)}
                        className="text-xs shrink-0 hover:text-white transition-colors"
                        style={{ color: 'var(--text-muted)' }}>⎘</button>
                      <a href={`https://explorer-sandbox.circle.com/address/${w.address}`}
                        target="_blank" rel="noreferrer"
                        className="text-xs shrink-0 hover:text-blue-400 transition-colors"
                        style={{ color: 'var(--text-muted)' }}>↗</a>
                    </div>
                    <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
                      {w.blockchain}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEND TAB */}
      {activeTab === 'send' && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Send Tokens</h2>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="text-xs font-mono mb-1 block" style={{ color: 'var(--text-muted)' }}>TO_ADDRESS</label>
              <input className={inputClass} style={inputStyle}
                placeholder="0x..."
                value={sendForm.toAddress}
                onChange={e => setSendForm(f => ({ ...f, toAddress: e.target.value }))}
                required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono mb-1 block" style={{ color: 'var(--text-muted)' }}>TOKEN</label>
                <select className={inputClass} style={inputStyle}
                  value={sendForm.tokenSymbol}
                  onChange={e => setSendForm(f => ({ ...f, tokenSymbol: e.target.value }))}>
                  <option>USDC</option>
                  <option>EURC</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-mono mb-1 block" style={{ color: 'var(--text-muted)' }}>AMOUNT</label>
                <input className={inputClass} style={inputStyle}
                  type="number" step="0.01" placeholder="0.00"
                  value={sendForm.amount}
                  onChange={e => setSendForm(f => ({ ...f, amount: e.target.value }))}
                  required />
              </div>
            </div>

            {txResult && (
              <div className="rounded p-3 font-mono text-xs"
                style={{ background: 'rgba(63,185,80,0.05)', border: '1px solid rgba(63,185,80,0.2)' }}>
                <p style={{ color: 'var(--accent-green)' }}>✓ Submitted!</p>
                <p style={{ color: 'var(--text-muted)' }}>ID: {txResult.id?.slice(0, 20)}...</p>
                <p style={{ color: 'var(--text-muted)' }}>State: {txResult.state}</p>
              </div>
            )}

            <button type="submit" disabled={sending}
              className="w-full text-xs font-mono py-2.5 rounded transition-all disabled:opacity-50"
              style={{ background: 'rgba(88,166,255,0.1)', border: '1px solid rgba(88,166,255,0.3)', color: '#58a6ff' }}>
              {sending ? 'sending...' : '→ send transaction'}
            </button>
          </form>
        </div>
      )}

      {/* ENVIRONMENT TAB */}
      {activeTab === 'environment' && (
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
            <p className="text-white">GROQ_API_KEY=<span style={{ color: 'var(--accent-yellow)' }}>gsk_...</span></p>
            <p className="text-white">CIRCLE_WALLET_SET_ID=<span style={{ color: 'var(--accent-yellow)' }}>...</span></p>
          </div>
        </div>
      )}

      {/* RESOURCES TAB */}
      {activeTab === 'resources' && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Resources</h2>
          {[
            ['Circle Console', 'https://console.circle.com'],
            ['Arc Testnet Faucet', 'https://faucet.circle.com'],
            ['Arc Testnet Explorer', 'https://explorer-sandbox.circle.com'],
            ['Arc Docs', 'https://developers.circle.com/arc'],
            ['x402 Protocol', 'https://github.com/coinbase/x402'],
            ['Hackathon Page', 'https://lablab.ai/ai-hackathons/nano-payments-arc'],
          ].map(([label, url]) => (
            <a key={url} href={url} target="_blank" rel="noreferrer"
              className="flex items-center justify-between py-2.5 transition-colors group"
              style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="font-mono text-xs text-white group-hover:text-blue-400 transition-colors">{label}</span>
              <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>↗</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
