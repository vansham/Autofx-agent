# 🤖 AutoFX Agent

**Autonomous FX trading agent on Arc blockchain** — set policies, agent executes swaps automatically using x402 protocol + Circle MPC Wallets.

> Built for the [Agentic Commerce on Arc Hackathon](https://lablab.ai/event/agentic-commerce-on-arc) — April 20–26, 2026 | $10,000 prize pool

---

## Quick Start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your API keys in .env
node src/index.js
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`

---

## How It Works

1. User sets a policy: *"Swap 10 USDC → EURC when rate > 1.08"*
2. FX Monitor polls rates every 30 seconds
3. AI Agent Core (LangChain + Claude) evaluates conditions
4. x402 Handler executes payment via Circle MPC Wallet
5. Arc Testnet settles in < 1 second
6. Transaction logged in History

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind + Recharts |
| Backend | Node.js + Express |
| AI Agent | LangChain + Claude (claude-sonnet-4) |
| Payments | x402 Protocol |
| Wallets | Circle Programmable Wallets (MPC) |
| Blockchain | Arc Testnet |

---

## Environment Variables

```env
CIRCLE_API_KEY=           # From console.circle.com
CIRCLE_BASE_URL=https://api-sandbox.circle.com
ANTHROPIC_API_KEY=        # From console.anthropic.com
CIRCLE_WALLET_SET_ID=     # From Circle Console → Wallets
CIRCLE_AGENT_WALLET_ID=   # Your agent's wallet ID
PORT=4000
```

---

## License

MIT — as required for hackathon submission.
