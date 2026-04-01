import { useState } from 'react';
import AgentStatus from '../components/AgentStatus';
import RateChart from '../components/RateChart';
import PolicyForm from '../components/PolicyForm';
import PolicyList from '../components/PolicyList';

export default function Dashboard() {
  const [policyRefresh, setPolicyRefresh] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Autonomous FX agent running on Arc — set policies, agent executes.
        </p>
      </div>

      {/* Top row: Agent status + Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AgentStatus />
        <RateChart />
      </div>

      {/* Bottom row: Create policy + Policy list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PolicyForm onCreated={() => setPolicyRefresh(r => r + 1)} />
        <PolicyList refresh={policyRefresh} />
      </div>
    </div>
  );
}
