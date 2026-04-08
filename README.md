# 🤖 AutoFX Agent

> Autonomous FX trading agent on Arc blockchain — set policies, agent executes swaps automatically using x402 protocol + Circle MPC Wallets.

**Built for [Agentic Economy on Arc Hackathon](https://lablab.ai/ai-hackathons/nano-payments-arc) — April 20–26, 2026**

---

## 🎥 Demo Video

<!-- Add YouTube/Loom link here -->

---

## 🌟 Problem Statement

Traditional FX trading requires constant human monitoring. AutoFX Agent solves this by running **fully autonomously** — monitoring stablecoin rates 24/7 and executing swaps the moment your conditions are met. No clicks. No waiting. Just results.

---

## ✨ How It Works

```
User sets policy → Agent monitors rates → Condition met → x402 triggers → Arc settles → Done
```

1. Set a policy: *"Swap 10 USDC → EURC when rate > 1.08"*
2. Agent polls live FX rates every 30 seconds
3. Condition met → x402 HTTP payment protocol triggers
4. Circle MPC Wallet signs transaction autonomously
5. Arc Testnet settles in **< 1 second**
6. Real txHash logged — verifiable on Arc Explorer

---

## 🏗️ Architecture

```
React Dashboard (Bloomberg Terminal UI)
         ↓ REST API
Node.js Backend (Port 4000)
    ├── Policy Engine     (rule evaluation)
    ├── FX Monitor        (CoinGecko, 30s polling)
    ├── AI Agent          (Groq LLaMA 3.1 - market analysis)
    └── x402 Handler      (HTTP-native payments)
         ↓ Circle SDK
Circle Developer-Controlled Wallets (MPC)
         ↓
Arc Testnet (USDC native gas, sub-second finality)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| AI Analysis | Groq LLaMA 3.1-8b-instant |
| Payments | x402 Protocol (HTTP-native) |
| Wallets | Circle Developer-Controlled Wallets (MPC) |
| Blockchain | Arc Testnet (Circle L1) |
| Gas Token | USDC (native on Arc) |
| Storage | LowDB (persistent policies) |

---

## 🔑 Key Features

- **Truly Autonomous** — zero clicks after policy deployed
- **Real On-chain Transactions** — actual USDC transfers on Arc Testnet with real txHash
- **x402 Protocol** — HTTP-native payment standard for agentic commerce
- **AI Market Analysis** — Groq LLaMA analyzes live FX data in real-time
- **Policy Engine** — rule-based guardrails (pair, condition, threshold, amount)
- **Persistent Storage** — policies survive server restarts
- **Bloomberg Terminal UI** — live rate ticker, area charts, real-time updates

---

## 📊 Supported Stablecoin Pairs

| Pair | Description |
|---|---|
| USDC/EURC | Dollar → Euro |
| EURC/USDC | Euro → Dollar |
| USDC/MXNB | Dollar → Mexican Peso |
| USDC/JPYC | Dollar → Japanese Yen |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Circle Developer Console account → [console.circle.com](https://console.circle.com)
- Groq API key (free) → [console.groq.com](https://console.groq.com)

### 1. Clone the repo
```bash
git clone https://github.com/vansham/Autofx-agent.git
cd Autofx-agent
```

### 2. Backend Setup
```bash
cd Backend
npm install
cp .env.example .env
# Fill in your API keys
node src/index.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` 🎉

---

## ⚙️ Environment Variables

```env
# Circle (get from console.circle.com)
CIRCLE_API_KEY=TEST_API_KEY:id:secret
CIRCLE_ENTITY_SECRET=your_entity_secret
CIRCLE_WALLET_SET_ID=your_wallet_set_id
CIRCLE_AGENT_WALLET_ID=your_agent_wallet_id
CIRCLE_RECEIVER_ADDRESS=your_receiver_address

# Groq AI (get from console.groq.com - free)
GROQ_API_KEY=your_groq_key

# App
PORT=4000
```

---

## 🏆 Hackathon Tracks

- ✅ **Best Trustless AI Agent** — policy-driven autonomous FX execution with guardrails
- ✅ **Best Autonomous Commerce Application** — buyer agent executing real on-chain swaps

---

## 🔗 Links

- [Arc Testnet Explorer](https://explorer-sandbox.circle.com)
- [Circle Developer Docs](https://developers.circle.com)
- [x402 Protocol](https://github.com/coinbase/x402)
- [Arc Network](https://arc.network)
- [Hackathon Page](https://lablab.ai/ai-hackathons/nano-payments-arc)

---

## 📄 License

MIT — open source as required for hackathon submission.
