const express = require('express');
const router = express.Router();
const fxMonitor = require('../services/fxMonitor');

// GET /api/v1/rates
router.get('/', (req, res) => {
  res.json(fxMonitor.getRates());
});

// POST /api/v1/rates/refresh
router.post('/refresh', async (req, res) => {
  try {
    const rates = await fxMonitor.fetchRates();
    res.json(rates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
