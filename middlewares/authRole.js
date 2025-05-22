// 📁 pos-backend/middlewares/authRole.js

export const requireOwnerRole = (req, res, next) => {
  if (req.user?.role !== 'owner') {
    return res.status(403).json({ error: 'Permission denied. Owner access only.' });
  }
  next();
};
