const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  date:        { type: String, required: true, trim: true },
  time:        { type: String, trim: true },
  homeTeam:    { type: String, required: true, trim: true, maxlength: 100 },
  awayTeam:    { type: String, required: true, trim: true, maxlength: 100 },
  venue:       { type: String, trim: true, maxlength: 200 },
  competition: { type: String, trim: true, maxlength: 100 },
  homeScore:   { type: Number, default: null, min: 0 },
  awayScore:   { type: Number, default: null, min: 0 },
  status: {
    type: String,
    enum: ['upcoming', 'win', 'draw', 'loss'],
    default: 'upcoming'
  },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
