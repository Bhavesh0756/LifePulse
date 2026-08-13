const mongoose = require('mongoose');

const CONSENT_STATUSES = ['PENDING', 'ACCEPTED', 'DECLINED', 'WITHDRAWN'];

const donorConsentSchema = new mongoose.Schema(
  {
    bloodRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodRequest',
      required: true,
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HospitalProfile',
      required: true,
    },
    status: {
      type: String,
      enum: CONSENT_STATUSES,
      default: 'PENDING',
      required: true,
    },
    consentGivenAt: {
      type: Date,
      default: null,
    },
    contactUnlockedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index: One consent/response record per donor per blood request
donorConsentSchema.index(
  { bloodRequestId: 1, donorId: 1 },
  { unique: true }
);

// Query optimization indexes
donorConsentSchema.index({ hospitalId: 1, bloodRequestId: 1 });
donorConsentSchema.index({ donorId: 1, status: 1 });

module.exports = {
  DonorConsent: mongoose.model('DonorConsent', donorConsentSchema),
  CONSENT_STATUSES,
};
