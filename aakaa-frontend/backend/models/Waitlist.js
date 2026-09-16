const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  concern: { type: String, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'contacted'] }
}, { timestamps: true });

module.exports = mongoose.model('Waitlist', waitlistSchema);
