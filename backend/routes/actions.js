const express = require('express');
const router = express.Router();

// Log/create actions for accepted quests
router.post('/', (req, res) => {
  res.json({ message: 'Actions route works!' });
});

module.exports = router;
