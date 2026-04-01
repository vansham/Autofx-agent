const { ChatAnthropic } = require('@langchain/anthropic');
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');
const config = require('../config');
const fxMonitor = require('./fxMonitor');
const policyEngine = require('./policyEngine');

const model = new ChatAnthropic({
  apiKey: config.anthropic.apiKey,
  model: 'claude-sonnet-4-20250514',
  maxTokens: 1024,
});

const SYSTEM_PROMPT = `You are AutoFX Agent — an autonomous FX trading assistant running on Arc blockchain.
You monitor stablecoin FX rates and execute swaps based on user-defined policies.
You have access to real-time rates and transaction history.
Be concise, data-driven, and always explain your actions clearly.
When suggesting policy changes, provide specific numbers based on current market data.`;

// Natural language analysis of current market + policies
async function analyzeMarket() {
  const rates = fxMonitor.getRates();
  const policies = policyEngine.listPolicies();
  const history = policyEngine.getHistory().slice(0, 5);

  const prompt = `
Current FX Rates:
${JSON.stringify(rates, null, 2)}

Active Policies (${policies.filter(p => p.active).length}):
${JSON.stringify(policies, null, 2)}

Recent Transactions (last 5):
${JSON.stringify(history, null, 2)}

Analyze the current market situation and provide:
1. Brief market summary
2. Which policies are close to triggering
3. Any recommended policy adjustments
Keep response under 150 words.`;

  const response = await model.invoke([
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(prompt),
  ]);

  return response.content;
}

// Generate a natural language summary of agent activity
async function getAgentInsight(question) {
  const rates = fxMonitor.getRates();
  const history = policyEngine.getHistory().slice(0, 10);

  const response = await model.invoke([
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(`
Context:
- Current rates: ${JSON.stringify(rates)}
- Recent tx history: ${JSON.stringify(history)}

User question: ${question}

Answer concisely based on the data above.`),
  ]);

  return response.content;
}

module.exports = { analyzeMarket, getAgentInsight };
