require('dotenv').config();
const mongoose = require('mongoose');
const PollutionReport = require('./models/PollutionReport');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const result = await PollutionReport.deleteMany({});
    console.log('Deleted pollution reports:', result.deletedCount);
    process.exit();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 