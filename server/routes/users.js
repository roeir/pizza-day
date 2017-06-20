const express = require('express');
const bcrypt = require('bcrypt');
const isEmpty = require('lodash/isEmpty');
const User = require('../models/user');
const commonValidations = require('../utils/validations/signup');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

const validateInput = (data, otherValidations) => {
  const {errors} = otherValidations(data);

  return User.findOne({
    $or: [
      {email: data.email},
      {username: data.username}
    ]
  }).then((user) => {
    if (user) {
      if (user.username === data.username) {
        errors.username = 'There is user with such username';
      }
      if (user.email === data.email) {
        errors.email = 'There is user with such email';
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  });
};

router.post('/', (req, res) => {
  validateInput(req.body, commonValidations)
    .then(({errors, isValid}) => {
      if (isValid) {
        const {username, password: passwordRaw, email} = req.body;
        const password = bcrypt.hashSync(passwordRaw, 10);
        User.create({
          username, password, email
        }).then(() => {
          res.json({success: true});
        }).catch((err) => {
          res.status(500).json({error: err});
        });
      } else {
        res.status(400).json(errors)
      }
    });
});

router.get('/', authenticate, (req, res) => {
  User.find({}, {_id: 1, username: 1, email: 1})
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json({error: err});
    })
});

router.get('/:ident', (req, res) => {
  const value = req.params.ident;

  User.findOne({
    $or: [
      {email: value},
      {username: value}
    ]
  }, {_id: 0, username: 1, email: 1}).then(user => {
    res.json(user);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
});


module.exports = router;