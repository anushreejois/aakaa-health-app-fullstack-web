const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  status: { type: String, default: 'Draft', enum: ['Draft', 'Published'] },
  content: { type: String, required: true },
  snippet: { type: String, required: true },
  views: { type: Number, default: 0 },
  date: { type: String, required: true },
  readTime: { type: String, required: true },
  image: { type: String, required: true },
  imageAlt: { type: String },
  slug: { type: String, required: true, unique: true },
  seoTitle: { type: String },
  seoDescription: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
