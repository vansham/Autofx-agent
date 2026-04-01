import { useState, useEffect } from 'react';
import { getTxHistory } from '../lib/api';

const statusColor = {
  CONFIRMED: 'text-green-400 bg-green-900/30',
  PENDING: 'text-yellow-400 bg-yellow-900/30',
  FAILED: 'text-red-400 bg-red-900/30',
};

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTxHistory()
      .then(setHistory)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Transaction History</h1>
        <p className="text-sm text-slate-500 mt-1">All swaps executed by the agent on Arc Testnet.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading...</div>
        ) : history.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No transactions yet. Create a policy and let the agent run.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs text-slate-500 px-5 py-3 font-medium">Policy</th>
                <th className="text-left text-xs text-slate-500 px-5 py-3 font-medium">Pair</th>
                <th className="text-left text-xs text-slate-500 px-5 py-3 font-medium">Amount</th>
                <th className="text-left text-xs text-slate-500 px-5 py-3 font-medium">Rate</th>
                <th className="text-left text-xs text-slate-500 px-5 py-3 font-medium">Status</th>
                <th className="text-left text-xs text-slate-500 px-5 py-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {history.map((tx, i) => (
                <tr key={tx.id || i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3 text-slate-300">{tx.policyName}</td>
                  <td className="px-5 py-3 text-blue-400">{tx.pair}</td>
                  <td className="px-5 py-3 text-white">{tx.amount}</td>
                  <td className="px-5 py-3 text-slate-300">{parseFloat(tx.rate).toFixed(4)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[tx.status] || 'text-slate-400'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
