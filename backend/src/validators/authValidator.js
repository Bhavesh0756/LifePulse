const { BLOOD_GROUPS, ROLES } = require('../models/User');

/**
 * Validate Registration Payload
 */
const validateRegisterInput = (data) => {
  const errors = [];
  const { name, email, password, phone, role, bloodGroup, hospitalName } = data;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Full Name is required' });
  }

  if (!email || typeof email !== 'string' || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) {
    errors.push({ field: 'email', message: 'Valid email address is required' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
    errors.push({ field: 'phone', message: 'Valid phone number is required' });
  }

  if (!role || (role !== ROLES.DONOR && role !== ROLES.HOSPITAL)) {
    errors.push({ field: 'role', message: 'Role must be DONOR or HOSPITAL' });
  }

  if (role === ROLES.DONOR) {
    if (!bloodGroup || !BLOOD_GROUPS.includes(bloodGroup)) {
      errors.push({ field: 'bloodGroup', message: 'Valid blood group is required for donors' });
    }
  }

  if (role === ROLES.HOSPITAL) {
    if (!hospitalName || typeof hospitalName !== 'string' || hospitalName.trim().length === 0) {
      errors.push({ field: 'hospitalName', message: 'Hospital Name is required' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate Login Payload
 */
const validateLoginInput = (data) => {
  const errors = [];
  const { email, password } = data;

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email address is required' });
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
};
