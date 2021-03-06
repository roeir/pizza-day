const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GroupSchema = new Schema({
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
  users: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    confirmed: {
      type: Boolean
    }
  }]
}, {timestamps: true});

const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;