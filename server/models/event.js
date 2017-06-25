const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EventSchema = new Schema({
  name: {
    type: String,
    required: true
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
  status: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  users: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    order: [{
      name: String,
      price: String,
      qty: Number
    }],
    confirmed: {
      type: Boolean
    }
  }]
}, {timestamps: true});

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;