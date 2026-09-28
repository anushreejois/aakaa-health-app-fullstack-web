const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Therapist = require('../models/Therapist');
const Withdrawal = require('../models/Withdrawal');

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
// @route   GET /api/admin/withdrawals/pending
// @desc    Get all pending withdrawals
router.get('/withdrawals/pending', auth, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ status: 'pending' }).populate('therapistId');
    // Map therapist name/image to fullName/avatarUrl to match frontend expectations
    const formattedWithdrawals = withdrawals.map(w => {
      const doc = w.toObject();
      if (doc.therapistId) {
        doc.therapistId.fullName = doc.therapistId.name;
        doc.therapistId.avatarUrl = doc.therapistId.image;
      }
      return doc;
    });
    res.json({ withdrawals: formattedWithdrawals });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/admin/withdrawals/:id/settle
// @desc    Approve or reject a withdrawal
router.put('/withdrawals/:id/settle', auth, async (req, res) => {
  const { status } = req.body;
  if (!['settled', 'rejected'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status' });
  }

  try {
    const withdrawal = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );
    if (!withdrawal) return res.status(404).json({ msg: 'Withdrawal not found' });
    res.json(withdrawal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
