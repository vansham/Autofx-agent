const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');
const fxMonitor = require('./fxMonitor');
const policyEngine = require('./policyEngine');

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const SYSTEM_PROMPT = `You are AutoFX Agent — an autonomous FX trading assistant running on Arc blockchain.
You monitor stablecoin FX rates and execute swaps based on user-defined policies.
Be concise, data-driven, and always explain your actions clearly.
When suggesting policy changes, provide specific numbers based on current market data.`;

async function analyzeMarket() {
  const rates = fxMonitor.getRates();
  const policies = policyEngine.listPolicies();
  const history = policyEngine.getHistory().slice(0, 5);
  const prompt = `${SYSTEM_PROMPT}
Current FX Rates: ${JSON.stringify(rates, null, 2)}
Active Policies: ${JSON.stringify(policies, null, 2)}
Recent Transactions: ${JSON.stringify(history, null, 2)}
Analyze market, which policies close to triggering, any recommendations. Under 150 words.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function getAgentInsight(question) {
  const rates = fxMonitor.getRates();
  const history = policyEngine.getHistory().slice(0, 10);
  const prompt = `${SYSTEM_PROMPT}
Rates: ${JSON.stringify(rates)}
History: ${JSON.stringify(history)}
Question: ${question}
Answer concisely.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { analyzeMarket, getAgentInsight };
