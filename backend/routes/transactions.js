const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get transactions for a month
router.get('/', async (req, res) => {
  try {
    const monthNum = parseInt(req.query.month);
    const yearNum = parseInt(req.query.year);
    const start = new Date(yearNum, monthNum, 1);
    const end = new Date(yearNum, monthNum + 1, 0, 23, 59, 59);
    const transactions = await Transaction.find({ date: { $gte: start, $lte: end } }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// Add transaction
router.post('/', async (req, res) => {
  try {
    let { date, type, amount, description } = req.body;
    if (!date || !type || amount == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // Convert date string to Date object
    date = new Date(date);
    const transaction = new Transaction({ date, type, amount, description });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error("Error adding transaction:", err);
    res.status(500).json({ error: "Failed to add transaction" });
  }
});

// Update transaction
router.put('/:id', async (req, res) => {
  try {
    const { date, type, amount, description } = req.body;
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { date, type, amount, description },
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  } catch (err) {
    console.error("Error updating transaction:", err);
    res.status(500).json({ error: "Failed to update transaction" });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

module.exports = router;