const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Banner = mongoose.model('Banner', new mongoose.Schema({}, { strict: false }), 'banners');

router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
    res.json({ banners });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;