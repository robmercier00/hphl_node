const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  gamesPlayed: {
    type: Number,
    required: false,
    default: 0
  },
  goals: {
    type: Number,
    required: false,
    default: 0
  },
  assists: {
    type: Number,
    required: false,
    default: 0
  },
  shotsAgainst: {
    type: Number,
    required: false
  },
  saves: {
    type: Number,
    required: false
  },
  goalsAgainst: {
    type: Number,
    required: false
  },
  isGoalie: {
    type: Boolean,
    required: false,
    default: false
  },
  isCurrentGoalie: {
    type: Boolean,
    required: false,
    default: false
  }
});

module.exports = Player = mongoose.model('player', PlayerSchema);
