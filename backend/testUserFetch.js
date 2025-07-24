require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User'); // all lowercase -> capital U

const userId = '687e3cd297716956c7c28dd0';

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const user = await User.findById(userId);
    console.log('Fetched user:', user);
    process.exit();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 