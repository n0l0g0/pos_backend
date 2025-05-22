import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

export default mongoose.models.Unit || mongoose.model('Unit', unitSchema);
