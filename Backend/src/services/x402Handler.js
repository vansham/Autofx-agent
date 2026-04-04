const { initiateDeveloperControlledWalletsClient } = require('@circle-fin/developer-controlled-wallets');
require('dotenv').config();

const TOKEN_IDS = {
  USDC: '15dc2b5d-0994-58b0-bf8c-3a0501148ee8',
  EURC: '4ea52a96-e6ae-56dc-8336-385bb238755f',
};

function getClient() {
  return initiateDeveloperControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET,
  });
}

async function executeSwap({ policyId, pair, amount, rate }) {
  const [fromToken] = pair.split('/');
  console.log(`[x402] Initiating REAL swap: ${amount} ${fromToken} on Arc Testnet`);
  const tokenId = TOKEN_IDS[fromToken];
  if (!tokenId) throw new Error(`Unknown token: ${fromToken}`);
  const client = getClient();
  const res = await client.createTransaction({
    walletId: process.env.CIRCLE_AGENT_WALLET_ID,
    tokenId,
    destinationAddress: process.env.CIRCLE_RECEIVER_ADDRESS,
    amounts: [String(amount)],
    fee: { type: 'level', config: { feeLevel: 'MEDIUM' } },
  });
  console.log('[x402] Full response:', JSON.stringify(res.data, null, 2));
  const tx = res.data?.transaction || res.data;
  const txId = tx?.id;
  if (!txId) throw new Error('No transaction ID returned');
  console.log(`[x402] Submitted! ID: ${txId}`);
  let confirmed = tx;
  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const check = await client.getTransaction({ id: txId });
    confirmed = check.data?.transaction || check.data;
    console.log(`[x402] State: ${confirmed?.state}`);
    if (['COMPLETE', 'CONFIRMED'].includes(confirmed?.state)) break;
    if (confirmed?.state === 'FAILED') throw new Error('Transaction failed');
  }
  console.log(`[x402] CONFIRMED! TxHash: ${confirmed?.txHash}`);
  return {
    id: txId,
    policyId,
    pair,
    amount,
    rate,
    fromToken,
    toToken: pair.split('/')[1],
    status: 'CONFIRMED',
    txHash: confirmed?.txHash,
    settledAt: new Date().toISOString(),
  };
}

module.exports = { executeSwap };
