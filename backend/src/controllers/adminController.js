const { User, ROLES } = require('../models/User');
const { HospitalProfile, VERIFICATION_STATUSES } = require('../models/HospitalProfile');
const { BloodRequest } = require('../models/BloodRequest');
const { DonorConsent } = require('../models/DonorConsent');
const { DonorProfile } = require('../models/DonorProfile');
const notificationService = require('../services/notificationService');
const { NOTIFICATION_TYPES } = require('../models/Notification');
const { sendError, sendSuccess } = require('../utils/apiError');
const mongoose = require('mongoose');

/**
 * @desc    Get Platform Administration Dashboard Metrics
 * @route   GET /api/admin/metrics
 * @access  Private (ADMIN)
 */
const getMetrics = async (req, res) => {
  try {
    const [
      totalDonors,
      totalHospitals,
      totalAdmins,
      pendingHospitals,
      verifiedHospitals,
      rejectedHospitals,
      totalRequests,
      openRequests,
      partiallyFulfilledRequests,
      criticalRequests,
      fulfilledRequests,
      cancelledRequests,
      totalConsents,
      unitStats,
    ] = await Promise.all([
      User.countDocuments({ role: ROLES.DONOR }),
      User.countDocuments({ role: ROLES.HOSPITAL }),
      User.countDocuments({ role: ROLES.ADMIN }),
      HospitalProfile.countDocuments({ verificationStatus: 'PENDING' }),
      HospitalProfile.countDocuments({ verificationStatus: 'VERIFIED' }),
      HospitalProfile.countDocuments({ verificationStatus: 'REJECTED' }),
      BloodRequest.countDocuments(),
      BloodRequest.countDocuments({ status: 'OPEN' }),
      BloodRequest.countDocuments({ status: 'PARTIALLY_FULFILLED' }),
      BloodRequest.countDocuments({ urgency: 'CRITICAL', status: { $in: ['OPEN', 'PARTIALLY_FULFILLED'] } }),
      BloodRequest.countDocuments({ status: 'FULFILLED' }),
      BloodRequest.countDocuments({ status: 'CANCELLED' }),
      DonorConsent.countDocuments({ status: 'ACCEPTED' }),
      BloodRequest.aggregate([
        {
          $group: {
            _id: null,
            totalUnitsRequested: { $sum: '$unitsRequired' },
            totalUnitsFulfilled: { $sum: '$unitsFulfilled' },
          },
        },
      ]),
    ]);

    const unitsRequested = unitStats.length > 0 ? unitStats[0].totalUnitsRequested : 0;
    const unitsFulfilled = unitStats.length > 0 ? unitStats[0].totalUnitsFulfilled : 0;

    return sendSuccess(res, 200, 'Admin platform metrics retrieved', {
      users: {
        totalDonors,
        totalHospitals,
        totalAdmins,
        totalUsers: totalDonors + totalHospitals + totalAdmins,
      },
      verificationQueue: {
        pending: pendingHospitals,
        verified: verifiedHospitals,
        rejected: rejectedHospitals,
      },
      bloodRequests: {
        total: totalRequests,
        open: openRequests,
        partiallyFulfilled: partiallyFulfilledRequests,
        critical: criticalRequests,
        fulfilled: fulfilledRequests,
        cancelled: cancelledRequests,
        unitsRequested,
        unitsFulfilled,
      },
      coordination: {
        totalConsents,
      },
    });
  } catch (error) {
    console.error('[Admin Metrics Error]:', error);
    return sendError(res, 500, 'Failed to fetch administration metrics.', 'SERVER_ERROR');
  }
};

/**
 * @desc    Get Hospital Accounts for Verification Review
 * @route   GET /api/admin/hospitals
 * @access  Private (ADMIN)
 */
