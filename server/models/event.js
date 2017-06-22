const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EventSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  logo: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  users: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    confirmed: Boolean
  }]
}, {timestamps: true});

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;