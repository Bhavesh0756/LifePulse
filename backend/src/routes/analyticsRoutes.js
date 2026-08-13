const express = require('express');
const router = express.Router();
const { getOverviewAnalytics, getTrendsAnalytics } = require('../controllers/analyticsController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { ROLES } = require('../models/User');

// All Analytics routes require Authentication & ADMIN Role
router.use(authenticateUser);
router.use(requireRole(ROLES.ADMIN));

router.get('/overview', getOverviewAnalytics);
router.get('/trends', getTrendsAnalytics);

module.exports = router;
