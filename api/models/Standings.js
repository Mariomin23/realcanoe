const mongoose = require('mongoose');

const standingsSchema = new mongoose.Schema({
  position:      { type: Number, required: true, min: 1 },
  name:          { type: String, required: true, trim: true, maxlength: 100 },
  played:        { type: Number, default: 0, min: 0 },
  points:        { type: Number, default: 0, min: 0 },
  isHighlighted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Standings', standingsSchema);
