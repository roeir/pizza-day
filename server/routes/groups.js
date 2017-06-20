const express = require('express');
const mongoose = require('mongoose');
const isEmpty = require('lodash/isEmpty');
const Group = require('../models/group');
const User = require('../models/user');
const commonValidations = require('../utils/validations/group');

const router = express.Router();

const validateInput = (data, otherValidations) => {
  const { errors } = otherValidations(data);

  return Group.findOne({ name: data.groupName })
    .then(group => {
      if(group) {
        errors.groupName = 'There is group with such name. The group name must be a unique name!'
      }

      return {
        errors,
        isValid: isEmpty(errors)
      };
    });
};

router.post('/', (req, res) => {
  const { groupName, groupLogo, invitedUsers } = req.body;

  const users = invitedUsers.map(userId => {
    return {
      user: userId,
      confirmed: userId === req.currentUser._id.toString()
    }
  });

  validateInput({ groupName, groupLogo }, commonValidations)
    .then(({ errors, isValid }) => {
      if(isValid) {
        Group.create({
          name: groupName,
          logo: groupLogo,
          createdBy: req.currentUser._id,
          users,
        }).then((group) => {
          const userIds = invitedUsers.map(userId => {
            return new mongoose.Types.ObjectId(userId);
          });

          User.find({
            _id: { $in: [ ...userIds ] }
          }).then(users => {
            users.forEach(user => {
              user.groups.push(group._id);
              user.save((err) => {
                if(err) {
                  res.status(500).json({error: err});
                }
              })
            })
          }).catch((err) => {
            res.status(500).json({error: err});
          });

          res.status(201).json({ success: true });
        }).catch((err) => {
          res.status(500).json({error: err});
        });
      } else {
        res.status(400).json(errors);
      }
    })
});

router.get('/:ident', (req, res) => {
  const value = req.params.ident;

  Group.findOne({ name: value }, { name: 1 })
    .then(group => {
      res.json(group);
    }).catch((err) => {
    res.status(500).json({error: err});
  });
});

module.exports = router;