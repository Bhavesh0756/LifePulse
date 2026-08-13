const { HospitalProfile, VERIFICATION_STATUSES } = require('../models/HospitalProfile');
const { BloodRequest, URGENCY_LEVELS, REQUEST_STATUSES } = require('../models/BloodRequest');
const { BLOOD_GROUPS } = require('../models/User');
const { findMatchesForBloodRequest } = require('../services/matchingService');
const notificationService = require('../services/notificationService');
const { NOTIFICATION_TYPES } = require('../models/Notification');
const { sendError, sendSuccess } = require('../utils/apiError');


/**
 * Helper to ensure a HospitalProfile document exists for the user.
 * Includes E11000 duplicate key exception handling for concurrent requests.
 */
async function getOrCreateHospitalProfile(userId, userHospitalName, userPhone) {
  let profile = await HospitalProfile.findOne({ userId });
  if (!profile) {
    try {
      profile = new HospitalProfile({
        userId,
        hospitalName: userHospitalName || 'City Hospital Center',
        phone: userPhone || '+91 98765 00000',
        isVerified: false,
      });
      await profile.save();
    } catch (err) {
      if (err.code === 11000) {
        // Handle parallel execution race condition
        profile = await HospitalProfile.findOne({ userId });
      } else {
        throw err;
      }
    }
  }
  return profile;
}

/**
 * @desc    Get Hospital Profile
 * @route   GET /api/hospital/profile
 * @access  Private (HOSPITAL)
 */
const getProfile = async (req, res) => {
  try {
    const profile = await getOrCreateHospitalProfile(
      req.user._id,
      req.user.hospitalName,
      req.user.phone
    );

    // Compute real statistics
    const requests = await BloodRequest.find({ hospitalId: profile._id });
    const activeCount = requests.filter((r) => r.status === 'OPEN' || r.status === 'PARTIALLY_FULFILLED').length;
    const totalCount = requests.length;
    const unitsRequested = requests.reduce((acc, r) => acc + r.unitsRequired, 0);
    const unitsFulfilled = requests.reduce((acc, r) => acc + r.unitsFulfilled, 0);

    return sendSuccess(res, 200, 'Hospital profile retrieved successfully', {
      user: req.user.toSafeObject(),
      profile,
      stats: {
        activeRequests: activeCount,
        totalRequests: totalCount,
        unitsRequested,
        unitsFulfilled,
      },
    });
  } catch (error) {
    console.error('[Get Hospital Profile Error]:', error);
    return sendError(res, 500, 'Failed to fetch hospital profile.', 'SERVER_ERROR');
  }
};

/**
 * @desc    Update Hospital Profile (isVerified is read-only for hospitals)
 * @route   PUT /api/hospital/profile
 * @access  Private (HOSPITAL)
 */
const updateProfile = async (req, res) => {
  try {
    const { hospitalName, registrationNumber, phone, emergencyContact, address, locationCoordinates, devSetVerified } = req.body;

    let profile = await getOrCreateHospitalProfile(req.user._id, req.user.hospitalName, req.user.phone);

    if (hospitalName) profile.hospitalName = hospitalName.trim();
    if (registrationNumber !== undefined) profile.registrationNumber = registrationNumber.trim();
    if (phone) profile.phone = phone.trim();

    if (emergencyContact) {
      profile.emergencyContact = {
        name: emergencyContact.name !== undefined ? emergencyContact.name.trim() : profile.emergencyContact.name,
        phone: emergencyContact.phone !== undefined ? emergencyContact.phone.trim() : profile.emergencyContact.phone,
        email: emergencyContact.email !== undefined ? emergencyContact.email.trim() : profile.emergencyContact.email,
      };
    }

    if (address) {
      profile.address = {
        street: address.street !== undefined ? address.street.trim() : profile.address.street,
        city: address.city !== undefined ? address.city.trim() : profile.address.city,
        state: address.state !== undefined ? address.state.trim() : profile.address.state,
        zipCode: address.zipCode !== undefined ? address.zipCode.trim() : profile.address.zipCode,
      };
    }

    if (locationCoordinates) {
      profile.locationCoordinates = {
        latitude: typeof locationCoordinates.latitude === 'number' ? locationCoordinates.latitude : profile.locationCoordinates?.latitude,
        longitude: typeof locationCoordinates.longitude === 'number' ? locationCoordinates.longitude : profile.locationCoordinates?.longitude,
      };
    }

    // Controlled dev flag to enable verification testing during dev
    if (process.env.NODE_ENV !== 'production' && typeof devSetVerified === 'boolean') {
      profile.isVerified = devSetVerified;
    }

    await profile.save();

    return sendSuccess(res, 200, 'Hospital profile updated successfully', {
      profile,
    });
  } catch (error) {
    console.error('[Update Hospital Profile Error]:', error);
    return sendError(res, 500, 'Failed to update hospital profile.', 'SERVER_ERROR');
  }
};

