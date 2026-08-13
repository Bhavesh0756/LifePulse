const { DonorProfile, ELIGIBILITY_STATUS } = require('../models/DonorProfile');
const { DonorConsent } = require('../models/DonorConsent');
const { getCompatibleDonorGroups, isBloodCompatible, MEDICAL_DISCLAIMER } = require('../utils/bloodCompatibility');
const { calculateDistanceKm } = require('../utils/distanceCalculator');

/**
 * Smart Donor Matching Engine Service (Stage 5 & Stage 6 Integration)
 * Executes Hard Filtering, Haversine Distance Evaluation, 100-Point Scoring, and Donor Consent Unlocking.
 */
async function findMatchesForBloodRequest(bloodRequest, hospitalProfile) {
  const recipientGroup = bloodRequest.bloodGroup;
  const compatibleDonorGroups = getCompatibleDonorGroups(recipientGroup);

  if (compatibleDonorGroups.length === 0) {
    return {
      medicalDisclaimer: MEDICAL_DISCLAIMER,
      requestSummary: {
        requestId: bloodRequest._id,
        bloodGroup: recipientGroup,
        unitsRequired: bloodRequest.unitsRequired,
        urgency: bloodRequest.urgency,
        status: bloodRequest.status,
      },
      matches: [],
    };
  }

  // 1. HARD FILTERS DATABASE QUERY
  // Select active, available, eligible donors whose blood group is compatible
  const candidateProfiles = await DonorProfile.find({
    isAvailable: true,
    eligibilityStatus: ELIGIBILITY_STATUS.ELIGIBLE,
    bloodGroup: { $in: compatibleDonorGroups },
  }).populate({
    path: 'user',
    select: 'name email role phone isActive',
    match: { role: 'DONOR', isActive: true },
  });

  // Fetch all persisted DonorConsent records for this blood request
  const consentRecords = await DonorConsent.find({ bloodRequestId: bloodRequest._id });
  const consentMap = new Map();
  consentRecords.forEach((c) => {
    consentMap.set(c.donorId.toString(), c);
  });

  const hospitalCoords = hospitalProfile?.locationCoordinates || null;
  const rankedMatches = [];

  // 2. HARD FILTER & SCORING PIPELINE FOR EACH CANDIDATE
  for (const donorProfile of candidateProfiles) {
    // Skip if user document failed populate or is inactive
    if (!donorProfile.user) continue;

    const donorUserId = donorProfile.user._id.toString();
    const donorCoords = donorProfile.locationCoordinates || null;

    // Calculate real Haversine distance in km if coordinates exist
    let approxDistanceKm = calculateDistanceKm(hospitalCoords, donorCoords);

    // Hard Location Filter: Exclude ONLY if coordinates exist AND distance exceeds donor's preferred radius
    if (
      approxDistanceKm !== null &&
      donorProfile.preferredRadiusKm &&
      approxDistanceKm > donorProfile.preferredRadiusKm
    ) {
      continue; // Exclude candidate exceeding radius boundary
    }

    // --- 3. TRANSPARENT MATCH SCORING (MAX 100 PTS) ---
    let matchFactors = [];

    // Factor 1: Blood Group Precision (Max 35 Points)
    let bloodScore = 0;
    if (donorProfile.bloodGroup === recipientGroup) {
      bloodScore = 35;
      matchFactors.push({ label: `Exact Blood Group Match (${donorProfile.bloodGroup})`, score: 35, passed: true });
    } else {
      bloodScore = 25;
      matchFactors.push({ label: `Compatible Alternate Blood Group (${donorProfile.bloodGroup})`, score: 25, passed: true });
    }

    // Factor 2: Proximity / Distance (Max 45 Points)
    let proximityScore = 0;
    if (approxDistanceKm !== null) {
      const radius = donorProfile.preferredRadiusKm || 25;
      const ratio = Math.max(0, 1 - approxDistanceKm / radius);
      proximityScore = Math.round(ratio * 45);
      matchFactors.push({
        label: `Proximity (${approxDistanceKm} km away)`,
        score: proximityScore,
        passed: true,
      });
    } else {
      proximityScore = 20; // Neutral score when location coordinates are missing
      matchFactors.push({
        label: `Location Distance Unavailable`,
        score: 20,
        passed: false,
      });
    }

    // Factor 3: Donor Activity & History (Max 20 Points)
    let activityScore = 0;
    if (donorProfile.totalDonationsCount > 0) {
      activityScore = 20;
      matchFactors.push({
        label: `Verified Past Donation Activity (${donorProfile.totalDonationsCount} donations)`,
        score: 20,
        passed: true,
      });
    } else {
      activityScore = 10;
      matchFactors.push({ label: `New Registered Donor`, score: 10, passed: true });
    }

    const totalMatchScore = Math.min(bloodScore + proximityScore + activityScore, 100);

    // --- 4. STAGE 6 DONOR CONSENT & CONTACT UNLOCKING CHECK ---
    const consentDoc = consentMap.get(donorUserId);
    const isConsentAccepted = consentDoc && consentDoc.status === 'ACCEPTED';

    const safeMatchPayload = {
      donorId: donorProfile.user._id,
      bloodGroup: donorProfile.bloodGroup,
      isAvailable: donorProfile.isAvailable,
      eligibilityStatus: donorProfile.eligibilityStatus,
      approxDistanceKm: approxDistanceKm, // real float or null
      city: donorProfile.address?.city || 'Local Area',
      totalDonationsCount: donorProfile.totalDonationsCount,
      matchScore: totalMatchScore,
      matchFactors: matchFactors,
      consentStatus: consentDoc ? consentDoc.status : 'NONE',
      contactUnlocked: isConsentAccepted,
      consentGivenAt: isConsentAccepted ? consentDoc.consentGivenAt : null,
    };

    // PRIVACY UNLOCKING RULE: Reveal donor contact info ONLY if donor explicitly accepted consent
    if (isConsentAccepted) {
      safeMatchPayload.donorName = donorProfile.user.name;
      safeMatchPayload.phone = donorProfile.user.phone;
      safeMatchPayload.email = donorProfile.user.email;
    }

    rankedMatches.push(safeMatchPayload);
  }

  // 5. SORT MATCHES: Match Score Descending, Distance Ascending
  rankedMatches.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    if (a.approxDistanceKm !== null && b.approxDistanceKm !== null) {
      return a.approxDistanceKm - b.approxDistanceKm;
    }
    return 0;
  });

  return {
    medicalDisclaimer: MEDICAL_DISCLAIMER,
    requestSummary: {
      requestId: bloodRequest._id,
      bloodGroup: bloodRequest.bloodGroup,
      unitsRequired: bloodRequest.unitsRequired,
      unitsFulfilled: bloodRequest.unitsFulfilled,
      urgency: bloodRequest.urgency,
      status: bloodRequest.status,
      city: bloodRequest.location?.city,
    },
    totalMatchesCount: rankedMatches.length,
    matches: rankedMatches,
  };
}

module.exports = {
  findMatchesForBloodRequest,
};
