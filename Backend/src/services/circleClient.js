const axios = require('axios');
const config = require('../config');

const client = axios.create({
  baseURL: config.circle.baseUrl,
  headers: {
    Authorization: `Bearer ${config.circle.apiKey}`,
    'Content-Type': 'application/json',
  },
});

// Get wallet balance
async function getWalletBalance(walletId) {
  const res = await client.get(`/v1/wallets/${walletId}/balances`);
  return res.data.data;
}

// List all wallets in a wallet set
async function listWallets(walletSetId) {
  const res = await client.get(`/v1/wallets`, {
    params: { walletSetId },
  });
  return res.data.data;
}

// Create a new wallet
async function createWallet(walletSetId, name) {
  const res = await client.post('/v1/wallets', {
    walletSetId,
    blockchains: ['ARC-TESTNET'],
    metadata: [{ name, refId: name }],
    count: 1,
  });
  return res.data.data;
}

// Get transaction by id
async function getTransaction(txId) {
  const res = await client.get(`/v1/transactions/${txId}`);
  return res.data.data;
}

// Transfer tokens between wallets
async function transferTokens({ sourceWalletId, destinationAddress, tokenId, amount }) {
  const res = await client.post('/v1/transactions/transfer', {
    walletId: sourceWalletId,
    destinationAddress,
    tokenId,
    amounts: [amount],
    fee: { type: 'level', config: { feeLevel: 'MEDIUM' } },
  });
  return res.data.data;
}

module.exports = {
  getWalletBalance,
  listWallets,
  createWallet,
  getTransaction,
  transferTokens,
};
