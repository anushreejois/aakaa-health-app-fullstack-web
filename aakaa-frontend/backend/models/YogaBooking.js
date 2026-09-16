const mongoose = require('mongoose');

const yogaBookingSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'YogaClass' },
  bookingType: { type: String, enum: ['class', 'monthly', 'private'], default: 'class' },
  instructorName: { type: String, default: "" },
  date: { type: String, default: "" },
  time: { type: String, default: "" },
  status: { type: String, default: 'confirmed', enum: ['confirmed', 'cancelled', 'Pending Payment'] },
  paymentId: { type: String, default: "" },
  meetLink: { type: String, default: 'https://meet.google.com/mock-yoga-class' }
}, { timestamps: true });

module.exports = mongoose.model('YogaBooking', yogaBookingSchema);
