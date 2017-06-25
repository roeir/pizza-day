const express = require('express');
const mongoose = require('mongoose');
const isEmpty = require('lodash/isEmpty');
const Validator = require('validator');
const map = require('lodash/map');
const Group = require('../models/group');
const Event = require('../models/event');
const User = require('../models/user');
const Menu = require('../models/menu');
const mailer = require('../config/mailer');

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

router.put('/:eventId/status', (req, res) => {
  const { eventId } = req.params;

  Event.findByIdAndUpdate(eventId, { $set: { status: req.body.status } })
    .then(() => {
      res.json({ success: true });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    })
});

router.post('/:eventId/order', (req, res) => {
  const { eventId } = req.params;
  Event.findById(eventId).populate('users.user', 'username email').populate('createdBy').exec()
    .then(event => {
      const user = event.users.find(user => {
        return user.user._id.toString() === req.currentUser._id.toString();
      });

      const orderIds = map(req.body, (qty, id) => {
        return id;
      });

      Menu.find({ _id: { $in: orderIds } }, 'name price')
        .then(items => {
          user.order = map(req.body, (qty, id) => {
            const item = items.find(item => {
              return item._id.toString() === id;
            });
            return {
              name: item.name,
              price: item.price,
              qty
            };
          });

          event.save();

          // if all event users have already ordered change event status and send emails
          if(event.users.every(usersOrdered)) {
            event.status = 'ordered';
            // make queries for all event participants
            const mailQueries = event.users.map(user => {
              return new Promise((resolve, reject) => {
                mailer.sendMail({
                  from: 'skrebets.andrew@yandex.ru',
                  to: user.user.email,
                  subject: 'Pizza Day Order',
                  template: 'pizza-order',
                  context: {
                    order: user.order,
                    total: getTotalPrice(user.order)
                  }
                }, (err, info) => {
                  if(err) {
                    reject(err);
                  } else {
                    resolve(info);
                  }
                });
              });
            });

            // add event creator email query
            mailQueries.push(new Promise((resolve, reject) => {
              mailer.sendMail({
                from: 'skrebets.andrew@yandex.ru',
                to: event.createdBy.email,
                subject: 'Pizza Day Order',
                template: 'pizza-order-creator',
                context: {
                  order: getUserOrders(event.users),
                  total: getEventPrice(event.users)
                }
              }, (err, info) => {
                if(err) {
                  reject(err);
                } else {
                  resolve(info);
                }
              });
            }));

            Promise.all(mailQueries).then(() => {
              console.log('mails sended');
            }).catch(err => {
              console.log(err.message);
              // res.status(500).json({ error: err });
            });
          }
        });

      res.json({ success: true });
    })
    .catch(err => {
      res.json({ error: err });
    });
});

const getEventPrice = users => {
  return users.reduce((total, user) => {
    return total + getTotalPrice(user.order);
  }, 0);
};

const getUserOrders = users => {
  return users.map(user => {
    return {
      username: user.user.username,
      total: getTotalPrice(user.order),
      order: user.order
    };
  });
};

const getTotalPrice = list => {
  return list.reduce((total, item) => {
    const priceStr = item.price.replace(/\$/g, '');
    return total + Math.floor((parseFloat(priceStr) * item.qty) * 100) / 100;
  }, 0);
};

const usersOrdered = user => {
  return !isEmpty(user.order);
};

module.exports = router;