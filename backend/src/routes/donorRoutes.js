const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  toggleAvailability,
  getDonationHistory,
  getIncomingRequests,
  acceptRequest,
  declineRequest,
  getDonorConsents,
} = require('../controllers/donorController');

const { authenticateUser } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// All Donor routes require Authentication AND DONOR Role (RBAC)
router.use(authenticateUser);
router.use(requireRole('DONOR'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.patch('/availability', toggleAvailability);

router.get('/history', getDonationHistory);
router.get('/requests', getIncomingRequests);
router.post('/requests/:requestId/accept', acceptRequest);
router.post('/requests/:requestId/decline', declineRequest);
router.get('/consents', getDonorConsents);

module.exports = router;
