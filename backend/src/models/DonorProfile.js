const mongoose = require('mongoose');
const { BLOOD_GROUPS } = require('./User');

const ELIGIBILITY_STATUS = {
  ELIGIBLE: 'ELIGIBLE',
  TEMPORARILY_INELIGIBLE: 'TEMPORARILY_INELIGIBLE',
  PERMANENTLY_INELIGIBLE: 'PERMANENTLY_INELIGIBLE',
};

const donorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bloodGroup: {
      type: String,
      enum: BLOOD_GROUPS,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    address: {
      street: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      state: { type: String, trim: true, default: '' },
      zipCode: { type: String, trim: true, default: '' },
    },
    locationCoordinates: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
    preferredRadiusKm: {
      type: Number,
      default: 25,
      min: 5,
      max: 100,
    },
    eligibilityStatus: {
      type: String,
      enum: Object.values(ELIGIBILITY_STATUS),
      default: ELIGIBILITY_STATUS.ELIGIBLE,
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    nextEligibleDate: {
      type: Date,
      default: null,
    },
    emergencyContact: {
      name: { type: String, trim: true, default: '' },
      phone: { type: String, trim: true, default: '' },
      relation: { type: String, trim: true, default: '' },
    },
    totalDonationsCount: {
      type: Number,
      default: 0,
    },
    livesSavedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Index for High-Performance Matching Engine Queries
donorProfileSchema.index({
  isAvailable: 1,
  eligibilityStatus: 1,
  bloodGroup: 1,
});

module.exports = {
  DonorProfile: mongoose.model('DonorProfile', donorProfileSchema),
  ELIGIBILITY_STATUS,
};
