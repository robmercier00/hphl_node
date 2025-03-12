const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: false
  },
  season: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  players: {
    type: Array,
    required: false
  },
  win: {
    type: Number,
    required: true,
    default: 0
  },
  loss: {
    type: Number,
    required: true,
    default: 0
  },
  tie: {
    type: Number,
    required: true,
    default: 0
  },
  points: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = Team = mongoose.model('team', TeamSchema);
