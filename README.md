# 🤖 AutoFX Agent

> Autonomous FX trading agent on Arc blockchain — set policies, agent executes swaps automatically using x402 protocol + Circle MPC Wallets.

**Built for [Agentic Commerce on Arc Hackathon](https://lablab.ai/event/agentic-commerce-on-arc) — April 20–26, 2026**

---

## 🎥 Demo

<!-- Add demo video link here -->

## ✨ What It Does

AutoFX Agent monitors stablecoin FX rates 24/7 and autonomously executes swaps when user-defined conditions are met — **zero human intervention required**.

1. User sets a policy: *"Swap 10 USDC → EURC when rate > 1.08"*
2. Agent polls FX rates every 30 seconds
3. Condition met → x402 payment protocol triggers
4. Circle MPC Wallet signs transaction
5. Arc Testnet settles in < 1 second
6. Transaction logged with real txHash

## 🏗️ Architecture                                                                                                                                                                                                 React Dashboard → Node.js Backend → Circle SDK → Arc Testnet
↓
Groq AI (LLaMA) → Market Analysis
↓
x402 Protocol → USDC Transfer                                                                                                                                                                                     ## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| AI Agent | Groq LLaMA 3.1 (market analysis) |
| Payments | x402 Protocol (HTTP-native) |
| Wallets | Circle Developer-Controlled Wallets (MPC) |
| Blockchain | Arc Testnet (Circle L1) |
| Settlement | USDC native gas |
| Storage | LowDB (persistent policies) |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Circle Developer Console account
- Groq API key (free)

### Backend
```bash
cd Backend
npm install
cp .env.example .env
# Fill in your API keys
node src/index.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`

## ⚙️ Environment Variables

```env
CIRCLE_API_KEY=TEST_API_KEY:xxx:xxx
CIRCLE_ENTITY_SECRET=xxx
CIRCLE_WALLET_SET_ID=xxx
CIRCLE_AGENT_WALLET_ID=xxx
CIRCLE_RECEIVER_ADDRESS=xxx
GROQ_API_KEY=xxx
PORT=4000
```

## 🔑 Key Features

- **Autonomous Execution** — zero clicks after policy set
- **Real On-chain Transactions** — actual USDC transfers on Arc Testnet
- **x402 Protocol** — HTTP-native payment standard
- **AI Market Analysis** — Groq LLaMA analyzes live FX data
- **Policy Engine** — rule-based guardrails (rate threshold, amount limits)
- **Persistent Storage** — policies survive server restarts
- **Bloomberg UI** — real-time rate ticker, area charts

## 📊 Supported Pairs

- USDC/EURC
- EURC/USDC  
- USDC/MXNB
- USDC/JPYC

## 🏆 Hackathon Tracks

- ✅ Best Trustless AI Agent
- ✅ Best Autonomous Commerce Application

## 📄 License

MIT
