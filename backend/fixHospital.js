const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const { User } = require('./src/models/User');
const { HospitalProfile } = require('./src/models/HospitalProfile');

dotenv.config();

const fixHospital = async () => {
  try {
    await connectDB();
    const email = 'bhaveshgambhirrao243@gmail.com';
    const user = await User.findOne({ email });
    if (user) {
      user.isVerified = true;
      await user.save();
      console.log('Fixed User isVerified to true');
      
      const profile = await HospitalProfile.findOne({ userId: user._id });
      if (profile) {
        profile.isVerified = true;
        profile.verificationStatus = 'VERIFIED';
        await profile.save();
        console.log('Fixed HospitalProfile status to VERIFIED');
      }
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixHospital();
