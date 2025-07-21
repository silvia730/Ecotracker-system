require('dotenv').config();
const mongoose = require('mongoose');
const PollutionReport = require('../models/PollutionReport');
const CancerRisk = require('../models/CancerRisk');
const Location = require('../models/Location');
const { SUB_LOCATIONS, generateMockPollutionData, calculateCancerRisk } = require('./mockData');

// Update this with your actual MongoDB URI
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecotracker';

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  // Clear existing data
  await PollutionReport.deleteMany({});
  await CancerRisk.deleteMany({});

  // Fetch all locations and build a name->ObjectId map
  const locations = await Location.find({});
  const locationMap = {};
  locations.forEach(loc => {
    locationMap[loc.name] = loc._id;
  });

  // Generate and insert pollution reports with ObjectId references
  const pollutionData = generateMockPollutionData().map(report => ({
    ...report,
    location: locationMap[report.location] // convert name to ObjectId
  }));
  await PollutionReport.insertMany(pollutionData);
  console.log('Inserted pollution reports');

  // Generate and insert cancer risk data with ObjectId references
  const cancerRisks = pollutionData.map((report, idx) => ({
    location: report.location, // already ObjectId
    riskScore: calculateCancerRisk(report.co2Level, SUB_LOCATIONS[idx].industrialProximity)
  }));
  await CancerRisk.insertMany(cancerRisks);
  console.log('Inserted cancer risk data');

  await mongoose.disconnect();
  console.log('Seeding complete.');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
}); 