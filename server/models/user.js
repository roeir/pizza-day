const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'Group'
  }],
  events: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }]
}, {timestamps: true});

const User = mongoose.model('User', UserSchema);
module.exports = User;