const getHospitals = async (req, res) => {
  try {
    const { status, search, sortBy = 'updatedAt', sortOrder = 'desc', page = 1, limit = 10 } = req.query;

    // Ensure all HOSPITAL users have a corresponding HospitalProfile document
    const hospitalUsers = await User.find({ role: ROLES.HOSPITAL });
    for (const u of hospitalUsers) {
      const existing = await HospitalProfile.findOne({ userId: u._id });
      if (!existing) {
        await HospitalProfile.create({
          userId: u._id,
          hospitalName: u.hospitalName || 'Hospital Center',
          phone: u.phone || '+91 98765 00000',
          isVerified: u.isVerified || false,
          verificationStatus: u.isVerified ? 'VERIFIED' : 'PENDING',
        });
      }
    }

    let query = {};
    if (status && status.toUpperCase() !== 'ALL' && ['PENDING', 'VERIFIED', 'REJECTED'].includes(status.toUpperCase())) {
      query.verificationStatus = status.toUpperCase();
    }

    let hospitals = await HospitalProfile.find(query)
      .populate('userId', 'name email phone role isActive createdAt')
      .populate('verifiedBy', 'name email');

    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      hospitals = hospitals.filter(
        (h) =>
          h.hospitalName.toLowerCase().includes(s) ||
          h.registrationNumber?.toLowerCase().includes(s) ||
          h.userId?.email?.toLowerCase().includes(s) ||
          h.userId?.name?.toLowerCase().includes(s)
      );
    }

    // Whitelisted Controlled Sorting
    const ALLOWED_SORTS = ['createdAt', 'updatedAt', 'hospitalName', 'verificationStatus'];
    const sortField = ALLOWED_SORTS.includes(sortBy) ? sortBy : 'updatedAt';
    const isAsc = String(sortOrder).toLowerCase() === 'asc';

    hospitals.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return isAsc ? new Date(valA) - new Date(valB) : new Date(valB) - new Date(valA);
    });

    const total = hospitals.length;
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const totalPages = Math.ceil(total / l) || 1;
    const startIndex = (p - 1) * l;
    const paginatedHospitals = hospitals.slice(startIndex, startIndex + l);

    return sendSuccess(res, 200, 'Hospital verification list retrieved', {
      hospitals: paginatedHospitals,
      pagination: {
        page: p,
        limit: l,
        total,
        totalPages,
        hasNext: p < totalPages,
        hasPrevious: p > 1,
      },
    });
  } catch (error) {
    console.error('[Admin Get Hospitals Error]:', error);
    return sendError(res, 500, 'Failed to fetch hospital profiles.', 'SERVER_ERROR');
  }
};

/**
 * @desc    Approve, Reject, or Revoke Hospital Verification (Atomic Double-Update)
 * @route   PATCH /api/admin/hospitals/:id/verify
 * @access  Private (ADMIN)
 */
const verifyHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, isVerified, notes } = req.body;

    const hospitalProfile = await HospitalProfile.findById(id);
    if (!hospitalProfile) {
      return sendError(res, 404, 'Hospital profile not found.', 'NOT_FOUND');
    }

    // Determine target verification status (APPROVE vs REJECT/REVOKE)
    const shouldApprove = (action === 'APPROVE' || action === 'VERIFY' || isVerified === true) && action !== 'REVOKE' && action !== 'REJECT';
    const nextStatus = shouldApprove ? 'VERIFIED' : 'REJECTED';
    const nextIsVerified = shouldApprove;

    const now = new Date();
    const verificationNotes = typeof notes === 'string' ? notes.trim() : hospitalProfile.verificationNotes;

    // 1. Update HospitalProfile
    hospitalProfile.isVerified = nextIsVerified;
    hospitalProfile.verificationStatus = nextStatus;
    hospitalProfile.verificationNotes = verificationNotes;
    hospitalProfile.verifiedAt = now;
    hospitalProfile.verifiedBy = req.user._id;
    await hospitalProfile.save();

    // 2. Update User Account synchronously
    await User.findByIdAndUpdate(
      hospitalProfile.userId,
      { $set: { isVerified: nextIsVerified } }
    );

    // Stage 8 Notification Dispatch
    (async () => {
      try {
        const isApproved = nextStatus === 'VERIFIED';
        await notificationService.createNotification({
          recipientId: hospitalProfile.userId,
          recipientRole: 'HOSPITAL',
          type: isApproved ? NOTIFICATION_TYPES.HOSPITAL_VERIFIED : NOTIFICATION_TYPES.HOSPITAL_REJECTED,
          title: isApproved ? 'Hospital Verification Approved' : 'Hospital Verification Status Updated',
          message: isApproved
            ? `Your hospital verification for ${hospitalProfile.hospitalName} has been APPROVED by system admin.`
            : `Your hospital verification for ${hospitalProfile.hospitalName} status is REJECTED.${verificationNotes ? ` Reason: ${verificationNotes}` : ''}`,
          relatedEntityType: 'HospitalProfile',
          relatedEntityId: hospitalProfile._id,
          idempotencyKey: `HOSPITAL_STATUS_${hospitalProfile._id}_${nextStatus}_${now.getTime()}`,
        });
      } catch (notifErr) {
        console.error('[Verify Hospital Notification Error]:', notifErr);
      }
    })();

    return sendSuccess(
      res,
      200,
      `Hospital verification status updated to ${nextStatus}`,
      {
        hospital: {
          id: hospitalProfile._id,
          hospitalName: hospitalProfile.hospitalName,
          isVerified: hospitalProfile.isVerified,
          verificationStatus: hospitalProfile.verificationStatus,
          verificationNotes: hospitalProfile.verificationNotes,
          verifiedAt: hospitalProfile.verifiedAt,
        },
      }
    );
  } catch (error) {
    console.error('[Verify Hospital Error]:', error);
    return sendError(res, 500, 'Failed to update hospital verification status.', 'SERVER_ERROR');
  }
};

