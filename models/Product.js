import mongoose from 'mongoose';

const BreakdownSchema = new mongoose.Schema({
  unit: { type: String, required: true },
  qty: { type: Number, required: true }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  name: String,
  sku: { type: String, unique: true },
  category: String,
  unit: String,
  price: Number,
  stock: Number,
  breakdown: [BreakdownSchema] 
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);