const cron = require('node-cron');
const axios = require('axios');
const config = require('../config');
const policyEngine = require('./policyEngine');

// In-memory rate store (replace with DB in production)
let latestRates = {};
let isRunning = false;
let cronJob = null;

// Fetch rates from CoinGecko (free tier fallback)
async function fetchRates() {
  try {
    const ids = 'usd-coin,euro-coin,mxn-peso-bridged-wormhole,jpy-coin';
    const res = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: { ids, vs_currencies: 'usd,eur,mxn,jpy' },
    });

    const now = new Date().toISOString();
    latestRates = {
      'USDC/EURC': res.data['usd-coin']?.eur ? (1 / res.data['usd-coin'].eur).toFixed(6) : null,
      'EURC/USDC': res.data['usd-coin']?.eur?.toFixed(6) || null,
      'USDC/MXNB': res.data['usd-coin']?.mxn?.toFixed(4) || null,
      'USDC/JPYC': res.data['usd-coin']?.jpy?.toFixed(4) || null,
      updatedAt: now,
    };

    console.log('[FX Monitor] Rates updated:', latestRates);

    // Evaluate policies after rate update
    await policyEngine.evaluate(latestRates);
    return latestRates;
  } catch (err) {
    console.error('[FX Monitor] Failed to fetch rates:', err.message);
    // Return stale rates if available
    return latestRates;
  }
}

function start() {
  if (isRunning) return;
  isRunning = true;
  // Fetch immediately on start
  fetchRates();
  // Then poll every 30 seconds
  cronJob = cron.schedule('*/30 * * * * *', fetchRates);
  console.log('[FX Monitor] Started polling every 30s');
}

function stop() {
  if (cronJob) cronJob.stop();
  isRunning = false;
  console.log('[FX Monitor] Stopped');
}

function getRates() {
  return latestRates;
}

function getStatus() {
  return { isRunning, lastUpdate: latestRates.updatedAt || null };
}

module.exports = { start, stop, fetchRates, getRates, getStatus };
