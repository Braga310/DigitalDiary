
const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const authMiddleware = require('../middleware/auth');

// Get all doctors
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search } = req.query;
    const query = {
      user: req.userId,
      ...(search ? { name: { $regex: search, $options: 'i' } } : {})
    };
    const doctors = await Doctor.find(query).limit(10);
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Error fetching doctors' });
  }
});

// Add a doctor
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, lastConsultationDate, productsDiscussed, notes } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Doctor name is required' });
    }
    const doctor = new Doctor({ name, lastConsultationDate, productsDiscussed, notes, user: req.userId });
    await doctor.save();
    res.status(201).json(doctor);
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ error: 'Error creating doctor' });
  }
});

// Bulk add doctors from Excel
router.post('/bulk', authMiddleware, async (req, res) => {
  try {
    const { names } = req.body; // array of names
    if (!Array.isArray(names) || names.length === 0) {
      return res.status(400).json({ error: 'No doctor names provided' });
    }
    const docs = names.map(name => ({ name, lastConsultationDate: null, productsDiscussed: '', notes: '', user: req.userId }));
    await Doctor.insertMany(docs);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Bulk doctor upload error:', err);
    res.status(500).json({ error: 'Failed to upload doctors' });
  }
});

// Update a doctor
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, lastConsultationDate, productsDiscussed, notes } = req.body;
    const doctor = await Doctor.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { name, lastConsultationDate, productsDiscussed, notes },
      { new: true }
    );
    res.json(doctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ error: 'Error updating doctor' });
  }
});

// Delete a doctor
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ error: 'Error deleting doctor' });
  }
});

// Add consultation to a doctor
router.post('/:id/consultations', authMiddleware, async (req, res) => {
  try {
    const { date, productsDiscussed, notes } = req.body;
    const doctor = await Doctor.findOne({ _id: req.params.id, user: req.userId });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    if (!doctor.consultations) doctor.consultations = [];
    doctor.consultations.push({ date, productsDiscussed, notes });
    await doctor.save();
    res.json(doctor);
  } catch (error) {
    console.error('Error adding consultation:', error);
    res.status(500).json({ error: 'Error adding consultation' });
  }
});

module.exports = router;