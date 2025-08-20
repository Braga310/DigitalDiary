const mongoose = require('mongoose');


const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastConsultationDate: { type: Date },
  productsDiscussed: { type: String },
  notes: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Doctor', DoctorSchema);