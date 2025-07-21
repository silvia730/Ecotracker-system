// Mock data and cancer risk calculator for seeding

const SUB_LOCATIONS = [
  { name: 'Industrial Area', industrialProximity: true },
  { name: 'Dandora', industrialProximity: true },
  { name: 'Kibera', industrialProximity: true },
  { name: 'Westlands', industrialProximity: false },
  { name: 'Karen', industrialProximity: false }
];

function generateMockPollutionData() {
  // Generate random CO2 levels for each location
  return SUB_LOCATIONS.map(loc => ({
    location: loc.name,
    co2Level: Math.floor(Math.random() * 1000) + 300, // 300-1300 ppm
    timestamp: new Date()
  }));
}

function calculateCancerRisk(co2Level, industrialProximity) {
  return (co2Level * 0.002) + (industrialProximity ? 0.3 : 0);
}

const mongoose = require('mongoose');
const Quest = require('../models/Quest');

const quests = [
  {
    title: 'First Report',
    description: 'Report pollution at any location.',
    goal: 1,
    type: 'report',
    reward: 'Eco Warrior NFT',
    active: true,
  },
  {
    title: 'Eco Reporter',
    description: 'Report pollution 5 times.',
    goal: 5,
    type: 'report',
    reward: 'Green Guardian NFT',
    active: true,
  },
  {
    title: 'Explorer',
    description: 'Report pollution in 3 different locations.',
    goal: 3,
    type: 'explore',
    reward: 'Explorer Badge',
    active: true,
  },
];

// Use the provided MongoDB URI
const MONGODB_URI = 'mongodb+srv://silvianjeri3580:%2307silvia%2Cnjeri@ecotracker-cluster.ded7opk.mongodb.net/ecotracker-cluster?retryWrites=true&w=majority&appName=ecotracker-cluster';

async function seedQuests() {
  await mongoose.connect(MONGODB_URI);
  await Quest.deleteMany({});
  await Quest.insertMany(quests);
  console.log('Quests seeded!');
  await mongoose.disconnect();
}

if (require.main === module) {
  seedQuests();
}

module.exports = {
  SUB_LOCATIONS,
  generateMockPollutionData,
  calculateCancerRisk
}; 