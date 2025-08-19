// backend/models/PlannerEntry.js
const mongoose = require('mongoose');

const PlannerEntrySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  doctorName: { type: String, required: true }
});

module.exports = mongoose.model('PlannerEntry', PlannerEntrySchema);