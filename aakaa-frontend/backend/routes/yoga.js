const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const YogaClass = require('../models/YogaClass');
const YogaBooking = require('../models/YogaBooking');

// @route   GET /api/yoga/classes
// @desc    Get all upcoming yoga classes
router.get('/classes', async (req, res) => {
  try {
    const classes = await YogaClass.find().sort({ createdAt: -1 });
    res.json(classes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/yoga/classes
// @desc    Create a new yoga class (Admin only)
router.post('/classes', auth, async (req, res) => {
  const { title, instructorName, instructorTitle, date, time, duration, price, capacity, description, level, image } = req.body;

  try {
    const newClass = new YogaClass({
      title,
      instructorName,
      instructorTitle,
      date,
      time,
      duration,
      price,
      capacity,
      description,
      level,
      image
    });

    const yogaClass = await newClass.save();
    res.status(201).json(yogaClass);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/yoga/classes/:id
// @desc    Update a yoga class (Admin only)
router.patch('/classes/:id', auth, async (req, res) => {
  try {
    const yogaClass = await YogaClass.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!yogaClass) return res.status(404).json({ msg: 'Class not found' });
    res.json(yogaClass);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/yoga/classes/:id
// @desc    Delete a yoga class (Admin only)
router.delete('/classes/:id', auth, async (req, res) => {
  try {
    const yogaClass = await YogaClass.findByIdAndDelete(req.params.id);
    if (!yogaClass) return res.status(404).json({ msg: 'Class not found' });
    res.json({ msg: 'Yoga class removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/yoga/bookings
// @desc    Book a yoga class, monthly pass, or private session (Public for Concierge Flow)
router.post('/bookings', async (req, res) => {
  const { userName, userEmail, classId, bookingType, instructorName, date, time } = req.body;

  try {
    const type = bookingType || 'class';

    if (type === 'class') {
      const yogaClass = await YogaClass.findById(classId);
      if (!yogaClass) {
        return res.status(404).json({ msg: 'Yoga class not found' });
      }

      if (yogaClass.bookedSpots >= yogaClass.capacity) {
        return res.status(400).json({ msg: 'This class is fully booked.' });
      }

      // Check if this email is already registered for this specific class
      const existingBooking = await YogaBooking.findOne({ userEmail, classId, bookingType: 'class' });
      if (existingBooking) {
        return res.status(400).json({ msg: 'You have already booked a spot for this class!' });
      }

      const newBooking = new YogaBooking({
        userName,
        userEmail,
        classId,
        bookingType: 'class'
      });

      const booking = await newBooking.save();

      // Increment spots
      yogaClass.bookedSpots += 1;
      await yogaClass.save();

      return res.status(201).json(booking);
    }

    if (type === 'monthly') {
      const newBooking = new YogaBooking({
        userName,
        userEmail,
        bookingType: 'monthly',
        meetLink: 'https://meet.google.com/mock-yoga-monthly-pass'
      });

      const booking = await newBooking.save();
      return res.status(201).json(booking);
    }

    if (type === 'private') {
      const newBooking = new YogaBooking({
        userName,
        userEmail,
        bookingType: 'private',
        instructorName,
        date,
        time,
        meetLink: 'https://meet.google.com/mock-yoga-private-session'
      });

      const booking = await newBooking.save();
      return res.status(201).json(booking);
    }

    return res.status(400).json({ msg: 'Invalid booking type' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/yoga/bookings
// @desc    Get all yoga bookings (Admin only)
router.get('/bookings', auth, async (req, res) => {
  try {
    const bookings = await YogaBooking.find()
      .populate('classId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
