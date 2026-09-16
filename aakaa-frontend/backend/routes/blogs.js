const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Blog = require('../models/Blog');

// @route   GET /api/blogs
// @desc    Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/blogs
// @desc    Create a new blog post
router.post('/', auth, async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    const blog = await newBlog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/blogs/:id
// @desc    Update a blog post
router.patch('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!blog) return res.status(404).json({ msg: 'Blog post not found' });
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog post
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ msg: 'Blog post not found' });
    res.json({ msg: 'Blog post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
