require('dotenv').config();
const mongoose = require('mongoose');
const Location = require('../models/Location');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecotracker';

const locations = [
  { name: 'Industrial Area', lat: -1.3081, lng: 36.8502 },
  { name: 'Dandora', lat: -1.2647, lng: 36.8903 },
  { name: 'Kibera', lat: -1.3127, lng: 36.7820 },
  { name: 'Westlands', lat: -1.2649, lng: 36.8121 },
  { name: 'Karen', lat: -1.3171, lng: 36.7154 }
];

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  await Location.deleteMany({});
  await Location.insertMany(locations);
  console.log('Seeded locations');

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
}); 