const { User, ROLES, BLOOD_GROUPS } = require('./User');
const { DonorProfile, ELIGIBILITY_STATUS } = require('./DonorProfile');
const { HospitalProfile, VERIFICATION_STATUSES } = require('./HospitalProfile');
const { BloodRequest, URGENCY_LEVELS, REQUEST_STATUSES } = require('./BloodRequest');
const { DonorConsent, CONSENT_STATUSES } = require('./DonorConsent');
const DonationRecord = require('./DonationRecord');
const { Notification, NOTIFICATION_TYPES } = require('./Notification');

module.exports = {
  User,
  ROLES,
  BLOOD_GROUPS,
  DonorProfile,
  ELIGIBILITY_STATUS,
  HospitalProfile,
  VERIFICATION_STATUSES,
  BloodRequest,
  URGENCY_LEVELS,
  REQUEST_STATUSES,
  DonorConsent,
  CONSENT_STATUSES,
  DonationRecord,
  Notification,
  NOTIFICATION_TYPES,
};
