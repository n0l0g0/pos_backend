// 📁 backend/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password_hash: String,
    role: { type: String, enum: ['owner', 'staff'], default: 'staff' }
  });
  
// เพิ่ม method สำหรับตรวจสอบรหัสผ่าน
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password_hash);
};

export default mongoose.model('User', userSchema);
