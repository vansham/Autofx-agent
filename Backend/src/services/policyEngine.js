const x402Handler = require('./x402Handler');

// In-memory policy store (replace with DB in production)
let policies = [];
let txHistory = [];

// Evaluate all active policies against current rates
async function evaluate(rates) {
  const activePolicies = policies.filter(p => p.active);
  for (const policy of activePolicies) {
    const rate = parseFloat(rates[policy.pair]);
    if (!rate) continue;

    let conditionMet = false;
    switch (policy.condition) {
      case 'gt': conditionMet = rate > policy.threshold; break;
      case 'lt': conditionMet = rate < policy.threshold; break;
      case 'gte': conditionMet = rate >= policy.threshold; break;
      case 'lte': conditionMet = rate <= policy.threshold; break;
    }

    if (conditionMet && !policy.lastTriggered) {
      console.log(`[Policy Engine] Policy "${policy.name}" triggered at rate ${rate}`);
      try {
        const tx = await x402Handler.executeSwap({
          policyId: policy.id,
          pair: policy.pair,
          amount: policy.amount,
          rate,
        });
        policy.lastTriggered = new Date().toISOString();
        txHistory.unshift({
          id: tx.id || `tx_${Date.now()}`,
          policyId: policy.id,
          policyName: policy.name,
          pair: policy.pair,
          amount: policy.amount,
          rate,
          status: tx.status || 'PENDING',
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error(`[Policy Engine] Swap failed for policy ${policy.id}:`, err.message);
      }
    }

    // Reset trigger lock after 5 minutes to allow re-trigger
    if (policy.lastTriggered) {
      const elapsed = Date.now() - new Date(policy.lastTriggered).getTime();
      if (elapsed > 5 * 60 * 1000) policy.lastTriggered = null;
    }
  }
}

function listPolicies() { return policies; }

function getPolicy(id) { return policies.find(p => p.id === id); }

function createPolicy({ name, pair, condition, threshold, amount }) {
  const policy = {
    id: `pol_${Date.now()}`,
    name,
    pair,         // e.g. "USDC/EURC"
    condition,    // "gt" | "lt" | "gte" | "lte"
    threshold: parseFloat(threshold),
    amount: parseFloat(amount),
    active: true,
    lastTriggered: null,
    createdAt: new Date().toISOString(),
  };
  policies.push(policy);
  return policy;
}

function updatePolicy(id, updates) {
  const idx = policies.findIndex(p => p.id === id);
  if (idx === -1) return null;
  policies[idx] = { ...policies[idx], ...updates };
  return policies[idx];
}

function deletePolicy(id) {
  const idx = policies.findIndex(p => p.id === id);
  if (idx === -1) return false;
  policies.splice(idx, 1);
  return true;
}

function getHistory() { return txHistory; }

module.exports = {
  evaluate,
  listPolicies,
  getPolicy,
  createPolicy,
  updatePolicy,
  deletePolicy,
  getHistory,
};
