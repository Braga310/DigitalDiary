// Run this script once to fix old transaction dates in MongoDB
require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');

async function fixDates() {
  await mongoose.connect(process.env.MONGO_URI);
  const transactions = await Transaction.find({});
  let updated = 0;
  for (const tx of transactions) {
    if (typeof tx.date === 'string') {
      const newDate = new Date(tx.date);
      if (!isNaN(newDate)) {
        tx.date = newDate;
        await tx.save();
        updated++;
      }
    }
  }
  console.log(`Updated ${updated} transactions.`);
  mongoose.disconnect();
}

fixDates();
