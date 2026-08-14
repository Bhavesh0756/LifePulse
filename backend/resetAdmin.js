const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./src/config/db');
const { User } = require('./src/models/User');

dotenv.config();

const resetAdmin = async () => {
  try {
    await connectDB();
    const email = 'admin@lifepulse.org';
    console.log(`Deleting existing user: ${email}`);
    await User.deleteOne({ email: email.toLowerCase() });
    console.log('User deleted successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

resetAdmin();
