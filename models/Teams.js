const mongoose = require('mongoose');
// mongoose.set('debug', true);

const TeamSchema = new mongoose.Schema({
  _id: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  season: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true
  },
  players: {
    type: Array,
    required: true
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
