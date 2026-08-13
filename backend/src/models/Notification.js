const mongoose = require('mongoose');

const NOTIFICATION_TYPES = {
  BLOOD_REQUEST_MATCH: 'BLOOD_REQUEST_MATCH',
  DONOR_ACCEPTED: 'DONOR_ACCEPTED',
  DONOR_DECLINED: 'DONOR_DECLINED',
  CONSENT_RECEIVED: 'CONSENT_RECEIVED',
  REQUEST_CANCELLED: 'REQUEST_CANCELLED',
  REQUEST_FULFILLED: 'REQUEST_FULFILLED',
  HOSPITAL_VERIFICATION_PENDING: 'HOSPITAL_VERIFICATION_PENDING',
  HOSPITAL_VERIFIED: 'HOSPITAL_VERIFIED',
  HOSPITAL_REJECTED: 'HOSPITAL_REJECTED',
  CRITICAL_REQUEST: 'CRITICAL_REQUEST',
  ACCOUNT_STATUS: 'ACCOUNT_STATUS',
};

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recipientRole: {
      type: String,
      enum: ['DONOR', 'HOSPITAL', 'ADMIN'],
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    relatedEntityType: {
      type: String,
      enum: ['BloodRequest', 'DonorConsent', 'HospitalProfile', 'User'],
    },
    relatedEntityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    idempotencyKey: {
      type: String,
      sparse: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Index for High-Performance Queries (Unread Count & Filtered Lists)
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

// Unique Sparse Index for Duplicate Event Prevention
notificationSchema.index({ recipientId: 1, idempotencyKey: 1 }, { unique: true, sparse: true });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = {
  Notification,
  NOTIFICATION_TYPES,
};
