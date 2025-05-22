import express from 'express';
import AuditLog from '../models/AuditLog.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    console.error('โหลด audit log ไม่สำเร็จ:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการโหลด audit log' });
  }
});

export default router;