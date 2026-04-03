const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const adapter = new FileSync(path.join(__dirname, '../../db.json'));
const db = low(adapter);

// Set defaults
db.defaults({ policies: [], transactions: [] }).write();

module.exports = {
  // Policies
  getPolicies: () => db.get('policies').value(),
  getPolicy: (id) => db.get('policies').find({ id }).value(),
  addPolicy: (policy) => { db.get('policies').push(policy).write(); return policy; },
  updatePolicy: (id, updates) => { db.get('policies').find({ id }).assign(updates).write(); return db.get('policies').find({ id }).value(); },
  deletePolicy: (id) => { db.get('policies').remove({ id }).write(); return true; },
  
  // Transactions
  getTransactions: () => db.get('transactions').value(),
  addTransaction: (tx) => { db.get('transactions').unshift(tx).write(); return tx; },
};
