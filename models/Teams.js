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
  }
});

module.exports = Team = mongoose.model('team', TeamSchema);
