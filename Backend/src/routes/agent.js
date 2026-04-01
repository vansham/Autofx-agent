const express = require('express');
const router = express.Router();
const agentCore = require('../services/agentCore');
const fxMonitor = require('../services/fxMonitor');

// GET /api/v1/agent/status
router.get('/status', (req, res) => {
  res.json({
    ...fxMonitor.getStatus(),
    message: 'AutoFX Agent running on Arc Testnet',
  });
});

// POST /api/v1/agent/start
router.post('/start', (req, res) => {
  fxMonitor.start();
  res.json({ success: true, message: 'Agent started' });
});

// POST /api/v1/agent/stop
router.post('/stop', (req, res) => {
  fxMonitor.stop();
  res.json({ success: true, message: 'Agent stopped' });
});

// GET /api/v1/agent/analyze
router.get('/analyze', async (req, res) => {
  try {
    const analysis = await agentCore.analyzeMarket();
    res.json({ analysis });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/agent/ask
router.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'question is required' });
  try {
    const answer = await agentCore.getAgentInsight(question);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
