const express = require('express');
const cors = require('cors');
const config = require('./config');

const agentRoutes = require('./routes/agent');
const policyRoutes = require('./routes/policy');
const walletRoutes = require('./routes/wallet');
const ratesRoutes = require('./routes/rates');
const fxMonitor = require('./services/fxMonitor');

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/v1/agent', agentRoutes);
app.use('/api/v1/policies', policyRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/rates', ratesRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(config.port, () => {
  console.log(`AutoFX Agent backend running on port ${config.port}`);
  // Start FX monitor on boot
  fxMonitor.start();
});

module.exports = app;
