import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: String,
  productId: mongoose.Schema.Types.ObjectId,
  dataBefore: Object,
  dataAfter: Object,
  email: String
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);
