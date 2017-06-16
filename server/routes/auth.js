const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');
const jwtConfig = require('../config/jwt');

const router = express.Router();

router.post('/', (req, res) => {
  const { ident, password } = req.body;
  User.findOne({
    $or: [
      { username: ident },
      { email: ident }
    ]
  }).then(user => {
    if(user) {
      if(bcrypt.compareSync(password, user.password)){
        const token = jwt.sign({
          id: user._id,
          username: user.username
        }, jwtConfig.secret);
        res.json({ token });
      } else {
        res.status(401).json({ errors: { form: 'Invalid credentials' } });
      }
    } else {
      res.status(401).json({ errors: { form: 'Invalid credentials' } });
    }
  });
});

module.exports = router;