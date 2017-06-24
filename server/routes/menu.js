const express = require('express');
const isEmpty = require('lodash/isEmpty');
const Validator = require('validator');
const mongoose = require('mongoose');
const Menu = require('../models/menu');

const router = express.Router();

const validateInput = (data) => {
  const errors = {};

  if (Validator.isEmpty(data.name)) {
    errors.name = 'The name field is required';
  }

  if (!Validator.isURL(data.logo)) {
    errors.logo = 'The logo field must be a correct url address';
  }

  if (!Validator.isCurrency(data.price)) {
    errors.price = 'The price field must be a currency value';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

router.get('/', (req, res) => {
  Menu.find({}, 'logo name price').then(items => {
    res.json(items);
  }).catch(err => {
    res.status(500).json({error: err});
  });
});

router.post('/', (req, res) => {
  const { errors, isValid } = validateInput(req.body);
  const { name, logo, price, _id } = req.body;
  if(isValid) {
    Menu.findOneAndUpdate({ _id: _id || new mongoose.Types.ObjectId },
      { name, logo, price },
      { upsert: true, new: true, setDefaultsOnInsert: true })
      .then(item => {
        res.json({ success: true });
      })
      .catch(err => {
        res.status(500).json({error: err});
      });
  } else {
    res.status(400).json(errors);
  }
});

module.exports = router;