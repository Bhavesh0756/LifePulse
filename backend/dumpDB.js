const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const { User } = require('./src/models/User');
const { HospitalProfile } = require('./src/models/HospitalProfile');

dotenv.config();

const dumpDB = async () => {
  try {
    await connectDB();
    const users = await User.find({ role: 'HOSPITAL' });
    console.log('--- HOSPITAL USERS ---');
    users.forEach(u => console.log(`User: ${u.email} | _id: ${u._id} | isVerified: ${u.isVerified}`));

    const profiles = await HospitalProfile.find();
    console.log('--- HOSPITAL PROFILES ---');
    profiles.forEach(p => console.log(`Profile _id: ${p._id} | userId: ${p.userId} | isVerified: ${p.isVerified} | status: ${p.verificationStatus}`));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

dumpDB();
