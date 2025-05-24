// 📁 backend/routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  console.log('>> Input password:', password);
  console.log('>> Hash in DB:', user.password_hash);

  const isMatch = await user.validatePassword(password);
  console.log('>> isMatch:', isMatch); // ✅ สำคัญสุด

  if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || 'secretkey',
    { expiresIn: '1d' }
  );

  res.json({
    token,
    email: user.email,
    name: user.name,
    role: user.role
  });
});

export default router;
