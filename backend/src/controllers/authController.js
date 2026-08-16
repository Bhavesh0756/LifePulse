const { User, ROLES } = require('../models/User');
const { HospitalProfile } = require('../models/HospitalProfile');
const { validateRegisterInput, validateLoginInput } = require('../validators/authValidator');
const { generateToken, sendAuthTokenCookie, clearAuthTokenCookie } = require('../utils/jwt');
const { sendError, sendSuccess } = require('../utils/apiError');
const notificationService = require('../services/notificationService');
const { NOTIFICATION_TYPES } = require('../models/Notification');

/**
 * @desc    Register a new DONOR or HOSPITAL user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, bloodGroup, hospitalName } = req.body;

    // 1. Reject public ADMIN registration
    if (role === ROLES.ADMIN) {
      return sendError(
        res,
        403,
        'Public registration for ADMIN accounts is prohibited. Please contact system administrator.',
        'ADMIN_PUBLIC_REGISTRATION_FORBIDDEN'
      );
    }

    // 2. Validate input fields
    const { isValid, errors } = validateRegisterInput(req.body);
    if (!isValid) {
      return sendError(res, 400, 'Validation error', 'AUTH_VALIDATION_ERROR', errors);
    }

    // 3. Normalize email and check if user already exists
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return sendError(res, 409, 'An account with this email address already exists.', 'AUTH_EMAIL_EXISTS');
    }

    // 4. Create User (passwordHash assigned; Mongoose pre-save hook handles bcrypt hashing)
    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: password,
      phone: phone.trim(),
      role,
      bloodGroup: role === ROLES.DONOR ? bloodGroup : undefined,
      hospitalName: role === ROLES.HOSPITAL ? hospitalName.trim() : undefined,
      isVerified: role === ROLES.DONOR,
    });

    await newUser.save();

    // 5. If HOSPITAL role, auto-initialize HospitalProfile for verification queue
    if (role === ROLES.HOSPITAL) {
      const hospitalProfile = new HospitalProfile({
        userId: newUser._id,
        hospitalName: hospitalName.trim(),
        phone: phone.trim(),
        isVerified: false,
        verificationStatus: 'PENDING',
      });
      await hospitalProfile.save();

      // Trigger Stage 8 Notification to System Admins
      notificationService.notifyAdmins({
        type: NOTIFICATION_TYPES.HOSPITAL_VERIFICATION_PENDING,
        title: 'New Hospital Verification Required',
        message: `Hospital ${hospitalName.trim()} registered and requires verification.`,
        relatedEntityType: 'HospitalProfile',
        relatedEntityId: hospitalProfile._id,
        idempotencyKey: `HOSPITAL_VERIFICATION_PENDING_${hospitalProfile._id}`,
      }).catch((err) => console.error('[Notification Trigger Error]:', err));
    }

    // 6. Generate token and set httpOnly cookie
    const token = generateToken(newUser);
    sendAuthTokenCookie(res, newUser, token);

    // 7. Return safe user data
    return sendSuccess(res, 201, 'Registration successful', {
      user: newUser.toSafeObject(),
    });
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    return sendError(res, 500, 'Unable to complete registration. Please try again later.', 'SERVER_ERROR');
  }
};

/**
 * @desc    Authenticate User & get token cookie
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    const { isValid, errors } = validateLoginInput(req.body);
    if (!isValid) {
      return sendError(res, 400, 'Validation error', 'AUTH_VALIDATION_ERROR', errors);
    }

    // 2. Find user by email (explicitly select passwordHash)
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
    if (!user) {
      return sendError(res, 401, 'Invalid email or password.', 'AUTH_INVALID_CREDENTIALS');
    }

    // 3. Check password using bcrypt
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password.', 'AUTH_INVALID_CREDENTIALS');
    }

    // 4. Check if account is active
    if (!user.isActive) {
      return sendError(res, 403, 'Account has been deactivated. Please contact support.', 'AUTH_ACCOUNT_INACTIVE');
    }

    // 5. Generate token & set httpOnly cookie
    const token = generateToken(user);
    sendAuthTokenCookie(res, user, token);

    // 6. Return safe user response
    return sendSuccess(res, 200, 'Login successful', {
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    return sendError(res, 500, 'Unable to log in. Please try again later.', 'SERVER_ERROR');
  }
};

/**
 * @desc    Logout User & clear httpOnly cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
  try {
    clearAuthTokenCookie(res);
    return sendSuccess(res, 200, 'Logout successful');
  } catch (error) {
    return sendError(res, 500, 'Logout error', 'SERVER_ERROR');
  }
};

/**
 * @desc    Get Current Authenticated User (Session restoration)
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    return sendSuccess(res, 200, 'User profile fetched', {
      user: req.user.toSafeObject(),
    });
  } catch (error) {
    return sendError(res, 500, 'Error fetching profile', 'SERVER_ERROR');
  }
};

/**
 * @desc    Update Current Authenticated User's Profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const { name, phone, bloodGroup } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, 'User account not found.', 'USER_NOT_FOUND');
    }

    if (name !== undefined && name.trim()) user.name = name.trim();
    if (phone !== undefined && phone.trim()) user.phone = phone.trim();
    if (bloodGroup !== undefined && user.role === ROLES.DONOR) user.bloodGroup = bloodGroup;

    await user.save();

    return sendSuccess(res, 200, 'Profile updated successfully', {
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error('[Auth Update Profile Error]:', error);
    return sendError(res, 500, 'Unable to update user profile.', 'SERVER_ERROR');
  }
};
module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
};
