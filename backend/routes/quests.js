const express = require('express');
const router = express.Router();
const Quest = require('../models/Quest');
const UserQuest = require('../models/UserQuest');
const User = require('../models/User');

// GET /api/quests - List all quests
router.get('/', async (req, res) => {
  try {
    const quests = await Quest.find({ active: true });
    res.json(quests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/quests/assign - Assign a quest to a user
router.post('/assign', async (req, res) => {
  try {
    const { userId, questId } = req.body;
    if (!userId || !questId) return res.status(400).json({ error: 'userId and questId required' });
    // Prevent duplicate assignment
    const exists = await UserQuest.findOne({ userId, questId });
    if (exists) return res.status(400).json({ error: 'Quest already assigned to user' });
    const userQuest = await UserQuest.create({ userId, questId });
    res.json(userQuest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/quests/user/:userId - Get user's assigned quests and progress
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userQuests = await UserQuest.find({ userId }).populate('questId');
    res.json(userQuests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/quests/progress - Update quest progress for a user
router.post('/progress', async (req, res) => {
  try {
    const { userId, questId, increment } = req.body;
    if (!userId || !questId) return res.status(400).json({ error: 'userId and questId required' });
    const userQuest = await UserQuest.findOne({ userId, questId });
    if (!userQuest) return res.status(404).json({ error: 'UserQuest not found' });
    userQuest.progress += increment || 1;
    // Check if completed
    const quest = await Quest.findById(questId);
    if (userQuest.progress >= quest.goal) {
      userQuest.completed = true;
    }
    await userQuest.save();
    res.json(userQuest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/quests/claim - Mark quest as claimed
router.post('/claim', async (req, res) => {
  try {
    const { userId, questId } = req.body;
    if (!userId || !questId) return res.status(400).json({ error: 'userId and questId required' });
    const userQuest = await UserQuest.findOne({ userId, questId });
    if (!userQuest) return res.status(404).json({ error: 'UserQuest not found' });
    if (!userQuest.completed) return res.status(400).json({ error: 'Quest not completed yet' });
    if (userQuest.claimed) return res.status(400).json({ error: 'Reward already claimed' });
    userQuest.claimed = true;
    await userQuest.save();
    res.json(userQuest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
