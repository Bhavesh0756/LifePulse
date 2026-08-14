const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./src/config/db');
const { User } = require('./src/models/User');

dotenv.config();

const verifyLogin = async () => {
  try {
    await connectDB();

    const email = 'admin@lifepulse.org';
    const password = process.env.ADMIN_PASSWORD || 'your_admin_password_here';

    console.log(`Checking user: ${email}`);
    
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      console.log('User not found in DB!');
      process.exit(1);
    }
    console.log(`User found! Hash is: ${user.passwordHash}`);

    const isMatch = await user.comparePassword(password);
    console.log(`Password match result for "${password}": ${isMatch}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

verifyLogin();
