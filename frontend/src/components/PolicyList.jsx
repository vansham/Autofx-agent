import { useState, useEffect } from 'react';
import { getPolicies, updatePolicy, deletePolicy } from '../lib/api';

export default function PolicyList({ refresh }) {
  const [policies, setPolicies] = useState([]);

  const fetchPolicies = async () => {
    try {
      const data = await getPolicies();
      setPolicies(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchPolicies(); }, [refresh]);

  const toggleActive = async (policy) => {
    await updatePolicy(policy.id, { active: !policy.active });
    fetchPolicies();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this policy?')) return;
    await deletePolicy(id);
    fetchPolicies();
  };

  const conditionLabel = { gt: '>', lt: '<', gte: '≥', lte: '≤' };

  if (!policies.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h2 className="text-white font-semibold mb-3">Active Policies</h2>
        <p className="text-sm text-slate-500">No policies yet. Create one above.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h2 className="text-white font-semibold mb-4">Active Policies ({policies.filter(p => p.active).length}/{policies.length})</h2>
      <div className="space-y-3">
        {policies.map(policy => (
          <div key={policy.id} className="flex items-center justify-between bg-slate-800/60 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm text-white font-medium">{policy.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Swap <span className="text-blue-400">{policy.amount} {policy.pair.split('/')[0]}</span> when{' '}
                <span className="text-white">{policy.pair}</span>{' '}
                <span className="text-yellow-400">{conditionLabel[policy.condition]} {policy.threshold}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              {policy.lastTriggered && (
                <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full">Triggered</span>
              )}
              <button
                onClick={() => toggleActive(policy)}
                className={`text-xs px-2 py-1 rounded-md transition-colors ${
                  policy.active
                    ? 'bg-green-900/40 text-green-400 hover:bg-green-900/60'
                    : 'bg-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {policy.active ? 'On' : 'Off'}
              </button>
              <button
                onClick={() => handleDelete(policy.id)}
                className="text-xs text-slate-600 hover:text-red-400 transition-colors px-1"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
