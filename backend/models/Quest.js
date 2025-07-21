const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  goal: { type: Number, required: true },
  type: { type: String, required: true }, // e.g., 'report', 'explore'
  reward: { type: String, required: true },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model('Quest', questSchema);
