const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Banner = mongoose.model('Banner', new mongoose.Schema({}, { strict: false }), 'banners');

// GET all (public - active only)
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;
    const filter = all === 'true' ? {} : { isActive: true };
    const banners = await Banner.find(filter).sort({ order: 1 });
    res.json({ banners });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET one
router.get('/:id', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ error: 'البنر غير موجود' });
    res.json(banner);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const banner = await Banner.create({ ...req.body, createdAt: new Date() });
    res.status(201).json(banner);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true });
    if (!banner) return res.status(404).json({ error: 'البنر غير موجود' });
    res.json(banner);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;