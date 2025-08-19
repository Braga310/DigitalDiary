const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { type: String, enum: ['received', 'given'], required: true },
  amount: { type: Number, required: true },
  description: { type: String }
});

module.exports = mongoose.model('Transaction', TransactionSchema);