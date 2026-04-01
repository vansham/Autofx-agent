const express = require('express');
const router = express.Router();
const policyEngine = require('../services/policyEngine');

// GET /api/v1/policies
router.get('/', (req, res) => {
  res.json(policyEngine.listPolicies());
});

// GET /api/v1/policies/:id
router.get('/:id', (req, res) => {
  const policy = policyEngine.getPolicy(req.params.id);
  if (!policy) return res.status(404).json({ error: 'Policy not found' });
  res.json(policy);
});

// POST /api/v1/policies
router.post('/', (req, res) => {
  const { name, pair, condition, threshold, amount } = req.body;
  if (!name || !pair || !condition || threshold == null || !amount) {
    return res.status(400).json({ error: 'name, pair, condition, threshold, amount are required' });
  }
  const validPairs = ['USDC/EURC', 'EURC/USDC', 'USDC/MXNB', 'USDC/JPYC'];
  if (!validPairs.includes(pair)) {
    return res.status(400).json({ error: `Invalid pair. Valid: ${validPairs.join(', ')}` });
  }
  const validConditions = ['gt', 'lt', 'gte', 'lte'];
  if (!validConditions.includes(condition)) {
    return res.status(400).json({ error: `Invalid condition. Valid: ${validConditions.join(', ')}` });
  }
  const policy = policyEngine.createPolicy({ name, pair, condition, threshold, amount });
  res.status(201).json(policy);
});

// PATCH /api/v1/policies/:id
router.patch('/:id', (req, res) => {
  const policy = policyEngine.updatePolicy(req.params.id, req.body);
  if (!policy) return res.status(404).json({ error: 'Policy not found' });
  res.json(policy);
});

// DELETE /api/v1/policies/:id
router.delete('/:id', (req, res) => {
  const deleted = policyEngine.deletePolicy(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Policy not found' });
  res.json({ success: true });
});

// GET /api/v1/policies/history
router.get('/tx/history', (req, res) => {
  res.json(policyEngine.getHistory());
});

module.exports = router;
