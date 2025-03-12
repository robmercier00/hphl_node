const mongoose = require('mongoose');

const AdminsSchema = new mongoose.Schema({
  _id: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String || null,
    required: false
  },
  token: {
    type: String || null,
    required: false
  },
  created_at: {
    type: Date,
    required: false
  },
  last_login: {
    type: Date,
    required: false
  },
  token_expires: {
    type: Date || null,
    requred: false
  }
});

module.exports = Admins = mongoose.model('admins', AdminsSchema);