/**
 * @desc    Get Platform Users Directory (Privacy Protected)
 * @route   GET /api/admin/users
 * @access  Private (ADMIN)
 */
const getUsers = async (req, res) => {
  try {
    const { role, search, status, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = req.query;

    let query = {};
    if (role && role.toUpperCase() !== 'ALL' && [ROLES.DONOR, ROLES.HOSPITAL, ROLES.ADMIN].includes(role.toUpperCase())) {
      query.role = role.toUpperCase();
    }
    if (status === 'active') query.isActive = true;
    if (status === 'suspended') query.isActive = false;

    if (search && search.trim()) {
      const s = search.trim();
      const regex = new RegExp(s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { hospitalName: regex },
      ];
    }

    // Whitelisted Controlled Sorting
    const ALLOWED_SORTS = ['createdAt', 'name', 'email', 'role', 'isActive'];
    const sortField = ALLOWED_SORTS.includes(sortBy) ? sortBy : 'createdAt';
    const isAsc = String(sortOrder).toLowerCase() === 'asc';
    const sortObj = { [sortField]: isAsc ? 1 : -1 };

    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (p - 1) * l;

    const [users, total] = await Promise.all([
      User.find(query).sort(sortObj).skip(skip).limit(l),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / l) || 1;
    const safeUsers = users.map((u) => u.toSafeObject());

    return sendSuccess(res, 200, 'Platform users retrieved successfully', {
      users: safeUsers,
      pagination: {
        page: p,
        limit: l,
        total,
        totalPages,
        hasNext: p < totalPages,
        hasPrevious: p > 1,
      },
    });
  } catch (error) {
    console.error('[Admin Get Users Error]:', error);
    return sendError(res, 500, 'Failed to fetch platform users.', 'SERVER_ERROR');
  }
};

/**
 * @desc    Toggle User Active Status (Suspend / Activate) with Admin Self-Protection
 * @route   PATCH /api/admin/users/:id/status
 * @access  Private (ADMIN)
 */
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Admin Self-Protection Rule
    if (id === req.user._id.toString()) {
      return sendError(
        res,
        400,
        'Security Protection: You cannot suspend or deactivate your own admin account.',
        'ADMIN_SELF_PROTECTION'
      );
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return sendError(res, 404, 'User account not found.', 'NOT_FOUND');
    }

    const nextState = typeof isActive === 'boolean' ? isActive : !targetUser.isActive;
    targetUser.isActive = nextState;
    await targetUser.save();

    return sendSuccess(
      res,
      200,
      `User account ${targetUser.name} (${targetUser.email}) updated to ${targetUser.isActive ? 'ACTIVE' : 'SUSPENDED'}`,
      {
        user: targetUser.toSafeObject(),
      }
    );
  } catch (error) {
    console.error('[Toggle User Status Error]:', error);
    return sendError(res, 500, 'Failed to update user status.', 'SERVER_ERROR');
  }
};