/**
 * @desc    Create Blood Request (Gated by isVerified === true)
 * @route   POST /api/hospital/requests
 * @access  Private (HOSPITAL - Verified Only)
 */
const createBloodRequest = async (req, res) => {
  try {
    const profile = await getOrCreateHospitalProfile(req.user._id, req.user.hospitalName, req.user.phone);

    // VERIFICATION GATE FOR CREATION ONLY
    if (!profile.isVerified || profile.verificationStatus !== 'VERIFIED') {
      const isRejected = profile.verificationStatus === 'REJECTED';
      const errorMsg = isRejected
        ? `Your hospital verification was rejected.${profile.verificationNotes ? ` Reason: ${profile.verificationNotes}` : ''}`
        : 'Your hospital account must be verified before creating blood requests.';
      return sendError(
        res,
        403,
        errorMsg,
        isRejected ? 'HOSPITAL_REJECTED' : 'HOSPITAL_UNVERIFIED'
      );
    }

    const { bloodGroup, unitsRequired, urgency, requiredDate, reason, patientReference, city, state } = req.body;

    // Field Validations
    if (!bloodGroup || !BLOOD_GROUPS.includes(bloodGroup)) {
      return sendError(res, 400, 'Valid blood group is required.', 'VALIDATION_ERROR');
    }
    if (!unitsRequired || typeof unitsRequired !== 'number' || unitsRequired < 1 || unitsRequired > 20) {
      return sendError(res, 400, 'Units required must be between 1 and 20.', 'VALIDATION_ERROR');
    }
    if (!urgency || !URGENCY_LEVELS.includes(urgency)) {
      return sendError(res, 400, 'Urgency must be CRITICAL, URGENT, HIGH, or NORMAL.', 'VALIDATION_ERROR');
    }
    if (!requiredDate) {
      return sendError(res, 400, 'Required date is required.', 'VALIDATION_ERROR');
    }
    if (!reason || typeof reason !== 'string' || !reason.trim()) {
      return sendError(res, 400, 'Reason for blood request is required.', 'VALIDATION_ERROR');
    }
    if (!patientReference || typeof patientReference !== 'string' || !patientReference.trim()) {
      return sendError(res, 400, 'Non-identifying patient reference (e.g. PT-2026-001) is required.', 'VALIDATION_ERROR');
    }
    if (!city || !state) {
      return sendError(res, 400, 'City and state locations are required.', 'VALIDATION_ERROR');
    }

    const newRequest = new BloodRequest({
      hospitalId: profile._id,
      hospitalName: profile.hospitalName,
      bloodGroup,
      unitsRequired: Math.floor(unitsRequired),
      unitsFulfilled: 0,
      urgency,
      requiredDate: new Date(requiredDate),
      reason: reason.trim(),
      patientReference: patientReference.trim(),
      location: { city: city.trim(), state: state.trim() },
      status: 'OPEN',
    });

    await newRequest.save();

    // Stage 8 Notification Triggers (Async Background Notification Dispatch)
    (async () => {
      try {
        // 1. Find matched donors via Stage 5 Smart Matching Engine
        const matchResult = await findMatchesForBloodRequest(newRequest, profile);
        const matches = matchResult.matches || [];
        for (const m of matches) {
          if (m.donorId) {
            await notificationService.createNotification({
              recipientId: m.donorId,
              recipientRole: 'DONOR',
              type: NOTIFICATION_TYPES.BLOOD_REQUEST_MATCH,
              title: `New ${newRequest.bloodGroup} Blood Request`,
              message: `${profile.hospitalName} created a new emergency ${newRequest.bloodGroup} request (${newRequest.unitsRequired} units) near ${newRequest.location.city}.`,
              relatedEntityType: 'BloodRequest',
              relatedEntityId: newRequest._id,
              idempotencyKey: `BLOOD_REQUEST_MATCH_${newRequest._id}_${m.donorId}`,
            });
          }
        }

        // 2. If Critical Urgency, notify System Admins
        if (newRequest.urgency === 'CRITICAL') {
          await notificationService.notifyAdmins({
            type: NOTIFICATION_TYPES.CRITICAL_REQUEST,
            title: 'Critical Emergency Blood Request',
            message: `Critical ${newRequest.bloodGroup} blood request posted by ${profile.hospitalName} (${newRequest.location.city}).`,
            relatedEntityType: 'BloodRequest',
            relatedEntityId: newRequest._id,
            idempotencyKey: `CRITICAL_REQUEST_${newRequest._id}`,
          });
        }
      } catch (notifErr) {
        console.error('[Create Request Notification Error]:', notifErr);
      }
    })();

    return sendSuccess(res, 201, 'Blood request created successfully', {
      request: newRequest,
    });
  } catch (error) {
    console.error('[Create Blood Request Error]:', error);
    return sendError(res, 500, 'Failed to create blood request.', 'SERVER_ERROR');
  }
};

