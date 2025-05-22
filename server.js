import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/products.js';
import salesRoutes from './routes/sales.js';
import unitRoutes from './routes/unit.js';
import auditRoutes from './routes/audit.js';
import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employees.js';
import userRoutes from './routes/users.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/products', productRoutes);
app.use('/sales', salesRoutes);
app.use('/units', unitRoutes);
app.use('/audit-log', auditRoutes); 
app.use('/auth', authRoutes);
app.use('/employees', employeeRoutes);
app.use('/users', userRoutes); 

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));