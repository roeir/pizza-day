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
  User.findById(req.currentUser._id).populate('events', 'name logo status createdBy date users').exec()
    .then(user => {
      res.json(user.events);
    })
    .catch(err => {
      res.status(500).json({error: err});
    })
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

            // find all removed users
            const oldUsers = event.users.filter(prevUser => {
              return users.every(newUser => {
                return newUser.user.toString() !== prevUser.user.toString();
              });
            });

            // remove invite from removed users
            if(oldUsers.length) {
              User.find({
                _id: { $in: oldUsers}
              }).then(users => {
                users.forEach(user => {
                  const index = user.events.indexOf(event._id);
                  user.events.splice(index, 1);
                  user.save((err) => {
                    if(err) {
                      res.status(500).json({error: err});
                    }
                  });
                });
              }).catch((err) => {
                res.status(500).json({error: err});
              });
            }

            // Create new event user list
            // if user was confirm invite before, change confirmed field to true

            event.users = users.map(user => {
              const newUser = {
                user,
                confirmed: false
              };
              newUser.confirmed = event.users.some(prevUser => {
                return newUser.user.toString() === prevUser.user.toString();
              });
              if(newUser.user.toString() === req.currentUser._id.toString()) {
                newUser.confirmed = true;
              }
              return newUser;
            });

            event.save((err) => {
              if(err) {
                console.log(event.users);
                res.status(500).json({error: err});
              }
            });

            // send invites to new users if they have not been invited yet
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

router.put('/:eventId', (req, res) => {
  const { eventId } = req.params;
  Event.findById(eventId).then(event => {
    if(event) {
      const userToUpdate = event.users.find(user => {
        return user.user.toString() === req.body.id;
      });
      userToUpdate.confirmed = true;
      event.save((err) => {
        if(err) {
          res.status(500).json({error: err});
        }
      });
      res.json({ success: true });
    }
  });
});

module.exports = router;