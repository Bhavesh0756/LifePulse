const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  createBloodRequest,
  getBloodRequests,
  getBloodRequestById,
  getBloodRequestMatches,
  updateBloodRequest,
  cancelBloodRequest,
} = require('../controllers/hospitalController');

const { authenticateUser } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// All Hospital routes require Authentication AND HOSPITAL Role (RBAC)
router.use(authenticateUser);
router.use(requireRole('HOSPITAL'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

router.post('/requests', createBloodRequest);
router.get('/requests', getBloodRequests);
router.get('/requests/:id', getBloodRequestById);
router.get('/requests/:id/matches', getBloodRequestMatches);
router.patch('/requests/:id', updateBloodRequest);
router.delete('/requests/:id', cancelBloodRequest);

module.exports = router;
