import { useState, useEffect } from 'react';
import { getAgentStatus, startAgent, stopAgent, analyzeMarket } from '../lib/api';

export default function AgentStatus() {
  const [status, setStatus] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const fetchStatus = async () => {
    try {
      const data = await getAgentStatus();
      setStatus(data);
    } catch {
      setStatus({ isRunning: false, lastUpdate: null });
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggle = async () => {
    try {
      if (status?.isRunning) await stopAgent();
      else await startAgent();
      fetchStatus();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyze = async () => {
    setLoadingAnalysis(true);
    try {
      const res = await analyzeMarket();
      setAnalysis(res.analysis);
    } catch {
      setAnalysis('Failed to get analysis. Check GEMINI_API_KEY in .env');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-white font-semibold">Agent Status</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Last update: {status?.lastUpdate ? new Date(status.lastUpdate).toLocaleTimeString() : '—'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${
            status?.isRunning ? 'bg-green-900/40 text-green-400' : 'bg-slate-800 text-slate-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status?.isRunning ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
            {status?.isRunning ? 'Active' : 'Paused'}
          </div>
          <button
            onClick={toggle}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              status?.isRunning
                ? 'bg-red-900/40 text-red-400 hover:bg-red-900/60'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {status?.isRunning ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>

      {/* AI Analysis */}
      <button
        onClick={handleAnalyze}
        disabled={loadingAnalysis}
        className="w-full text-xs text-slate-400 border border-slate-700 rounded-lg px-3 py-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
      >
        {loadingAnalysis ? 'Analyzing market...' : '✦ Ask agent to analyze market'}
      </button>
      {analysis && (
        <div className="mt-3 text-xs text-slate-300 bg-slate-800/60 rounded-lg p-3 leading-relaxed">
          {analysis}
        </div>
      )}
    </div>
  );
}
