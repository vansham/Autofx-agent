const circleClient = require('./circleClient');
const config = require('../config');

/**
 * x402 Protocol — HTTP-native payment flow
 * 1. Agent requests a resource/service
 * 2. Server responds 402 Payment Required with payment details
 * 3. Agent signs USDC payment via Circle MPC Wallet
 * 4. Arc settles in < 1 second
 * 5. Agent retries original request with payment proof
 */

async function executeSwap({ policyId, pair, amount, rate }) {
  const [fromToken, toToken] = pair.split('/');
  console.log(`[x402] Initiating swap: ${amount} ${fromToken} → ${toToken} @ ${rate}`);

  // Step 1: Simulate x402 payment request
  // In production: POST to actual x402-enabled swap service
  const paymentRequest = await requestSwapQuote({ fromToken, toToken, amount });

  // Step 2: Sign and broadcast payment via Circle MPC Wallet
  const payment = await signAndPay(paymentRequest);

  // Step 3: Return transaction details
  return {
    id: payment.id,
    policyId,
    pair,
    amount,
    rate,
    fromToken,
    toToken,
    status: payment.status,
    txHash: payment.txHash,
    settledAt: new Date().toISOString(),
  };
}

async function requestSwapQuote({ fromToken, toToken, amount }) {
  // Simulated x402 quote response (replace with actual x402 endpoint)
  return {
    paymentId: `pay_${Date.now()}`,
    fromToken,
    toToken,
    amount,
    destinationAddress: '0xSwapContractAddressOnArc',
    expiresAt: new Date(Date.now() + 30000).toISOString(),
  };
}

async function signAndPay(paymentRequest) {
  try {
    // Use Circle MPC Wallet to sign and broadcast
    if (config.circle.agentWalletId && config.circle.apiKey !== 'your_circle_api_key_here') {
      const tx = await circleClient.transferTokens({
        sourceWalletId: config.circle.agentWalletId,
        destinationAddress: paymentRequest.destinationAddress,
        tokenId: paymentRequest.fromToken,
        amount: String(paymentRequest.amount),
      });
      return { id: tx.id, status: tx.state, txHash: tx.txHash };
    }
    // Dev mode: simulate successful payment
    return {
      id: `tx_sim_${Date.now()}`,
      status: 'CONFIRMED',
      txHash: `0x${Math.random().toString(16).slice(2)}`,
    };
  } catch (err) {
    console.error('[x402] Payment failed:', err.message);
    throw err;
  }
}

module.exports = { executeSwap };
