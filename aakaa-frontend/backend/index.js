const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route for Testing
app.get('/', (req, res) => {
  res.send('Aakaa API is running...');
});

// Routes
app.use('/api/waitlist', require('./routes/waitlist'));
app.use('/api/therapists', require('./routes/therapists'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/yoga', require('./routes/yoga'));

// Serve React Frontend Static Files (Production Monolith)
const path = require('path');
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback to React index.html for any other route
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });
