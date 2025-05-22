import express from 'express';
import User from '../models/User.js';
import auth from '../middlewares/auth.js';
import { requireOwnerRole } from '../middlewares/authRole.js';

const router = express.Router();

// 🔐 GET current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash');
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// 🔐 GET all users (owner only)
router.get('/', auth, requireOwnerRole, async (req, res) => {
  try {
    if (req.query.email) {
      const user = await User.findOne({ email: req.query.email });
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.json(user);
    }
    const users = await User.find({}, 'name email role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
});

// 🔐 POST new user (owner only)
router.post('/', auth, requireOwnerRole, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    const bcrypt = await import('bcrypt');
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password_hash, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user', details: err.message });
  }
});

// 🔐 PUT update user (owner only)
router.put('/:id', auth, requireOwnerRole, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user', details: err.message });
  }
});

// 🔐 PUT update password (owner only)
router.put('/:id/password', auth, requireOwnerRole, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password required' });
    const bcrypt = await import('bcrypt');
    const password_hash = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(req.params.id, { password_hash });
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update password', details: err.message });
  }
});

// 🔐 DELETE user (owner only)
router.delete('/:id', auth, requireOwnerRole, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user', details: err.message });
  }
});

export default router;
