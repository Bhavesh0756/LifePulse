const mongoose = require('mongoose');

const VERIFICATION_STATUSES = ['PENDING', 'VERIFIED', 'REJECTED'];

const hospitalProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    hospitalName: {
      type: String,
      required: [true, 'Hospital Name is required'],
      trim: true,
    },
    registrationNumber: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      required: [true, 'Hospital Phone Number is required'],
      trim: true,
    },
    emergencyContact: {
      name: { type: String, trim: true, default: '' },
      phone: { type: String, trim: true, default: '' },
      email: { type: String, trim: true, default: '' },
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
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: VERIFICATION_STATUSES,
      default: 'PENDING',
      required: true,
    },
    verificationNotes: {
      type: String,
      trim: true,
      default: '',
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for verification queries
hospitalProfileSchema.index({ verificationStatus: 1 });
hospitalProfileSchema.index({ isVerified: 1 });
hospitalProfileSchema.index({ verificationStatus: 1, updatedAt: -1 });

module.exports = {
  HospitalProfile: mongoose.model('HospitalProfile', hospitalProfileSchema),
  VERIFICATION_STATUSES,
};
