require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  circle: {
    apiKey: process.env.CIRCLE_API_KEY,
    baseUrl: process.env.CIRCLE_BASE_URL || 'https://api-sandbox.circle.com',
    walletSetId: process.env.CIRCLE_WALLET_SET_ID,
    agentWalletId: process.env.CIRCLE_AGENT_WALLET_ID,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
  },
  // Supported stablecoins on Arc
  supportedTokens: ['USDC', 'EURC', 'MXNB', 'JPYC', 'PHPC', 'AUDF', 'QCAD'],
  // FX polling interval (ms)
  pollInterval: 30000,
};
