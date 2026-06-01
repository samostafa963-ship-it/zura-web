const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }), 'products');

// GET all
router.get('/', async (req, res) => {
  try {
    const { limit = 20, page = 1, category, q, sort } = req.query;
    const filter = {};
    if (category) filter.category_key = category;
    if (q) filter.name = { $regex: q, $options: 'i' };
    let sortOption = {};
    if (sort === 'popular') sortOption = { sales_count: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'discount') sortOption = { discount: -1 };
    const products = await Product.find(filter).sort(sortOption).limit(+limit).skip((+page - 1) * +limit);
    const total = await Product.countDocuments(filter);
    res.json({ products, total, page: +page });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET one
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'المنتج غير موجود' });
    res.json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, createdAt: new Date(), sales_count: 0 });
    res.status(201).json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true });
    if (!product) return res.status(404).json({ error: 'المنتج غير موجود' });
    res.json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST increment sales
router.post('/:id/sold', async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { $inc: { sales_count: +quantity } });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;