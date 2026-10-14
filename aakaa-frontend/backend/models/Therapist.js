const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  email: { type: String, trim: true, default: "" },
  specialties: [{ type: String }],
  rating: { type: Number, default: 5.0 },
  reviews: { type: Number, default: 0 },
  price: { type: String, required: true, default: "₹850" },
  image: { type: String, default: "" },
  bio: { type: String, default: "" },
  availability: [{ type: String }],
  views: { type: Number, default: 0 },
  bookings: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  licenseNumber: { type: String },
  licenseFileUrl: { type: String },
  status: { type: String, default: 'approved', enum: ['pending', 'approved', 'rejected'] }
}, { timestamps: true });

module.exports = mongoose.model('Therapist', therapistSchema);
