const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }), 'products');

router.get('/', async (req, res) => {
  try {
    const { limit = 20, page = 1, category, q } = req.query;
    const filter = {};
    if (category) filter.category_key = category;
    if (q) filter.name = { $regex: q, $options: 'i' };
    const products = await Product.find(filter)
      .limit(+limit).skip((+page - 1) * +limit);
    const total = await Product.countDocuments(filter);
    res.json({ products, total, page: +page });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;