const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MenuSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  }
}, {timestamps: true});

const Menu = mongoose.model('Menu', MenuSchema);
module.exports = Menu;