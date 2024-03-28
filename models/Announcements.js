const mongoose = require('mongoose');

const AnnouncementsSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  announcement: {
    type: String,
    required: true
  }
});

module.exports = Announcements = mongoose.model('announcements', AnnouncementsSchema);
