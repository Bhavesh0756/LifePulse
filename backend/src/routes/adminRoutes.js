const express = require('express');
const router = express.Router();
const {
  getMetrics,
  getHospitals,
  verifyHospital,
  getUsers,
  toggleUserStatus,
  updateUserRole,
  getAllRequests,
  cancelRequestByAdmin,
} = require('../controllers/adminController');

const { authenticateUser } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// All Admin routes require Authentication AND ADMIN Role (Strict RBAC)
router.use(authenticateUser);
router.use(requireRole('ADMIN'));

router.get('/metrics', getMetrics);

router.get('/hospitals', getHospitals);
router.patch('/hospitals/:id/verify', verifyHospital);

router.get('/users', getUsers);
router.patch('/users/:id/status', toggleUserStatus);
router.patch('/users/:id/role', updateUserRole);

router.get('/requests', getAllRequests);
router.patch('/requests/:id/cancel', cancelRequestByAdmin);

module.exports = router;
