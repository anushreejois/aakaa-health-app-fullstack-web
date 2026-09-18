const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, default: 'confirmed', enum: ['confirmed', 'Pending Assignment', 'rescheduled', 'cancelled', 'Pending Payment', 'Pending Verification'] },
  transactionId: { type: String, default: '' },
  meetLink: { type: String, default: 'https://meet.google.com/mock-link' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
