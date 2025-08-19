const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const doctors = await Doctor.find(query).limit(10);
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Error fetching doctors' });
  }
});

// Add a doctor
router.post('/', async (req, res) => {
  try {
    const { name, lastConsultationDate, productsDiscussed, notes } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Doctor name is required' });
    }
    const doctor = new Doctor({ name, lastConsultationDate, productsDiscussed, notes });
    await doctor.save();
    res.status(201).json(doctor);
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ error: 'Error creating doctor' });
  }
});

// ...existing code...

// Bulk add doctors from Excel
router.post('/bulk', async (req, res) => {
  try {
    const { names } = req.body; // array of names
    if (!Array.isArray(names) || names.length === 0) {
      return res.status(400).json({ error: 'No doctor names provided' });
    }
  const docs = names.map(name => ({ name, lastConsultationDate: null, productsDiscussed: '', notes: '' }));
    await Doctor.insertMany(docs);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Bulk doctor upload error:', err);
    res.status(500).json({ error: 'Failed to upload doctors' });
  }
});

// ...existing code...

// Update a doctor
router.put('/:id', async (req, res) => {
  try {
    const { name, lastConsultationDate, productsDiscussed, notes } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
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
router.delete('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
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
router.post('/:id/consultations', async (req, res) => {
  try {
    const { date, productsDiscussed, notes } = req.body;
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    doctor.consultations.push({ date, productsDiscussed, notes });
    await doctor.save();
    res.json(doctor);
  } catch (error) {
    console.error('Error adding consultation:', error);
    res.status(500).json({ error: 'Error adding consultation' });
  }
});

module.exports = router;