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
  const [form, setForm] = useState({
    name: '',
    pair: 'USDC/EURC',
    condition: 'gt',
    threshold: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const policy = await createPolicy(form);
      onCreated?.(policy);
      setForm({ name: '', pair: 'USDC/EURC', condition: 'gt', threshold: '', amount: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create policy');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition-colors';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h2 className="text-white font-semibold mb-4">New Policy</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Policy Name</label>
          <input
            className={inputClass}
            placeholder='e.g. "Buy EURC when rate dips"'
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Pair</label>
            <select
              className={inputClass}
              value={form.pair}
              onChange={e => setForm(f => ({ ...f, pair: e.target.value }))}
            >
              {PAIRS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Condition</label>
            <select
              className={inputClass}
              value={form.condition}
              onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}
            >
              {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Rate Threshold</label>
            <input
              className={inputClass}
              type="number"
              step="0.0001"
              placeholder="e.g. 1.08"
              value={form.threshold}
              onChange={e => setForm(f => ({ ...f, threshold: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Amount (USDC)</label>
            <input
              className={inputClass}
              type="number"
              step="0.01"
              placeholder="e.g. 10"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              required
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating...' : '+ Create Policy'}
        </button>
      </form>
    </div>
  );
}
