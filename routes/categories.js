const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Category = mongoose.model('Category', new mongoose.Schema({}, { strict: false }), 'categories');

// GET all
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const category = await Category.create({ ...req.body, createdAt: new Date() });
    res.status(201).json(category);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
    if (!category) return res.status(404).json({ error: 'القسم غير موجود' });
    res.json(category);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;