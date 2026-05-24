const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true, maxlength: 200 },
  excerpt:  { type: String, trim: true, maxlength: 600 },
  date:     { type: String, trim: true },
  category: { type: String, trim: true, maxlength: 60 },
  image:    { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
