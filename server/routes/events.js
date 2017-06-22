const express = require('express');
const mongoose = require('mongoose');
const isEmpty = require('lodash/isEmpty');
const Validator = require('validator');
const Group = require('../models/group');
const Event = require('../models/event');
const User = require('../models/user');

const router = express.Router();

const validateInput = (data) => {
  const errors = {};

  if (Validator.isEmpty(data.name)) {
    errors.name = 'The event name field is required';
  }

  if (Validator.isEmpty(data.logo)) {
    errors.logo = 'The event logo field is required';
  }

  if (!Validator.isURL(data.logo)) {
    errors.logo = 'The event logo field must be a correct url addres'
  }

  if(isEmpty(data.groups)) {
    errors.groups = 'Must be selected at least one of options'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

router.get('/', (req, res) => {
  res.json({ success: true });
});

router.post('/', (req, res) => {
  const { errors, isValid } = validateInput(req.body);

  if(isValid) {
    const { eventId, name, logo, status, date, groups } = req.body;
    Event.findOneAndUpdate({ _id: eventId || new mongoose.Types.ObjectId },
      { name, logo, status, date, createdBy: req.currentUser._id },
      { upsert: true, new: true, setDefaultsOnInsert: true })
      .then(event => {
        Group.find({ _id: { $in: groups }})
          .then(groups => {
            // get users from all event groups then choose only unique
            const users = groups.reduce((users, group) => {
              return users.concat(...group.users.map(user => user.user.toString()));
            }, []).filter((user, index, arr) => {
              return arr.indexOf(user) === index;
            });

            // send invites to users
            User.find({ _id: { $in: users } })
              .then(users => {
                users.forEach(user => {
                  if(user.events.indexOf(event._id) === -1) {
                    user.events.push(event._id);
                    user.save((err) => {
                      if(err) {
                        res.status(500).json({error: err});
                      }
                    });
                  }
                })
              })
              .catch(err => {
                res.status(500).json({ error: err });
              });
          })
          .catch(err => {
            res.status(500).json({ error: err });
          });

        res.json({ success: true });
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  } else {
    res.status(400).json(errors);
  }
});

module.exports = router;