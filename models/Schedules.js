const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  _id: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true
  },
  season: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true
  },
  date: {
    type: Date,
    required: false
  },
  time: {
    type: String,
    required: false
  },
  homeTeam: {
    type: [mongoose.Schema.Types.ObjectId] || String,
    required: false
  },
  homeTeamPlayers: {
    type: Array,
    required: false
  },
  homeTeamScore: {
    type: Number,
    required: false
  },
  awayTeam: {
    type: [mongoose.Schema.Types.ObjectId] || String,
    required: false
  },
  awayTeamScore: {
    type: Number,
    required: false
  },
  awayTeamPlayers: {
    type: Array,
    required: false
  },
});

function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
       const key = keyGetter(item);
       const collection = map.get(key);
       if (!collection) {
           map.set(key, [item]);
       } else {
           collection.push(item);
       }
  });
  return map;
}

module.exports = Schedules = mongoose.model('schedule', ScheduleSchema);
