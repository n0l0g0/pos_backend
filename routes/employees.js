// 📁 backend/routes/employees.js
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const employeeSchema = new mongoose.Schema({
  name: String,
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

router.get('/', async (req, res) => {
  const employees = await Employee.find().sort({ createdAt: -1 });
  res.json(employees);
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  const employee = await Employee.create({ name,email });
  res.status(201).json(employee);
});

router.delete('/:id', async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: 'Employee deleted' });
});

router.put('/:id', async (req, res) => {
    try {
      const { name } = req.body;
      const updated = await Employee.findByIdAndUpdate(
        req.params.id,
        { name },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.json(updated);
    } catch (err) {
      console.error('Error updating employee:', err);
      res.status(500).json({ error: 'Failed to update employee' });
    }
  });
export default router;
