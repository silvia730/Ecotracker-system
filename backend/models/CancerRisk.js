const mongoose = require('mongoose');

const cancerRiskSchema = new mongoose.Schema({
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  riskScore: { type: Number, required: true }
});

module.exports = mongoose.model('CancerRisk', cancerRiskSchema); 