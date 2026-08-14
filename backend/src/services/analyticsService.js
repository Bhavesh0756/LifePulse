const { User, ROLES } = require('../models/User');
const { HospitalProfile } = require('../models/HospitalProfile');
const { DonorProfile } = require('../models/DonorProfile');
const { BloodRequest } = require('../models/BloodRequest');
const { DonorConsent } = require('../models/DonorConsent');

const ALL_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

/**
 * Build Timezone-Safe Date Match Filter
 */
function buildDateRangeFilter(range, customStart, customEnd) {
  if (!range || range === 'all') return null;

  const now = new Date();
  let startDate = null;
  let endDate = new Date(now);
  endDate.setUTCHours(23, 59, 59, 999);

  if (range === '7d') {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    startDate.setUTCHours(0, 0, 0, 0);
  } else if (range === '30d') {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    startDate.setUTCHours(0, 0, 0, 0);
  } else if (range === '90d') {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);
    startDate.setUTCHours(0, 0, 0, 0);
  } else if (customStart && customEnd) {
    startDate = new Date(customStart);
    startDate.setUTCHours(0, 0, 0, 0);
    endDate = new Date(customEnd);
    endDate.setUTCHours(23, 59, 59, 999);
  }

  if (startDate) {
    return { $gte: startDate, $lte: endDate };
  }
  return null;
}

/**
 * Build Multi-Filter $match Query for Blood Requests
 */
function buildMatchQuery({ range, customStart, customEnd, bloodGroup, city, hospitalId }) {
  const match = {};

  const dateFilter = buildDateRangeFilter(range, customStart, customEnd);
  if (dateFilter) {
    match.createdAt = dateFilter;
  }

  if (bloodGroup && bloodGroup !== 'ALL' && ALL_BLOOD_GROUPS.includes(bloodGroup)) {
    match.bloodGroup = bloodGroup;
  }

  if (city && city.trim() && city !== 'ALL') {
    match['location.city'] = new RegExp(`^${city.trim()}$`, 'i');
  }

  if (hospitalId && hospitalId !== 'ALL') {
    match.hospitalId = hospitalId;
  }

  return match;
}

