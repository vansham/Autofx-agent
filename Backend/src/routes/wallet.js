const express = require('express');
const router = express.Router();
const { initiateDeveloperControlledWalletsClient } = require('@circle-fin/developer-controlled-wallets');
require('dotenv').config();

function getClient() {
  return initiateDeveloperControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET,
  });
}

// GET /api/v1/wallet/balance
router.get('/balance', async (req, res) => {
  try {
    const client = getClient();
    const data = await client.getWalletTokenBalance({
      id: process.env.CIRCLE_AGENT_WALLET_ID,
    });
    const balances = (data.data?.tokenBalances || []).map(b => ({
      token: { symbol: b.token?.symbol, id: b.token?.id },
      amount: parseFloat(b.amount).toFixed(2),
    }));
    res.json({ balances });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/wallet/info
router.get('/info', async (req, res) => {
  try {
    const client = getClient();
    const data = await client.listWallets({
      walletSetId: process.env.CIRCLE_WALLET_SET_ID,
    });
    const wallets = (data.data?.wallets || []).map(w => ({
      id: w.id,
      address: w.address,
      name: w.name || 'Unnamed',
      blockchain: w.blockchain,
      state: w.state,
    }));
    res.json({ wallets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/wallet/send
router.post('/send', async (req, res) => {
  try {
    const { toAddress, amount, tokenSymbol } = req.body;
    if (!toAddress || !amount || !tokenSymbol) {
      return res.status(400).json({ error: 'toAddress, amount, tokenSymbol required' });
    }

    const TOKEN_IDS = {
      USDC: '15dc2b5d-0994-58b0-bf8c-3a0501148ee8',
      EURC: '4ea52a96-e6ae-56dc-8336-385bb238755f',
    };

    const tokenId = TOKEN_IDS[tokenSymbol];
    if (!tokenId) return res.status(400).json({ error: 'Unsupported token' });

    const client = getClient();
    const tx = await client.createTransaction({
      walletId: process.env.CIRCLE_AGENT_WALLET_ID,
      tokenId,
      destinationAddress: toAddress,
      amounts: [String(amount)],
      fee: { type: 'level', config: { feeLevel: 'MEDIUM' } },
    });

    res.json({ success: true, transaction: tx.data?.transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/wallet/faucet
router.post('/faucet', async (req, res) => {
  try {
    const axios = require('axios');
    // Circle testnet faucet
    const response = await axios.post(
      'https://api-sandbox.circle.com/v1/faucet/drips',
      {
        address: process.env.CIRCLE_RECEIVER_ADDRESS || req.body.address,
        blockchain: 'ARC-TESTNET',
        usdc: true,
        native: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CIRCLE_API_KEY?.split(':').slice(1).join(':')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json({ success: true, data: response.data });
  } catch (err) {
    // Fallback — direct faucet link
    res.json({
      success: false,
      faucetUrl: `https://faucet.circle.com/?address=${process.env.CIRCLE_AGENT_WALLET_ID}`,
      message: 'Visit faucet manually',
    });
  }
});

module.exports = router;
