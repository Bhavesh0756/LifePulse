/**
 * LifePulse Centralized RBC Blood Compatibility Matrix
 */

const DONOR_TO_RECIPIENT_MATRIX = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
};

/**
 * Medical Disclaimer
 */
const MEDICAL_DISCLAIMER =
  'This is an application-level coordination aid based on ABO/Rh blood-group matching. Final transfusion compatibility, cross-matching, and donor suitability must be independently verified by qualified healthcare professionals and hospital blood-bank protocols.';

/**
 * Check if a donor's blood group is compatible with a recipient's blood group
 * @param {string} donorGroup - Donor blood group
 * @param {string} recipientGroup - Recipient request blood group
 * @returns {boolean} True if compatible
 */
function isBloodCompatible(donorGroup, recipientGroup) {
  if (!donorGroup || !DONOR_TO_RECIPIENT_MATRIX[donorGroup]) {
    return false;
  }
  return DONOR_TO_RECIPIENT_MATRIX[donorGroup].includes(recipientGroup);
}

/**
 * Get list of compatible donor blood groups for a given recipient/request blood group
 * @param {string} recipientBloodGroup - Blood group required (e.g. 'A+')
 * @returns {Array<string>} Array of compatible donor blood groups
 */
function getCompatibleDonorGroups(recipientBloodGroup) {
  const compatibleDonors = [];
  for (const [donor, recipients] of Object.entries(DONOR_TO_RECIPIENT_MATRIX)) {
    if (recipients.includes(recipientBloodGroup)) {
      compatibleDonors.push(donor);
    }
  }
  return compatibleDonors;
}

module.exports = {
  DONOR_TO_RECIPIENT_MATRIX,
  MEDICAL_DISCLAIMER,
  getCompatibleDonorGroups,
  isBloodCompatible,
};
