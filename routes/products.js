import express from 'express';
import Product from '../models/Product.js';
import AuditLog from '../models/AuditLog.js';

const router = express.Router();

// POST เพิ่มสินค้า
router.post('/', async (req, res) => {
  try {
    const { name, sku, category, unit, price, stock, breakdown, email } = req.body;

    if (!name || !sku || !unit) {
      return res.status(400).json({ message: 'กรุณาระบุ name, sku และ unit' });
    }

    const exists = await Product.findOne({ sku });
    if (exists) {
      return res.status(409).json({ message: 'SKU นี้มีอยู่แล้ว' });
    }

    const product = await Product.create({
      name,
      sku,
      category: category || '',
      unit,
      price: Number(price),
      stock: Number(stock),
      breakdown: Array.isArray(breakdown) ? breakdown : []
    });

    await AuditLog.create({
      action: 'create',
      productId: product._id,
      dataBefore: null,
      dataAfter: product.toObject(),
      email: email || 'ไม่ทราบชื่อ'
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('เพิ่มสินค้าไม่สำเร็จ:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มสินค้า' });
  }
});

// PUT แก้ไขสินค้า
router.put('/:id', async (req, res) => {
  try {
    const original = await Product.findById(req.params.id);
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ error: 'ไม่พบสินค้าเพื่อแก้ไข' });
    }

    await AuditLog.create({
      action: 'update',
      productId: updated._id,
      dataBefore: original.toObject(),
      dataAfter: updated.toObject(),
      email: req.body.email || 'ไม่ทราบชื่อ'
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'แก้ไขสินค้าไม่สำเร็จ', detail: err.message });
  }
});

// DELETE ลบสินค้า
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'ไม่พบสินค้า' });

    await AuditLog.create({
      action: 'delete',
      productId: deleted._id,
      dataBefore: deleted.toObject(),
      dataAfter: null,
      email: req.body.email || 'ไม่ทราบชื่อ'
    });

    res.json({ message: 'ลบสินค้าเรียบร้อยแล้ว' });
  } catch (err) {
    res.status(500).json({ error: 'ลบสินค้าไม่สำเร็จ', detail: err.message });
  }
});

// GET ดึงสินค้า
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

export default router;
