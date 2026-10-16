const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  concern: { type: String, required: true },
  phone: { type: String },
  role: { type: String },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'contacted'] }
}, { timestamps: true });

module.exports = mongoose.model('Waitlist', waitlistSchema);