/**
 * @desc    Get All Blood Requests for Authenticated Hospital (UNVERIFIED HOSPITALS CAN VIEW)
 * @route   GET /api/hospital/requests
 * @access  Private (HOSPITAL)
 */
const getBloodRequests = async (req, res) => {
  try {
    const profile = await getOrCreateHospitalProfile(req.user._id, req.user.hospitalName, req.user.phone);

    if (!profile) {
      return sendSuccess(res, 200, 'Hospital blood requests retrieved', {
        requests: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrevious: false },
      });
    }

    const { search, status, urgency, bloodGroup, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = req.query;

    // OWNERSHIP SECURITY: Query ONLY requests belonging to this hospital
    const query = { hospitalId: profile._id };

    if (status && status.toUpperCase() !== 'ALL') {
      query.status = status.toUpperCase();
    }
    if (urgency && urgency.toUpperCase() !== 'ALL') {
      query.urgency = urgency.toUpperCase();
    }
    if (bloodGroup && bloodGroup.toUpperCase() !== 'ALL') {
      query.bloodGroup = bloodGroup.toUpperCase();
    }

    if (search && search.trim()) {
      const s = search.trim();
      const regex = new RegExp(s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
      query.$or = [
        { patientReference: regex },
        { reason: regex },
        { 'location.city': regex },
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
      BloodRequest.find(query).sort(sortObj).skip(skip).limit(l),
      BloodRequest.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / l) || 1;

    return sendSuccess(res, 200, 'Hospital blood requests retrieved', {
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
    console.error('[Get Blood Requests Error]:', error);
    return sendError(res, 500, 'Failed to fetch blood requests.', 'SERVER_ERROR');
  }
};

/**
 * @desc    Get Single Blood Request by ID (Ownership Checked)
 * @route   GET /api/hospital/requests/:id
 * @access  Private (HOSPITAL)
 */
const getBloodRequestById = async (req, res) => {
  try {
    const profile = await getOrCreateHospitalProfile(req.user._id, req.user.hospitalName, req.user.phone);

    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return sendError(res, 404, 'Blood request not found.', 'REQUEST_NOT_FOUND');
    }

    // OWNERSHIP SECURITY CHECK
    if (request.hospitalId.toString() !== profile._id.toString()) {
      return sendError(res, 403, 'Forbidden: You do not have permission to view this request.', 'AUTH_FORBIDDEN');
    }

    return sendSuccess(res, 200, 'Blood request details retrieved', {
      request,
    });
  } catch (error) {
    console.error('[Get Request Details Error]:', error);
    return sendError(res, 500, 'Failed to fetch request details.', 'SERVER_ERROR');
  }
};

/**
 * @desc    Get Smart Donor Matches for a Specific Blood Request (Stage 5)
 * @route   GET /api/hospital/requests/:id/matches
 * @access  Private (HOSPITAL - Ownership Checked)
 */
const getBloodRequestMatches = async (req, res) => {
  try {
    const profile = await getOrCreateHospitalProfile(req.user._id, req.user.hospitalName, req.user.phone);

    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return sendError(res, 404, 'Blood request not found.', 'REQUEST_NOT_FOUND');
    }

    // OWNERSHIP SECURITY CHECK
    if (request.hospitalId.toString() !== profile._id.toString()) {
      return sendError(res, 403, 'Forbidden: You do not have permission to access matches for this request.', 'AUTH_FORBIDDEN');
    }

    // Reject matching for fulfilled or cancelled requests
    if (request.status === 'FULFILLED' || request.status === 'CANCELLED') {
      return sendError(
        res,
        400,
        `Matching is unavailable for ${request.status.toLowerCase()} requests.`,
        'INVALID_REQUEST_STATUS'
      );
    }

    // Execute Smart Donor Matching Engine
    const matchResults = await findMatchesForBloodRequest(request, profile);

    return sendSuccess(res, 200, 'Smart donor matches calculated successfully', matchResults);
  } catch (error) {
    console.error('[Get Blood Request Matches Error]:', error);
    return sendError(res, 500, 'Failed to calculate donor matches.', 'SERVER_ERROR');
  }
};

/**
 * @desc    Update Blood Request (fulfillment / details with ownership check)
 * @route   PATCH /api/hospital/requests/:id
 * @access  Private (HOSPITAL)
 */
const updateBloodRequest = async (req, res) => {
  try {
    const profile = await getOrCreateHospitalProfile(req.user._id, req.user.hospitalName, req.user.phone);

    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return sendError(res, 404, 'Blood request not found.', 'REQUEST_NOT_FOUND');
    }

    // OWNERSHIP SECURITY CHECK
    if (request.hospitalId.toString() !== profile._id.toString()) {
      return sendError(res, 403, 'Forbidden: You do not have permission to modify this request.', 'AUTH_FORBIDDEN');
    }

    const { unitsFulfilled, status, reason, urgency, requiredDate } = req.body;

    if (unitsFulfilled !== undefined) {
      if (typeof unitsFulfilled !== 'number' || unitsFulfilled < 0) {
        return sendError(res, 400, 'Units fulfilled cannot be negative.', 'VALIDATION_ERROR');
      }
      if (unitsFulfilled > request.unitsRequired) {
        return sendError(res, 400, `Units fulfilled (${unitsFulfilled}) cannot exceed units required (${request.unitsRequired}).`, 'VALIDATION_ERROR');
      }
      request.unitsFulfilled = Math.floor(unitsFulfilled);
    }

    if (status && REQUEST_STATUSES.includes(status)) {
      request.status = status;
    }

    if (reason && typeof reason === 'string') request.reason = reason.trim();
    if (urgency && URGENCY_LEVELS.includes(urgency)) request.urgency = urgency;
    if (requiredDate) request.requiredDate = new Date(requiredDate);

    await request.save();

    return sendSuccess(res, 200, 'Blood request updated successfully', {
      request,
    });
  } catch (error) {
    console.error('[Update Blood Request Error]:', error);
    return sendError(res, 500, 'Failed to update blood request.', 'SERVER_ERROR');
  }
};

/**
 * @desc    Cancel Blood Request (Ownership Checked)
 * @route   DELETE /api/hospital/requests/:id
 * @access  Private (HOSPITAL)
 */
const cancelBloodRequest = async (req, res) => {
  try {
    const profile = await getOrCreateHospitalProfile(req.user._id, req.user.hospitalName, req.user.phone);

    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return sendError(res, 404, 'Blood request not found.', 'REQUEST_NOT_FOUND');
    }

    // OWNERSHIP SECURITY CHECK
    if (request.hospitalId.toString() !== profile._id.toString()) {
      return sendError(res, 403, 'Forbidden: You do not have permission to cancel this request.', 'AUTH_FORBIDDEN');
    }

    request.status = 'CANCELLED';
    await request.save();

    return sendSuccess(res, 200, 'Blood request cancelled successfully', {
      request,
    });
  } catch (error) {
    console.error('[Cancel Blood Request Error]:', error);
    return sendError(res, 500, 'Failed to cancel blood request.', 'SERVER_ERROR');
  }
};

module.exports = {
  getProfile,
  updateProfile,
  createBloodRequest,
  getBloodRequests,
  getBloodRequestById,
  getBloodRequestMatches,
  updateBloodRequest,
  cancelBloodRequest,
};
