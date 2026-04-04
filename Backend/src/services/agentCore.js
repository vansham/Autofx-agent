const Groq = require('groq-sdk');
require('dotenv').config();
const fxMonitor = require('./fxMonitor');
const policyEngine = require('./policyEngine');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are AutoFX Agent on Arc blockchain. Analyze FX rates and policies. Be concise under 150 words.`;

async function analyzeMarket() {
  const rates = fxMonitor.getRates();
  const policies = policyEngine.listPolicies();
  const history = policyEngine.getHistory().slice(0, 5);
  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Rates: ${JSON.stringify(rates)}\nPolicies: ${JSON.stringify(policies)}\nHistory: ${JSON.stringify(history)}\nAnalyze market briefly.` }
    ],
    max_tokens: 200,
  });
  return response.choices[0].message.content;
}

async function getAgentInsight(question) {
  const rates = fxMonitor.getRates();
  const history = policyEngine.getHistory().slice(0, 10);
  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Rates: ${JSON.stringify(rates)}\nHistory: ${JSON.stringify(history)}\nQuestion: ${question}` }
    ],
    max_tokens: 200,
  });
  return response.choices[0].message.content;
}

module.exports = { analyzeMarket, getAgentInsight };
