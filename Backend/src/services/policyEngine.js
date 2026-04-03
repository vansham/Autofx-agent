const db = require('./db');
const x402Handler = require('./x402Handler');

async function evaluate(rates) {
  const activePolicies = db.getPolicies().filter(p => p.active);
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
        db.updatePolicy(policy.id, { lastTriggered: new Date().toISOString() });
        db.addTransaction({
          id: tx.id,
          policyId: policy.id,
          policyName: policy.name,
          pair: policy.pair,
          amount: policy.amount,
          rate,
          status: 'CONFIRMED',
          txHash: tx.txHash,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error(`[Policy Engine] Swap failed:`, err.message);
      }
    }

    if (policy.lastTriggered) {
      const elapsed = Date.now() - new Date(policy.lastTriggered).getTime();
      if (elapsed > 5 * 60 * 1000) db.updatePolicy(policy.id, { lastTriggered: null });
    }
  }
}

function listPolicies() { return db.getPolicies(); }
function getPolicy(id) { return db.getPolicy(id); }
function createPolicy({ name, pair, condition, threshold, amount }) {
  const policy = {
    id: `pol_${Date.now()}`,
    name, pair, condition,
    threshold: parseFloat(threshold),
    amount: parseFloat(amount),
    active: true,
    lastTriggered: null,
    createdAt: new Date().toISOString(),
  };
  return db.addPolicy(policy);
}
function updatePolicy(id, updates) { return db.updatePolicy(id, updates); }
function deletePolicy(id) { return db.deletePolicy(id); }
function getHistory() { return db.getTransactions(); }

module.exports = { evaluate, listPolicies, getPolicy, createPolicy, updatePolicy, deletePolicy, getHistory };
