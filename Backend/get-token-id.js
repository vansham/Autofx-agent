const { initiateDeveloperControlledWalletsClient } = require('@circle-fin/developer-controlled-wallets');
require('dotenv').config();

async function main() {
  const client = initiateDeveloperControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET,
  });

  // Get agent wallet balance to find USDC token ID
  const res = await client.getWalletTokenBalance({
    id: process.env.CIRCLE_AGENT_WALLET_ID,
  });

  console.log('Token Balances:');
  res.data?.tokenBalances?.forEach(b => {
    console.log(`Token: ${b.token?.symbol} | ID: ${b.token?.id} | Amount: ${b.amount}`);
  });
}

main().catch(console.error);
