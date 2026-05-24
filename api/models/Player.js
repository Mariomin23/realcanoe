const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  number: { type: Number, required: true, min: 1, max: 99 },
  position: { type: String, required: true, trim: true, maxlength: 60 },
  category: {
    type: String,
    enum: ['delantera', 'medios', 'trasera'],
    required: true
  },
  nationality: { type: String, default: '🇪🇸', maxlength: 10 },
  age: { type: Number, min: 14, max: 65 },
  stats: {
    partidos: { type: Number, default: 0, min: 0 },
    tries:    { type: Number, default: 0, min: 0 },
    tackles:  { type: Number, default: 0, min: 0 }
  },
  avatar: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
