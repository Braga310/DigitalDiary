const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastConsultationDate: { type: Date },
  productsDiscussed: { type: String },
  notes: { type: String }
});

module.exports = mongoose.model('Doctor', DoctorSchema);