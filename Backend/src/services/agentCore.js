const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const fxMonitor = require('./fxMonitor');
const policyEngine = require('./policyEngine');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const SYSTEM_PROMPT = `You are AutoFX Agent on Arc blockchain. Analyze FX rates and policies. Be concise.`;

async function analyzeMarket() {
  const rates = fxMonitor.getRates();
  const policies = policyEngine.listPolicies();
  const history = policyEngine.getHistory().slice(0, 5);
  const prompt = `${SYSTEM_PROMPT}\nRates: ${JSON.stringify(rates)}\nPolicies: ${JSON.stringify(policies)}\nHistory: ${JSON.stringify(history)}\nAnalyze market in under 150 words.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function getAgentInsight(question) {
  const rates = fxMonitor.getRates();
  const history = policyEngine.getHistory().slice(0, 10);
  const prompt = `${SYSTEM_PROMPT}\nRates: ${JSON.stringify(rates)}\nHistory: ${JSON.stringify(history)}\nQuestion: ${question}\nAnswer concisely.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { analyzeMarket, getAgentInsight };
