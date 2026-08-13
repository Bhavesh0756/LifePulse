const analyticsService = require('../services/analyticsService');
const { sendError, sendSuccess } = require('../utils/apiError');

/**
 * @desc    Get Platform Overview Analytics & Aggregate Metrics
 * @route   GET /api/admin/analytics/overview
 * @access  Private (ADMIN)
 */
const getOverviewAnalytics = async (req, res) => {
  try {
    const { range, customStart, customEnd, bloodGroup, city, hospitalId } = req.query;

    const filters = { range, customStart, customEnd, bloodGroup, city, hospitalId };

    const [platformOverview, bloodGroupDemand, hospitalActivity, fulfillment, donorAnalytics] =
      await Promise.all([
        analyticsService.getPlatformOverview(),
        analyticsService.getBloodGroupAnalytics(filters),
        analyticsService.getHospitalActivityAnalytics(filters),
        analyticsService.getFulfillmentAndUrgencyAnalytics(filters),
        analyticsService.getDonorAnalytics(),
      ]);

    return sendSuccess(res, 200, 'Platform analytics retrieved successfully', {
      platformOverview,
      bloodGroupDemand,
      hospitalActivity,
      fulfillment,
      donorAnalytics,
      filtersApplied: filters,
    });
  } catch (error) {
    console.error('[Get Analytics Overview Error]:', error);
    return sendError(res, 500, 'Failed to fetch platform analytics overview.', 'SERVER_ERROR');
  }
};

/**
 * @desc    Get Time-Series Request Trends Analytics
 * @route   GET /api/admin/analytics/trends
 * @access  Private (ADMIN)
 */
const getTrendsAnalytics = async (req, res) => {
  try {
    const { range = '30d', customStart, customEnd, bloodGroup, city, hospitalId } = req.query;

    const filters = { range, customStart, customEnd, bloodGroup, city, hospitalId };

    const trends = await analyticsService.getRequestTrendsAnalytics(filters);

    return sendSuccess(res, 200, 'Request trends analytics retrieved', {
      trends,
      range,
      filtersApplied: filters,
    });
  } catch (error) {
    console.error('[Get Analytics Trends Error]:', error);
    return sendError(res, 500, 'Failed to fetch request trends analytics.', 'SERVER_ERROR');
  }
};

module.exports = {
  getOverviewAnalytics,
  getTrendsAnalytics,
};
