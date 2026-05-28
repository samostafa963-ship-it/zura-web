const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Category = mongoose.model('Category', new mongoose.Schema({}, { strict: false }), 'categories');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;