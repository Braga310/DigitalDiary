// backend/routes/planner.js

const express = require('express');
const router = express.Router();
const PlannerEntry = require('../models/PlannerEntry');
const authMiddleware = require('../middleware/auth');


// Get all entries (optionally filter by doctorName)
router.get('/', authMiddleware, async (req, res) => {
  const { doctorName } = req.query;
  const query = {
    user: req.userId,
    ...(doctorName ? { doctorName: { $regex: doctorName, $options: 'i' } } : {})
  };
  const entries = await PlannerEntry.find(query);
  res.json(entries);
});


// Add an entry
router.post('/', authMiddleware, async (req, res) => {
  const { date, doctorName } = req.body;
  if (!date || !doctorName) {
    return res.status(400).json({ error: 'Date and doctor name required' });
  }
  const entry = new PlannerEntry({ date, doctorName, user: req.userId });
  await entry.save();
  res.status(201).json(entry);
});


router.delete('/:id', authMiddleware, async(req,res)=>{
    try{
        const deleted = await PlannerEntry.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if(!deleted){
            return res.status(404).json({error: "Doctor's Entry not found"});
        }
        res.json({success:true});
    }
    catch(err){
        console.error("Error deleting doctor's entry", err);
        res.status(500).json({error: "Failed to delete the doctor's entry"})
    }
})

module.exports = router;