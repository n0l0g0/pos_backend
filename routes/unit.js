import express from 'express';
import Unit from '../models/Unit.js';

const router = express.Router();

// ดึงหน่วยทั้งหมด
router.get('/', async (req, res) => {
  try {
    const units = await Unit.find();
    res.json(units);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// เพิ่มหน่วยใหม่ (ถ้าต้องการใช้งาน)
router.post('/', async (req, res) => {
  try {
    const unit = await Unit.create(req.body);
    res.status(201).json(unit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
