const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  email: { type: String, required: true, trim: true },
  specialties: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  price: { type: String, required: true },
  image: { type: String, required: true },
  bio: { type: String, default: "" },
  availability: [{ type: String }],
  views: { type: Number, default: 0 },
  bookings: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  licenseNumber: { type: String },
  licenseFileUrl: { type: String },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] }
}, { timestamps: true });

module.exports = mongoose.model('Therapist', therapistSchema);
