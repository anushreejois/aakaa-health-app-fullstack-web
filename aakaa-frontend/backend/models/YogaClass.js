const mongoose = require('mongoose');

const yogaClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructorName: { type: String, required: true },
  instructorTitle: { type: String, default: "Certified Yoga Instructor" },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: String, default: "60 mins" },
  price: { type: Number, required: true },
  capacity: { type: Number, default: 15 },
  bookedSpots: { type: Number, default: 0 },
  description: { type: String, default: "" },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'], default: 'All Levels' },
  image: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('YogaClass', yogaClassSchema);
