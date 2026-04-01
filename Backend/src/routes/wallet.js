const express = require('express');
const router = express.Router();
const circleClient = require('../services/circleClient');
const config = require('../config');

// GET /api/v1/wallet/balance
router.get('/balance', async (req, res) => {
  try {
    const walletId = req.query.walletId || config.circle.agentWalletId;
    if (!walletId || walletId === 'your_agent_wallet_id_here') {
      // Return mock data in dev mode
      return res.json({
        balances: [
          { token: { symbol: 'USDC' }, amount: '100.00' },
          { token: { symbol: 'EURC' }, amount: '0.00' },
        ],
        note: 'Mock data — set CIRCLE_AGENT_WALLET_ID in .env',
      });
    }
    const balances = await circleClient.getWalletBalance(walletId);
    res.json({ balances });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/wallet/list
router.get('/list', async (req, res) => {
  try {
    const walletSetId = config.circle.walletSetId;
    if (!walletSetId || walletSetId === 'your_wallet_set_id_here') {
      return res.json({ wallets: [], note: 'Set CIRCLE_WALLET_SET_ID in .env' });
    }
    const wallets = await circleClient.listWallets(walletSetId);
    res.json({ wallets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/wallet/create
router.post('/create', async (req, res) => {
  try {
    const { name } = req.body;
    const wallet = await circleClient.createWallet(config.circle.walletSetId, name || 'autofx-agent-wallet');
    res.status(201).json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
