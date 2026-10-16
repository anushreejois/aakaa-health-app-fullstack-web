const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Waitlist = require('../models/Waitlist');

// @route   POST /api/waitlist
// @desc    Add a new user to the waitlist
router.post('/', async (req, res) => {
  const { name, email, concern, phone, role } = req.body;

  try {
    // Check if user already exists in waitlist
    let user = await Waitlist.findOne({ email });
    if (user) {
      if (concern && user.concern && user.concern.includes(concern)) {
        return res.status(200).json({ 
          message: 'You are already registered on our priority list for this program!',
          user 
        });
      }

      user.concern = user.concern ? `${user.concern} | ${concern}` : concern;
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (role) user.role = role;
      await user.save();

      return res.status(200).json({ 
        message: 'Successfully updated your priority interest!', 
        user 
      });
    }

    user = new Waitlist({ name, email, concern, phone, role });
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