const analyticsService = {
  /**
   * Platform & Accounts Overview Metrics
   */
  async getPlatformOverview() {
    const [
      totalUsers,
      totalDonors,
      totalHospitals,
      pendingHospitals,
      verifiedHospitals,
      rejectedHospitals,
      activeUsers,
      suspendedUsers,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: ROLES.DONOR }),
      User.countDocuments({ role: ROLES.HOSPITAL }),
      HospitalProfile.countDocuments({ verificationStatus: 'PENDING' }),
      HospitalProfile.countDocuments({ verificationStatus: 'VERIFIED' }),
      HospitalProfile.countDocuments({ verificationStatus: 'REJECTED' }),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
    ]);

    return {
      totalUsers,
      totalDonors,
      totalHospitals,
      pendingHospitals,
      verifiedHospitals,
      rejectedHospitals,
      activeUsers,
      suspendedUsers,
    };
  },

  /**
   * All 8 Blood Groups Demand & Fulfillment Analytics (Auto-padded with 0 for missing groups)
   */
  async getBloodGroupAnalytics(filters = {}) {
    const matchQuery = buildMatchQuery(filters);

    const aggregated = await BloodRequest.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$bloodGroup',
          totalRequests: { $sum: 1 },
          unitsRequested: { $sum: '$unitsRequired' },
          unitsFulfilled: { $sum: '$unitsFulfilled' },
        },
      },
    ]);

    const map = new Map(aggregated.map((item) => [item._id, item]));

    // Guarantee all 8 blood groups are represented
    return ALL_BLOOD_GROUPS.map((group) => {
      const data = map.get(group) || { totalRequests: 0, unitsRequested: 0, unitsFulfilled: 0 };
      const rate = data.unitsRequested > 0 ? Math.round((data.unitsFulfilled / data.unitsRequested) * 100) : 0;
      return {
        bloodGroup: group,
        totalRequests: data.totalRequests,
        unitsRequested: data.unitsRequested,
        unitsFulfilled: data.unitsFulfilled,
        fulfillmentRate: rate,
      };
    });
  },

  /**
   * Hospital Activity & Performance Analytics
   */
  async getHospitalActivityAnalytics(filters = {}) {
    const matchQuery = buildMatchQuery(filters);

    const aggregated = await BloodRequest.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$hospitalId',
          hospitalName: { $first: '$hospitalName' },
          totalRequests: { $sum: 1 },
          unitsRequested: { $sum: '$unitsRequired' },
          unitsFulfilled: { $sum: '$unitsFulfilled' },
        },
      },
      {
        $project: {
          hospitalId: '$_id',
          hospitalName: 1,
          totalRequests: 1,
          unitsRequested: 1,
          unitsFulfilled: 1,
          fulfillmentRate: {
            $cond: [
              { $gt: ['$unitsRequested', 0] },
              { $round: [{ $multiply: [{ $divide: ['$unitsFulfilled', '$unitsRequested'] }, 100] }, 1] },
              0,
            ],
          },
        },
      },
      { $sort: { totalRequests: -1 } },
      { $limit: 10 },
    ]);

    return aggregated;
  },

  /**
   * Fulfillment & Urgency Performance Overview
   */
  async getFulfillmentAndUrgencyAnalytics(filters = {}) {
    const matchQuery = buildMatchQuery(filters);

    const [statusDist, urgencyDist, totals] = await Promise.all([
      // Status Distribution
      BloodRequest.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      // Urgency Distribution & Fulfillment
      BloodRequest.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$urgency',
            totalRequests: { $sum: 1 },
            unitsRequested: { $sum: '$unitsRequired' },
            unitsFulfilled: { $sum: '$unitsFulfilled' },
          },
        },
      ]),
      // Aggregate Totals
      BloodRequest.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: null,
            totalRequests: { $sum: 1 },
            unitsRequested: { $sum: '$unitsRequired' },
            unitsFulfilled: { $sum: '$unitsFulfilled' },
          },
        },
      ]),
    ]);

    const overallTotals = totals[0] || { totalRequests: 0, unitsRequested: 0, unitsFulfilled: 0 };
    const overallFulfillmentRate =
      overallTotals.unitsRequested > 0
        ? Math.round((overallTotals.unitsFulfilled / overallTotals.unitsRequested) * 100)
        : 0;

    const statusMap = new Map(statusDist.map((item) => [item._id, item.count]));
    const urgencyMap = new Map(urgencyDist.map((item) => [item._id, item]));

    const URGENCY_LEVELS = ['CRITICAL', 'URGENT', 'HIGH', 'NORMAL'];
    const urgencyPerformance = URGENCY_LEVELS.map((level) => {
      const data = urgencyMap.get(level) || { totalRequests: 0, unitsRequested: 0, unitsFulfilled: 0 };
      const rate = data.unitsRequested > 0 ? Math.round((data.unitsFulfilled / data.unitsRequested) * 100) : 0;
      return {
        urgency: level,
        totalRequests: data.totalRequests,
        unitsRequested: data.unitsRequested,
        unitsFulfilled: data.unitsFulfilled,
        fulfillmentRate: rate,
      };
    });

    return {
      totalRequests: overallTotals.totalRequests,
      unitsRequested: overallTotals.unitsRequested,
      unitsFulfilled: overallTotals.unitsFulfilled,
      overallFulfillmentRate,
      statusCounts: {
        OPEN: statusMap.get('OPEN') || 0,
        PARTIALLY_FULFILLED: statusMap.get('PARTIALLY_FULFILLED') || 0,
        FULFILLED: statusMap.get('FULFILLED') || 0,
        CANCELLED: statusMap.get('CANCELLED') || 0,
      },
      urgencyPerformance,
    };
  },

  /**
   * Time-Series Trends Analytics (Date-Range & Multi-Filter Safe)
   */
  async getRequestTrendsAnalytics(filters = {}) {
    const matchQuery = buildMatchQuery(filters);

    const trends = await BloodRequest.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          created: { $sum: 1 },
          fulfilled: { $sum: { $cond: [{ $eq: ['$status', 'FULFILLED'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'CANCELLED'] }, 1, 0] } },
          critical: { $sum: { $cond: [{ $eq: ['$urgency', 'CRITICAL'] }, 1, 0] } },
          unitsRequested: { $sum: '$unitsRequired' },
          unitsFulfilled: { $sum: '$unitsFulfilled' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return trends.map((item) => ({
      date: item._id,
      created: item.created,
      fulfilled: item.fulfilled,
      cancelled: item.cancelled,
      critical: item.critical,
      unitsRequested: item.unitsRequested,
      unitsFulfilled: item.unitsFulfilled,
    }));
  },

  /**
   * Donor & Consent Aggregated Insights
   */
  async getDonorAnalytics() {
    const [totalDonors, availableDonors, eligibleDonors, totalConsents, acceptedConsents, declinedConsents] =
      await Promise.all([
        DonorProfile.countDocuments({}),
        DonorProfile.countDocuments({ isAvailable: true }),
        DonorProfile.countDocuments({ eligibilityStatus: 'ELIGIBLE' }),
        DonorConsent.countDocuments({}),
        DonorConsent.countDocuments({ status: 'ACCEPTED' }),
        DonorConsent.countDocuments({ status: 'DECLINED' }),
      ]);

    const standbyDonors = totalDonors - availableDonors;
    const consentAcceptanceRate =
      totalConsents > 0 ? Math.round((acceptedConsents / totalConsents) * 100) : 0;

    return {
      totalDonors,
      availableDonors,
      standbyDonors,
      eligibleDonors,
      ineligibleDonors: totalDonors - eligibleDonors,
      totalConsents,
      acceptedConsents,
      declinedConsents,
      consentAcceptanceRate,
    };
  },
};

module.exports = analyticsService;
