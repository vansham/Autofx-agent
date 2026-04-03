const { initiateDeveloperControlledWalletsClient } = require('@circle-fin/developer-controlled-wallets');
const config = require('../config');

function getClient() {
  if (
    !config.circle.apiKey ||
    config.circle.apiKey === 'your_circle_api_key_here' ||
    !config.circle.entitySecret ||
    config.circle.entitySecret === 'your_entity_secret_here'
  ) {
    return null;
  }
  return initiateDeveloperControlledWalletsClient({
    apiKey: config.circle.apiKey,
    entitySecret: config.circle.entitySecret,
  });
}

async function getWalletBalance(walletId) {
  const client = getClient();
  if (!client) return mockBalance();
  const res = await client.getWalletTokenBalance({ id: walletId });
  return res.data;
}

async function listWallets(walletSetId) {
  const client = getClient();
  if (!client) return [];
  const res = await client.listWallets({ walletSetId });
  return res.data?.wallets || [];
}

async function createWalletSet(name) {
  const client = getClient();
  if (!client) throw new Error('Circle client not configured');
  const res = await client.createWalletSet({ name });
  return res.data?.walletSet;
}

async function createWallet(walletSetId, name) {
  const client = getClient();
  if (!client) throw new Error('Circle client not configured');
  const res = await client.createWallets({
    walletSetId,
    blockchains: ['ARC-TESTNET'],
    count: 1,
    metadata: [{ name, refId: name }],
  });
  return res.data?.wallets?.[0];
}

async function transferTokens({ sourceWalletId, destinationAddress, tokenId, amount }) {
  const client = getClient();
  if (!client) throw new Error('Circle client not configured');
  const res = await client.createTransaction({
    walletId: sourceWalletId,
    tokenId,
    destinationAddress,
    amounts: [String(amount)],
    fee: { type: 'level', config: { feeLevel: 'MEDIUM' } },
  });
  return res.data?.transaction;
}

async function getTransaction(txId) {
  const client = getClient();
  if (!client) throw new Error('Circle client not configured');
  const res = await client.getTransaction({ id: txId });
  return res.data?.transaction;
}

function mockBalance() {
  return {
    tokenBalances: [
      { token: { symbol: 'USDC', decimals: 6 }, amount: '100.000000' },
      { token: { symbol: 'EURC', decimals: 6 }, amount: '0.000000' },
    ],
    _mock: true,
  };
}

module.exports = {
  getClient,
  getWalletBalance,
  listWallets,
  createWalletSet,
  createWallet,
  transferTokens,
  getTransaction,
};
