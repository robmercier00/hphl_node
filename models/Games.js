const mongoose = require('mongoose');

const GamesSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  season: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  home_team: {
    type: String,
    required: true
  },
  home_team_score: {
    type: Number,
    required: true,
    default: 0
  },
  home_team_shots: {
    type: Number,
    required: true,
    default: 0
  },
  away_team: {
    type: String,
    required: true
  },
  away_team_score: {
    type: Number,
    required: true,
    default: 0
  },
  away_team_shots: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = Season = mongoose.model('season', SeasonSchema);
