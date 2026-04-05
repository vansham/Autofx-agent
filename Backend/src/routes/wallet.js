const express = require('express');
const router = express.Router();
const circleClient = require('../services/circleClient');
const config = require('../config');

router.get('/balance', async (req, res) => {
  try {
    const walletId = req.query.walletId || config.circle.agentWalletId;
    if (!walletId || walletId === 'your_agent_wallet_id_here') {
      return res.json({
        balances: [
          { token: { symbol: 'USDC' }, amount: '100.00' },
          { token: { symbol: 'EURC' }, amount: '0.00' },
        ],
        note: 'Mock data — set CIRCLE_AGENT_WALLET_ID in .env',
      });
    }
    const data = await circleClient.getWalletBalance(walletId);
    const balances = (data.tokenBalances || []).map(b => ({
      token: { symbol: b.token?.symbol },
      amount: parseFloat(b.amount).toFixed(2),
    }));
    res.json({ balances });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/list', async (req, res) => {
  try {
    const wallets = await circleClient.listWallets(config.circle.walletSetId);
    res.json({ wallets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
