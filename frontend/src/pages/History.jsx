import { useState, useEffect } from 'react';
import { getTxHistory } from '../lib/api';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTxHistory().then(setHistory).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold text-white">Transaction History</h1>
        <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
          autonomous swaps executed on Arc Testnet
        </p>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            loading<span style={{ animation: 'blink 1s infinite' }}>_</span>
          </div>
        ) : !history.length ? (
          <div className="p-8 text-center">
            <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>no transactions yet</p>
            <p className="font-mono text-xs mt-1" style={{ color: 'var(--text-muted)' }}>deploy a policy and let the agent run</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Policy', 'Pair', 'Amount', 'Rate', 'TxHash', 'Status', 'Time'].map(h => (
                  <th key={h} className="text-left font-mono text-xs px-4 py-3"
                    style={{ color: 'var(--text-muted)' }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((tx, i) => (
                <tr key={tx.id || i}
                  style={{ borderBottom: '1px solid rgba(30,45,61,0.5)' }}
                  className="transition-colors hover:bg-white/2">
                  <td className="px-4 py-3 text-xs text-white font-medium">{tx.policyName}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs badge-blue px-2 py-0.5 rounded">{tx.pair}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-white">{tx.amount}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--accent-green)' }}>
                    {parseFloat(tx.rate).toFixed(4)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                    {tx.txHash
                      ? <a href={`https://explorer.arc.network/tx/${tx.txHash}`} target="_blank" rel="noreferrer"
                          className="hover:text-blue-400 transition-colors">
                          {tx.txHash.slice(0, 8)}...{tx.txHash.slice(-4)} ↗
                        </a>
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                      tx.status === 'CONFIRMED' ? 'badge-green' : tx.status === 'PENDING' ? 'badge-yellow' : 'badge-red'
                    }`}>{tx.status}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(tx.createdAt).toLocaleTimeString()}
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
