const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Therapist = require('../models/Therapist');

// @route   GET /api/admin/therapists/pending
// @desc    Get all therapists pending verification
router.get('/therapists/pending', auth, async (req, res) => {
  try {
    const therapists = await Therapist.find({ status: 'pending' }).populate('userId', ['fullName', 'email', 'avatarUrl']);
    res.json({ therapists });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/admin/therapists/:id/verify
// @desc    Approve or reject a therapist application
router.put('/therapists/:id/verify', auth, async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status' });
  }

  try {
    const therapist = await Therapist.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );
    if (!therapist) return res.status(404).json({ msg: 'Therapist not found' });
    res.json(therapist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
