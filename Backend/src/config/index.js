require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  circle: {
    apiKey: process.env.CIRCLE_API_KEY,
    baseUrl: process.env.CIRCLE_BASE_URL || 'https://api-sandbox.circle.com',
    entitySecret: process.env.CIRCLE_ENTITY_SECRET,
    walletSetId: process.env.CIRCLE_WALLET_SET_ID,
    agentWalletId: process.env.CIRCLE_AGENT_WALLET_ID,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
  supportedTokens: ['USDC', 'EURC', 'MXNB', 'JPYC', 'PHPC', 'AUDF', 'QCAD'],
  pollInterval: 30000,
};
