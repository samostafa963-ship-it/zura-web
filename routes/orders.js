const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }), 'orders');

// GET all orders (admin)
router.get('/', async (req, res) => {
  try {
    const { limit = 50, page = 1, status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(+limit)
      .skip((+page - 1) * +limit);
    const total = await Order.countDocuments(filter);
    res.json({ orders, total, page: +page });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET one
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'الطلب غير موجود' });
    res.json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create (from website)
router.post('/', async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      status: 'placed',
      createdAt: new Date(),
    });
    res.status(201).json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update status (admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'الطلب غير موجود' });
    res.json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;