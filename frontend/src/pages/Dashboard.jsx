import { useState } from 'react';
import AgentStatus from '../components/AgentStatus';
import RateChart from '../components/RateChart';
import PolicyForm from '../components/PolicyForm';
import PolicyList from '../components/PolicyList';

export default function Dashboard() {
  const [policyRefresh, setPolicyRefresh] = useState(0);
  const [toast, setToast] = useState('');

  const handlePolicyCreated = (policy) => {
    setPolicyRefresh(r => r + 1);
    setToast(`Policy "${policy.name}" deployed!`);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-4 right-4 z-50 font-mono text-xs px-4 py-2 rounded badge-green"
          style={{ animation: 'fadeInUp 0.3s ease' }}>
          ✓ {toast}
        </div>
      )}

      <div>
        <h1 className="text-lg font-semibold text-white">Dashboard</h1>
        <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Autonomous FX agent running on Arc — set policies, agent executes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AgentStatus />
        <RateChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PolicyForm onCreated={handlePolicyCreated} />
        <PolicyList refresh={policyRefresh} />
      </div>
    </div>
  );
}
