const mongoose = require('mongoose');

const yogaBookingSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, default: "" },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'YogaClass' },
  bookingType: { type: String, enum: ['class', 'monthly', 'private'], default: 'class' },
  pricingTier: { type: String, enum: ['client', 'therapist', null], default: null },
  classCount: { type: Number, default: 1 },
  instructorName: { type: String, default: "" },
  date: { type: String, default: "" },
  time: { type: String, default: "" },
  amount: { type: Number, default: 0 },
  status: { type: String, default: 'confirmed', enum: ['confirmed', 'cancelled', 'Pending Payment', 'Pending Verification'] },
  transactionId: { type: String, default: "" },
  paymentId: { type: String, default: "" },
  meetLink: { type: String, default: '' },
  therapistRole: { type: String, default: '' },
  therapistAffiliation: { type: String, default: '' },
  therapistProfileLink: { type: String, default: '' },
  verificationStatus: { type: String, enum: ['Pending Verification', 'Verified', 'Not Applicable'], default: 'Not Applicable' }
}, { timestamps: true });

module.exports = mongoose.model('YogaBooking', yogaBookingSchema);
