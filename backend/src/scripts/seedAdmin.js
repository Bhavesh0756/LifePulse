const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');
const { User, ROLES } = require('../models/User');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@lifepulse.org';
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('[LifePulse Admin Seed Error]: ADMIN_PASSWORD environment variable is missing. Please set it in backend/.env.');
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existingAdmin) {
      console.log(`[LifePulse Admin Seed]: Admin account (${adminEmail}) already exists.`);
      process.exit(0);
    }

    const adminUser = new User({
      name: 'LifePulse System Admin',
      email: adminEmail.toLowerCase(),
      passwordHash: adminPassword,
      phone: '+15550000000',
      role: ROLES.ADMIN,
      isVerified: true,
      isActive: true,
    });

    await adminUser.save();
    console.log(`[LifePulse Admin Seed]: Admin account created successfully!`);
    console.log(`- Email: ${adminEmail}`);
    console.log(`- Role: ${ROLES.ADMIN}`);
    process.exit(0);
  } catch (error) {
    console.error('[LifePulse Admin Seed Failed]:', error.message);
    process.exit(1);
  }
};

seedAdmin();
