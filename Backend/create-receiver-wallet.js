const { initiateDeveloperControlledWalletsClient } = require('@circle-fin/developer-controlled-wallets');
require('dotenv').config();

async function main() {
  const client = initiateDeveloperControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET,
  });

  const wallet = await client.createWallets({
    walletSetId: process.env.CIRCLE_WALLET_SET_ID,
    blockchains: ['ARC-TESTNET'],
    count: 1,
    metadata: [{ name: 'autofx-receiver', refId: 'receiver' }],
  });

  const w = wallet.data?.wallets?.[0];
  console.log('Receiver Wallet ID:', w?.id);
  console.log('Receiver Address:', w?.address);
  console.log('\nAdd to .env:');
  console.log(`CIRCLE_RECEIVER_WALLET_ID=${w?.id}`);
  console.log(`CIRCLE_RECEIVER_ADDRESS=${w?.address}`);
}

main().catch(console.error);
