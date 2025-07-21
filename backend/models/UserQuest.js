const mongoose = require('mongoose');

const userQuestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest', required: true },
  progress: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  claimed: { type: Boolean, default: false },
});

module.exports = mongoose.model('UserQuest', userQuestSchema); 