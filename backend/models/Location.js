const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
});

module.exports = mongoose.model('Location', locationSchema); 