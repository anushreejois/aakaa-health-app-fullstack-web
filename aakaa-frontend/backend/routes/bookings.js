const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');

// @route   POST /api/bookings
// @desc    Create a new booking (Public for Concierge Flow)
router.post('/', async (req, res) => {
  const { userName, userEmail, therapistId, date, time, status } = req.body;

  try {
    // Prevent double booking - cast therapistId to handle different formats
    let existingBooking = null;
    if (therapistId) {
      existingBooking = await Booking.findOne({ 
        therapistId: therapistId.toString(), 
        date: date.trim(), 
        time: time.trim() 
      });
    }
    
    if (existingBooking) {
      return res.status(400).json({ 
        msg: 'This slot is already booked. Please choose another time.' 
      });
    }

    const newBooking = new Booking({
      userName,
      userEmail,
      therapistId: therapistId || undefined,
      date,
      time,
      status: status || 'confirmed'
    });

    const booking = await newBooking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/bookings/stats
// @desc    Get revenue and booking stats
router.get('/stats', auth, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    
    // Calculate total revenue (confirmed only)
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
    const totalRevenue = confirmedBookings.length * 850;
    
    // Calculate stats for current month vs last month
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const currentMonthBookings = confirmedBookings.filter(b => new Date(b.createdAt) >= firstDayCurrentMonth);
    const lastMonthBookings = confirmedBookings.filter(b => {
      const d = new Date(b.createdAt);
      return d >= firstDayLastMonth && d < firstDayCurrentMonth;
    });

    const currentRevenue = currentMonthBookings.length * 850;
    const lastRevenue = lastMonthBookings.length * 850;

    let revenueChange = "0%";
    if (lastRevenue > 0) {
      const change = ((currentRevenue - lastRevenue) / lastRevenue) * 100;
      revenueChange = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    } else if (currentRevenue > 0) {
      revenueChange = "+100%";
    }

    let growthChange = "0%";
    if (lastMonthBookings.length > 0) {
      const change = ((currentMonthBookings.length - lastMonthBookings.length) / lastMonthBookings.length) * 100;
      growthChange = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    } else if (currentMonthBookings.length > 0) {
      growthChange = "+100%";
    }
    
    res.json({
      revenue: totalRevenue,
      revenueChange: revenueChange,
      growth: confirmedBookings.length,
      growthChange: growthChange,
      transactions: bookings
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/bookings
// @desc    Get all bookings
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('therapistId', ['name', 'title']);
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/bookings/:id
// @desc    Update a booking (status or time)
router.patch('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('therapistId', ['name', 'title']);
    
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete a booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });
    res.json({ msg: 'Booking removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

