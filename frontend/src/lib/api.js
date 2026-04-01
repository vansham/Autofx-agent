import axios from 'axios';

const api = axios.create({ baseURL: '/api/v1' });

// Rates
export const getRates = () => api.get('/rates').then(r => r.data);
export const refreshRates = () => api.post('/rates/refresh').then(r => r.data);

// Agent
export const getAgentStatus = () => api.get('/agent/status').then(r => r.data);
export const startAgent = () => api.post('/agent/start').then(r => r.data);
export const stopAgent = () => api.post('/agent/stop').then(r => r.data);
export const analyzeMarket = () => api.get('/agent/analyze').then(r => r.data);
export const askAgent = (question) => api.post('/agent/ask', { question }).then(r => r.data);

// Policies
export const getPolicies = () => api.get('/policies').then(r => r.data);
export const createPolicy = (data) => api.post('/policies', data).then(r => r.data);
export const updatePolicy = (id, data) => api.patch(`/policies/${id}`, data).then(r => r.data);
export const deletePolicy = (id) => api.delete(`/policies/${id}`).then(r => r.data);
export const getTxHistory = () => api.get('/policies/tx/history').then(r => r.data);

// Wallet
export const getWalletBalance = () => api.get('/wallet/balance').then(r => r.data);
