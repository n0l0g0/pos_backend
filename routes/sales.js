// routes/sales.js
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const saleSchema = new mongoose.Schema({
  receiptId: String, // ← เพิ่มบรรทัดนี้
  cart: [{
    _id: String,
    name: String,
    sku: String,
    price: Number,
    qty: Number
  }],
  discount: Number,
  discountType: String,
  totalPrice: Number,
  discountedPrice: Number,
  paymentMethod: String,
  cashier: String,
  createdAt: Date
});


const Sale = mongoose.model('Sale', saleSchema);

router.post('/', async (req, res) => {
  try {
    const sale = await Sale.create(req.body);
    res.status(201).json(sale);
  } catch (err) {
    console.error('❌ Error saving sale:', err.message);
    res.status(500).json({ error: 'ไม่สามารถบันทึกการขายได้' });
  }
});

router.get('/', async (req, res) => {
  const sales = await Sale.find().sort({ createdAt: -1 });
  res.json(sales);
});

export default router;
