const express = require('express');
const router = express.Router();
const PollutionReport = require('../models/PollutionReport');
const CancerRisk = require('../models/CancerRisk');
const User = require('../models/User');
const Location = require('../models/Location'); // Added import for Location
const { SUB_LOCATIONS, calculateCancerRisk } = require('../seed/mockData');
const { mintNFT } = require('../services/nftService');

// POST /api/report: Save pollution report and trigger cancer risk calculation
router.post('/report', async (req, res) => {
  try {
    console.log('Received report payload:', req.body); // Log the incoming data
    const { userId, co2Level, locationName } = req.body;
    if (!userId || !co2Level || !locationName) {
      return res.status(400).json({ error: 'userId, co2Level, and locationName are required.' });
    }

    // Find location by name
    const locationDoc = await Location.findOne({ name: locationName });
    if (!locationDoc) return res.status(404).json({ error: 'Location not found.' });

    // Save pollution report
    const report = await PollutionReport.create({ co2Level, location: locationDoc._id, user: userId, timestamp: new Date() });

    // Increment user's reportsCount
    const updatedUser = await User.findByIdAndUpdate(userId, { $inc: { reportsCount: 1 } }, { new: true });
    if (updatedUser) {
      console.log(`User ${userId} reportsCount incremented to:`, updatedUser.reportsCount);
    } else {
      console.log(`User ${userId} not found when incrementing reportsCount.`);
    }

    // Calculate cancer risk
    // (Assume industrialProximity is stored in Location or use a mapping as before)
    // For now, use a static mapping for demo
    const industrialProximity = ['Industrial Area', 'Dandora', 'Kibera'].includes(locationName);
    const riskScore = calculateCancerRisk(co2Level, industrialProximity);

    // Save or update cancer risk for location
    await CancerRisk.findOneAndUpdate(
      { location: locationDoc._id },
      { riskScore },
      { upsert: true, new: true }
    );

    res.json({ message: 'Report saved and cancer risk calculated.', report });
  } catch (err) {
    console.error('Error in /api/report:', err); // Log the error
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// POST /api/mint-nft/:userId: Mint NFT when user reaches 3 reports
router.post('/mint-nft/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Count user's reports (assuming location is unique per report)
    const reportCount = await PollutionReport.countDocuments({ location: user.location });
    if (reportCount < 3) {
      return res.status(400).json({ error: 'User must have at least 3 reports to mint NFT.' });
    }

    // Mint NFT (tokenURI can be customized)
    const tokenURI = `https://example.com/metadata/${userId}`;
    const privateKey = process.env.NFT_MINTER_PRIVATE_KEY; // Set this in your .env
    if (!privateKey) return res.status(500).json({ error: 'NFT minter private key not set.' });

    const receipt = await mintNFT(user.email, tokenURI, privateKey); // user.email as recipient address

    // Increment user's nftsEarned
    await User.findByIdAndUpdate(userId, { $inc: { nftsEarned: 1 } });

    res.json({ message: 'NFT minted!', receipt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/locations-data: Return all locations with latest co2Level and cancerRisk
router.get('/locations-data', async (req, res) => {
  try {
    const locations = await Location.find();
    const data = await Promise.all(locations.map(async (loc) => {
      const latestReport = await PollutionReport.findOne({ location: loc._id }).sort({ timestamp: -1 });
      const cancerRisk = await CancerRisk.findOne({ location: loc._id });
      return {
        name: loc.name,
        coords: { lat: loc.lat, lng: loc.lng },
        co2Level: latestReport ? latestReport.co2Level : null,
        cancerRisk: cancerRisk ? Math.round(cancerRisk.riskScore * 100) / 100 : null
      };
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reports/user/:userId - Get all reports for a user
router.get('/reports/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Find all reports for this user by user field
    const reports = await PollutionReport.find({ user: user._id }).populate('location');
    // Map to include location name
    const mapped = reports.map(r => ({
      _id: r._id,
      co2Level: r.co2Level,
      location: r.location._id,
      locationName: r.location.name,
      timestamp: r.timestamp
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 