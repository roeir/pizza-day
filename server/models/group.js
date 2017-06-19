const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  logo: {
    type: String,
    required: true
  },
  users: {
    invited: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    confirmed: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  }
}, {timestamps: true});

const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;