const mongoose = require('mongoose');

const pollutionReportSchema = new mongoose.Schema({
  co2Level: { type: Number, required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PollutionReport', pollutionReportSchema); 