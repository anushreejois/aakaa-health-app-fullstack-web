const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Waitlist = require('../models/Waitlist');

// @route   POST /api/waitlist
// @desc    Add a new user to the waitlist
router.post('/', async (req, res) => {
  const { name, email, concern } = req.body;

  try {
    // Check if user already exists in waitlist
    let user = await Waitlist.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already on the waitlist' });
    }

    user = new Waitlist({ name, email, concern });
    await user.save();

    res.status(201).json({ message: 'Successfully joined the waitlist!', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/waitlist
// @desc    Get all waitlist entries
router.get('/', auth, async (req, res) => {
  try {
    const entries = await Waitlist.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/waitlist/:id
// @desc    Remove a user from the waitlist (Approve Access)
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await Waitlist.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Waitlist entry not found' });
    res.json({ msg: 'Access approved and removed from waitlist' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

