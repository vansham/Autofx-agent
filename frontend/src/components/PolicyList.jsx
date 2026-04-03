import { useState, useEffect } from 'react';
import { getPolicies, updatePolicy, deletePolicy } from '../lib/api';

const cond = { gt: '>', lt: '<', gte: '≥', lte: '≤' };

export default function PolicyList({ refresh }) {
  const [policies, setPolicies] = useState([]);

  const fetch = async () => {
    try { setPolicies(await getPolicies()); }
    catch (err) { console.error(err); }
  };

  useEffect(() => { fetch(); }, [refresh]);

  const toggle = async (p) => { await updatePolicy(p.id, { active: !p.active }); fetch(); };
  const remove = async (id) => { if (!confirm('Delete policy?')) return; await deletePolicy(id); fetch(); };

  const active = policies.filter(p => p.active).length;

  return (
    <div className="card p-5 animate-fade-in-delay-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-sm">Active Policies</h2>
        <span className="font-mono text-xs px-2 py-0.5 rounded badge-blue">{active}/{policies.length} active</span>
      </div>

      {!policies.length ? (
        <div className="text-center py-6">
          <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>no policies deployed</p>
          <p className="font-mono text-xs mt-1" style={{ color: 'var(--text-muted)' }}>create one to start trading autonomously</p>
        </div>
      ) : (
        <div className="space-y-2">
          {policies.map((p, i) => (
            <div key={p.id} className="rounded p-3 transition-all"
              style={{ background: 'var(--bg-secondary)', border: `1px solid ${p.active ? 'rgba(88,166,255,0.2)' : 'var(--border)'}`,
                animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-medium text-white truncate">{p.name}</p>
                    {p.lastTriggered && (
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded badge-green shrink-0">triggered</span>
                    )}
                  </div>
                  <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                    swap <span className="text-blue-400">{p.amount} {p.pair.split('/')[0]}</span>
                    {' '}when{' '}
                    <span className="text-white">{p.pair}</span>
                    {' '}
                    <span className="text-yellow-400">{cond[p.condition]} {p.threshold}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => toggle(p)}
                    className="text-xs font-mono px-2 py-1 rounded transition-all"
                    style={p.active
                      ? { background: 'rgba(63,185,80,0.1)', color: '#3fb950', border: '1px solid rgba(63,185,80,0.25)' }
                      : { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                    {p.active ? 'on' : 'off'}
                  </button>
                  <button onClick={() => remove(p.id)}
                    className="text-xs font-mono w-6 h-6 flex items-center justify-center rounded transition-colors"
                    style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
