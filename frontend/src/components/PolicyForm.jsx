import { useState } from 'react';
import { createPolicy } from '../lib/api';

const PAIRS = ['USDC/EURC', 'EURC/USDC', 'USDC/MXNB', 'USDC/JPYC'];
const CONDITIONS = [
  { value: 'gt', label: '> greater than' },
  { value: 'lt', label: '< less than' },
  { value: 'gte', label: '>= greater or equal' },
  { value: 'lte', label: '<= less or equal' },
];

export default function PolicyForm({ onCreated }) {
  const [form, setForm] = useState({ name: '', pair: 'USDC/EURC', condition: 'gt', threshold: '', amount: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(false); setLoading(true);
    try {
      const policy = await createPolicy(form);
      onCreated?.(policy);
      setForm({ name: '', pair: 'USDC/EURC', condition: 'gt', threshold: '', amount: '' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create policy');
    } finally { setLoading(false); }
  };

  const inputClass = "w-full text-sm font-mono rounded px-3 py-2 outline-none transition-all";
  const inputStyle = { background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' };

  return (
    <div className="card p-5 animate-fade-in-delay-2">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-white font-semibold text-sm">New Policy</h2>
        <span className="text-xs font-mono px-2 py-0.5 rounded badge-blue">Autonomous</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-mono mb-1 block" style={{ color: 'var(--text-muted)' }}>POLICY_NAME</label>
          <input className={inputClass} style={inputStyle}
            placeholder="e.g. Buy EURC on dip"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-mono mb-1 block" style={{ color: 'var(--text-muted)' }}>PAIR</label>
            <select className={inputClass} style={inputStyle}
              value={form.pair} onChange={e => setForm(f => ({ ...f, pair: e.target.value }))}>
              {PAIRS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-mono mb-1 block" style={{ color: 'var(--text-muted)' }}>CONDITION</label>
            <select className={inputClass} style={inputStyle}
              value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}>
              {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-mono mb-1 block" style={{ color: 'var(--text-muted)' }}>RATE_THRESHOLD</label>
            <input className={inputClass} style={inputStyle}
              type="number" step="0.0001" placeholder="1.0800"
              value={form.threshold}
              onChange={e => setForm(f => ({ ...f, threshold: e.target.value }))}
              required />
          </div>
          <div>
            <label className="text-xs font-mono mb-1 block" style={{ color: 'var(--text-muted)' }}>AMOUNT_USDC</label>
            <input className={inputClass} style={inputStyle}
              type="number" step="0.01" placeholder="10.00"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              required />
          </div>
        </div>

        {error && <p className="text-xs font-mono" style={{ color: 'var(--accent-red)' }}>✗ {error}</p>}

        <button type="submit" disabled={loading}
          className="w-full text-xs font-mono py-2.5 rounded font-medium transition-all disabled:opacity-50"
          style={success
            ? { background: 'rgba(63,185,80,0.15)', border: '1px solid rgba(63,185,80,0.4)', color: '#3fb950' }
            : { background: 'rgba(88,166,255,0.1)', border: '1px solid rgba(88,166,255,0.3)', color: '#58a6ff' }}>
          {loading ? 'deploying...' : success ? '✓ policy deployed' : '+ deploy policy'}
        </button>
      </form>
    </div>
  );
}
