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
        // some validations
        // errors.groupName = 'There is group with such name. The group name must be a unique name!'
      }

      return {
        errors,
        isValid: isEmpty(errors)
      };
    });
};

router.post('/', (req, res) => {
  const { groupName, groupLogo, invitedUsers, groupId } = req.body;

  const users = invitedUsers.map(userId => {
    return {
      user: userId,
      confirmed: false
    }
  });

  validateInput({ groupName, groupLogo }, commonValidations)
    .then(({ errors, isValid }) => {
      if(isValid) {
        Group.findOneAndUpdate({ _id: groupId || new mongoose.Types.ObjectId }, {
          name: groupName,
          logo: groupLogo,
          createdBy: req.currentUser._id
        }, { upsert: true, new: true, setDefaultsOnInsert: true })
        .then((group) => {

          // find all removed users
          const prevGroupUsers = group.users;
          const oldUsers = prevGroupUsers.filter(prevUser => {
            return users.every(newUser => {
              return newUser.user.toString() !== prevUser.user.toString();
            });
          });

          // remove invites from all removed users
          const oldUserIds = oldUsers.map(user => {
            return new mongoose.Types.ObjectId(user.user);
          });

          if(oldUserIds.length) {
            User.find({
              _id: { $in: [ ...oldUserIds ] }
            }).then(users => {
              users.forEach(user => {
                // console.log(user.groups);
                const index = user.groups.indexOf(group._id);
                user.groups.splice(index, 1);
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


          // Create new group user list
          // if user was confirm invite before, change confirmed field to true
          group.users = users.map(user => {
            user.confirmed = prevGroupUsers.some(prevUser => {
              return user.user.toString() === prevUser.user.toString();
            });
            if(user.user.toString() === req.currentUser._id.toString()) {
              user.confirmed = true;
            }
            return user;
          });

          group.save(err => {
            if(err) {
              res.status(500).json({error: err});
            }
          });

          // send invites to new users
          const userIds = group.users.map(user => {
            return new mongoose.Types.ObjectId(user.user);
          });
          User.find({
            _id: { $in: [ ...userIds ] }
          }).then(users => {
            users.forEach(user => {
              if(user.groups.indexOf(group._id) === -1) {
                user.groups.push(group._id);
                user.save((err) => {
                  if(err) {
                    res.status(500).json({error: err});
                  }
                });
              }
            });
          }).catch((err) => {
            res.status(500).json({error: err});
          });

          res.json({ success: true });
        }).catch((err) => {
          res.status(500).json({error: err});
        });
      } else {
        res.status(400).json(errors);
      }
    })
});

router.get('/', (req, res) => {
  User.findById(req.currentUser._id).populate('groups', 'name logo users createdBy').exec()
    .then(user => {
      res.json(user.groups);
    })
    .catch(err => {
      res.status(500).json({error: err});
    })
});

router.put('/:groupId', (req, res) => {
  const { groupId } = req.params;
  Group.findById(groupId).then(group => {
    if(group) {
      const userToUpdate = group.users.find(user => {
        return user.user.toString() === req.body.id;
      });
      userToUpdate.confirmed = true;
      group.save((err) => {
        if(err) {
          res.status(500).json({error: err});
        }
      });
      res.json({ success: true });
    }
  });
  // res.json({ success: true });
});

module.exports = router;