const mongoose = require('mongoose');

const SeasonSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  currentSeason: {
    type: Boolean,
    required: false
  }
});

module.exports = Season = mongoose.model('season', SeasonSchema);