/**
 * @desc    Update User Role (Protected Admin Action) with Admin Self-Protection
 * @route   PATCH /api/admin/users/:id/role
 * @access  Private (ADMIN)
 */
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Admin Self-Protection Rule: Cannot modify self admin role
    if (id === req.user._id.toString()) {
      return sendError(
        res,
        400,
        'Security Protection: You cannot change or downgrade your own admin account role.',
        'ADMIN_SELF_PROTECTION'
      );
    }

    if (![ROLES.DONOR, ROLES.HOSPITAL, ROLES.ADMIN].includes(role)) {
      return sendError(res, 400, 'Invalid user role specified.', 'VALIDATION_ERROR');
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return sendError(res, 404, 'User account not found.', 'NOT_FOUND');
    }

    targetUser.role = role;
    if (role === ROLES.DONOR && !targetUser.bloodGroup) {
      targetUser.bloodGroup = 'O+';
    }
    if (role === ROLES.HOSPITAL && !targetUser.hospitalName) {
      targetUser.hospitalName = targetUser.name + ' Hospital';
    }
    await targetUser.save();

    return sendSuccess(
      res,
      200,
      `User ${targetUser.name} role updated to ${targetUser.role}`,
      {
        user: targetUser.toSafeObject(),
      }
    );
  } catch (error) {
    console.error('[Update User Role Error]:', error);
    return sendError(res, 500, 'Failed to update user role.', 'SERVER_ERROR');
  }
};

/**
 * @desc    Get Platform-Wide Blood Requests (With Search & Multi-Filters)
 * @route   GET /api/admin/requests
 * @access  Private (ADMIN)
 */
const getAllRequests = async (req, res) => {
  try {
    const { status, urgency, bloodGroup, city, search, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = req.query;

    let query = {};
    if (status && status.toLowerCase() !== 'all') query.status = status.toUpperCase();
    if (urgency && urgency.toLowerCase() !== 'all') query.urgency = urgency.toUpperCase();
    if (bloodGroup && bloodGroup.toLowerCase() !== 'all') query.bloodGroup = bloodGroup.toUpperCase();
    if (city && city.trim() && city.toLowerCase() !== 'all') query['location.city'] = { $regex: city.trim(), $options: 'i' };

    if (search && search.trim()) {
      const s = search.trim();
      const regex = new RegExp(s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
      query.$or = [
        { hospitalName: regex },
        { patientReference: regex },
        { reason: regex },
        { 'location.city': regex },
        { 'location.state': regex },
      ];
    }

    // Whitelisted Controlled Sorting
    const ALLOWED_SORTS = ['createdAt', 'requiredDate', 'urgency', 'unitsRequired', 'unitsFulfilled', 'status'];
    const sortField = ALLOWED_SORTS.includes(sortBy) ? sortBy : 'createdAt';
    const isAsc = String(sortOrder).toLowerCase() === 'asc';
    const sortObj = { [sortField]: isAsc ? 1 : -1 };

    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (p - 1) * l;

    const [requests, total] = await Promise.all([
      BloodRequest.find(query)
        .populate('hospitalId', 'hospitalName phone isVerified verificationStatus address')
        .sort(sortObj)
        .skip(skip)
        .limit(l),
      BloodRequest.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / l) || 1;

    return sendSuccess(res, 200, 'All platform blood requests retrieved', {
      requests,
      pagination: {
        page: p,
        limit: l,
        total,
        totalPages,
        hasNext: p < totalPages,
        hasPrevious: p > 1,
      },
    });
  } catch (error) {
    console.error('[Admin Get All Requests Error]:', error);
    return sendError(res, 500, 'Failed to fetch blood requests.', 'SERVER_ERROR');
  }
};

/**
 * @desc    Cancel an Active Blood Request (Admin Governance Control)
 * @route   PATCH /api/admin/requests/:id/cancel
 * @access  Private (ADMIN)
 */
const cancelRequestByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const bloodRequest = await BloodRequest.findById(id);
    if (!bloodRequest) {
      return sendError(res, 404, 'Blood request not found.', 'NOT_FOUND');
    }

    if (bloodRequest.status === 'CANCELLED') {
      return sendError(res, 400, 'This blood request is already cancelled.', 'ALREADY_CANCELLED');
    }

    bloodRequest.status = 'CANCELLED';
    if (reason && typeof reason === 'string') {
      bloodRequest.reason = `${bloodRequest.reason} [Admin Cancellation Note: ${reason.trim()}]`;
    }
    await bloodRequest.save();

    return sendSuccess(
      res,
      200,
      `Blood request ${bloodRequest.patientReference} has been cancelled by system admin.`,
      {
        request: bloodRequest,
      }
    );
  } catch (error) {
    console.error('[Cancel Request Admin Error]:', error);
    return sendError(res, 500, 'Failed to cancel blood request.', 'SERVER_ERROR');
  }
};

module.exports = {
  getMetrics,
  getHospitals,
  verifyHospital,
  getUsers,
  toggleUserStatus,
  updateUserRole,
  getAllRequests,
  cancelRequestByAdmin,
};
