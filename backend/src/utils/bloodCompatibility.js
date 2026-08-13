/**
 * LifePulse Centralized RBC Blood Compatibility Matrix
 */

const BLOOD_COMPATIBILITY_MATRIX = {
  'O-': ['O-'],
  'O+': ['O+', 'O-'],
  'A-': ['A-', 'O-'],
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
};

/**
 * Medical Disclaimer
 */
const MEDICAL_DISCLAIMER =
  'This is an application-level coordination aid based on ABO/Rh blood-group matching. Final transfusion compatibility, cross-matching, and donor suitability must be independently verified by qualified healthcare professionals and hospital blood-bank protocols.';

/**
 * Get list of compatible donor blood groups for a given recipient/request blood group
 * @param {string} recipientBloodGroup - Blood group required (e.g. 'A+')
 * @returns {Array<string>} Array of compatible donor blood groups
 */
function getCompatibleDonorGroups(recipientBloodGroup) {
  if (!recipientBloodGroup || !BLOOD_COMPATIBILITY_MATRIX[recipientBloodGroup]) {
    return [];
  }
  return BLOOD_COMPATIBILITY_MATRIX[recipientBloodGroup];
}

/**
 * Check if a donor's blood group is compatible with a recipient's blood group
 * @param {string} donorGroup - Donor blood group
 * @param {string} recipientGroup - Recipient request blood group
 * @returns {boolean} True if compatible
 */
function isBloodCompatible(donorGroup, recipientGroup) {
  const compatibleList = getCompatibleDonorGroups(recipientGroup);
  return compatibleList.includes(donorGroup);
}

module.exports = {
  BLOOD_COMPATIBILITY_MATRIX,
  MEDICAL_DISCLAIMER,
  getCompatibleDonorGroups,
  isBloodCompatible,
};
