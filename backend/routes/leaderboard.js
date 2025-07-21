const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/leaderboard: Top users by reportsCount
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'name reportsCount')
      .sort({ reportsCount: -1 })
      .limit(10);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 