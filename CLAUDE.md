# 🤖 AutoFX Agent — Project Memory File
> Last Updated: March 29, 2026  
> Developer: Vansham  
> Status: 🟡 Setup Phase (API Key just created)

---

## 📌 Project Summary

**AutoFX Agent** ek AI-powered autonomous FX trading agent hai jo:
- 24/7 stablecoin FX rates monitor karta hai
- User-defined policies ke basis pe automatically swaps execute karta hai
- Circle's x402 protocol se bina human intervention ke payments karta hai
- Arc blockchain pe sub-second settlement hota hai

**One-liner:** *"Set your FX policy, agent does the rest — autonomously."*

---

## 🏆 Hackathon Details

| Field | Detail |
|---|---|
| **Event** | Agentic Commerce on Arc Hackathon |
| **Platform** | lablab.ai |
| **Online Build** | April 20–25, 2026 |
| **On-site Demo** | April 26, 2026 (San Francisco) |
| **Prize Pool** | $10,000 USDC |
| **Bonus Prize** | $40,000 Google Cloud credits (best Gemini use) |
| **Target Tracks** | Best Trustless AI Agent + Best Autonomous Commerce App |
| **Submit URL** | lablab.ai/event/agentic-commerce-on-arc |

---

## 🔑 Circle Console Setup Status

| Item | Status |
|---|---|
| Circle Console Account | ✅ Done |
| Testnet Wallet | ✅ Created |
| USDC Testnet Balance | ✅ Have it |
| API Key (autofx-agent) | ✅ Just Created |
| Standard Key, No IP restriction | ✅ Configured |
| Network | Testnet |

### Credentials (store in .env)
```env
CIRCLE_API_KEY=your_api_key_here
CIRCLE_BASE_URL=https://api-sandbox.circle.com
NETWORK=testnet
PORT=4000
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React)                   │
│  - Policy Dashboard (set FX rules)                   │
│  - Live Rate Monitor                                 │
│  - Transaction History                               │
│  - Agent Status (active/paused)                      │
└───────────────────┬─────────────────────────────────┘
                    │ REST API
┌───────────────────▼─────────────────────────────────┐
│                  BACKEND (Node.js)                   │
│  Port: 4000  |  Prefix: /api/v1                     │
│                                                      │
│  ┌─────────────┐    ┌──────────────┐                │
│  │ Policy      │    │ FX Rate      │                │
│  │ Engine      │    │ Monitor      │                │
│  └──────┬──────┘    └──────┬───────┘                │
│         │                  │                         │
│  ┌──────▼──────────────────▼───────┐                │
│  │         AI Agent Core           │                │
│  │    (LangChain + Claude API)     │                │
│  └──────────────┬──────────────────┘                │
│                 │                                    │
│  ┌──────────────▼──────────────────┐                │
│  │      x402 Payment Handler       │                │
│  │   (Circle MPC Wallet + Arc)     │                │
│  └─────────────────────────────────┘                │
└─────────────────────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│              CIRCLE / ARC LAYER                      │
│  - Circle Wallets API (MPC, no private key storage)  │
│  - x402 Protocol (HTTP-native payments)              │
│  - Arc Testnet (USDC native gas, sub-1s settlement)  │
│  - Stablecoins: USDC, EURC, MXNB, JPYC, etc.       │
└─────────────────────────────────────────────────────┘
```

---

## 🧩 How It Works (User Flow)

```
1. User opens dashboard
2. User sets policy: "Swap USDC → EURC when rate > 1.08"
3. Agent starts monitoring FX rates every 30 seconds
4. Rate condition met → Agent triggers
5. x402 HTTP call → Payment Required response
6. Agent signs USDC payment via Circle MPC Wallet
7. Arc settles in < 1 second
8. User gets notification + transaction logged
```

---

## 📁 Project Structure

```
autofx-agent/
├── backend/
│   ├── src/
│   │   ├── index.js              # Entry point, port 4000
│   │   ├── routes/
│   │   │   ├── agent.js          # Agent start/stop/status
│   │   │   ├── policy.js         # CRUD for user policies
│   │   │   ├── wallet.js         # Circle wallet operations
│   │   │   └── rates.js          # FX rate fetching
│   │   ├── services/
│   │   │   ├── circleClient.js   # Circle API wrapper
│   │   │   ├── fxMonitor.js      # Rate polling service
│   │   │   ├── agentCore.js      # LangChain AI agent
│   │   │   ├── x402Handler.js    # Payment execution
│   │   │   └── policyEngine.js   # Rule evaluation
│   │   └── config/
│   │       └── index.js          # Env vars, constants
│   ├── .env                      # API keys (never commit!)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Main policy + status view
│   │   │   ├── History.jsx       # Transaction log
│   │   │   └── Settings.jsx      # Wallet + preferences
│   │   └── components/
│   │       ├── PolicyForm.jsx
│   │       ├── RateChart.jsx
│   │       └── AgentStatus.jsx
│   └── package.json
│
├── CLAUDE.md                     # ← This file (project memory)
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React + Tailwind CSS |
| **Backend** | Node.js + Express |
| **AI Agent** | LangChain.js + Claude API (claude-sonnet-4) |
| **Payments** | x402 Protocol |
| **Wallets** | Circle Programmable Wallets (MPC) |
| **Blockchain** | Arc Testnet |
| **Settlement** | USDC (native gas on Arc) |
| **FX Data** | Circle StableFX API / CoinGecko fallback |
| **Deployment** | Koyeb (free tier, no card required) |

---

## 📦 NPM Packages Needed

### Backend
```bash
npm install express cors dotenv axios
npm install @circle-fin/circle-sdk
npm install langchain @langchain/anthropic
npm install node-cron          # for rate polling
npm install supabase           # optional: transaction history
```

### Frontend
```bash
npm install react react-dom
npm install axios recharts     # charts for FX rates
npm install tailwindcss
```

---

## 🗓️ Build Timeline

| Phase | Dates | Tasks |
|---|---|---|
| **Setup** | Mar 29 – Apr 5 | ✅ API Key, project scaffold, Circle SDK test |
| **Core** | Apr 6 – Apr 13 | Agent logic, FX monitor, x402 payments |
| **Polish** | Apr 14 – Apr 19 | Frontend dashboard, testing, demo video |
| **Submit** | Apr 20 | lablab.ai submission with GitHub + demo |

---

## 🔗 Important Links

| Resource | URL |
|---|---|
| Circle Developer Console | console.circle.com |
| Circle API Docs | developers.circle.com |
| Arc Testnet Docs | developers.circle.com/arc |
| x402 Protocol | github.com/coinbase/x402 |
| Hackathon Page | lablab.ai/event/agentic-commerce-on-arc |
| Arc Faucet (testnet USDC) | faucet.circle.com |
| LangChain Docs | js.langchain.com |

---

## ⚠️ Important Notes

1. **Never commit .env** — API key sirf local rakho
2. **Testnet only** abhi — mainnet pe mat jaana hackathon ke liye
3. **MIT License** zaroori hai submission ke liye
4. **Demo video** banana hai April 25 tak
5. **Circle Console email** submission form mein daalni hai

---

## 💡 Unique Selling Points (for judges)

1. **Truly autonomous** — zero human clicks after policy set
2. **FX + Agentic** — rare combination on Arc
3. **x402 native** — not just a wallet wrapper
4. **Policy engine** — rule-based guardrails (max spend/day, rate limits)
5. **Real-world use case** — cross-border payments automation

---

*"The agent that never sleeps, never misses a rate, never needs your approval."*
