const mongoose = require('mongoose');

const donationRecordSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    unitsDonated: {
      type: Number,
      default: 1,
    },
    donationDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    location: {
      type: String,
      trim: true,
      default: 'Main Hospital Blood Bank',
    },
    certificateId: {
      type: String,
      unique: true,
      default: function () {
        return `LP-CERT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      },
    },
    status: {
      type: String,
      enum: ['COMPLETED', 'SCHEDULED', 'CANCELLED'],
      default: 'COMPLETED',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DonationRecord', donationRecordSchema);
