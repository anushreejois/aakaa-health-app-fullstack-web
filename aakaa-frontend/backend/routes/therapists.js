const express = require('express');
const router = express.Router();
const Therapist = require('../models/Therapist');
const auth = require('../middleware/auth');

// @route   GET /api/therapists
// @desc    Get all therapists
router.get('/', async (req, res) => {
  try {
    const therapists = await Therapist.find();
    res.json(therapists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/therapists
// @desc    Add a new therapist
router.post('/', auth, async (req, res) => {
  try {
    const newTherapist = new Therapist(req.body);
    const therapist = await newTherapist.save();
    res.status(201).json(therapist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/therapists/:id
// @desc    Update a therapist
router.put('/:id', auth, async (req, res) => {
  try {
    const therapist = await Therapist.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!therapist) return res.status(404).json({ message: 'Therapist not found' });
    res.json(therapist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/therapists/:id
// @desc    Delete a therapist
router.delete('/:id', auth, async (req, res) => {
  try {
    const therapist = await Therapist.findByIdAndDelete(req.params.id);
    if (!therapist) return res.status(404).json({ message: 'Therapist not found' });
    res.json({ message: 'Therapist removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/therapists/:id
// @desc    Get therapist by ID
router.get('/:id', async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id);
    if (!therapist) return res.status(404).json({ message: 'Therapist not found' });
    res.json(therapist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
