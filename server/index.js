const express = require('express');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const auth = require('./routes/auth');
const groups = require('./routes/groups');
const events = require('./routes/events');
const menu = require('./routes/menu');
const database = require('./config/database');
const authenticate = require('./middlewares/authenticate');

const app = express();

database.connect();

app.use(bodyParser.json());

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/groups', authenticate, groups);
app.use('/api/events', authenticate, events);
app.use('/api/menu', authenticate, menu);

app.use(function(err, req, res, next) {
  console.error(err);
  return res.status(500).json({ status: 'error', code: 'unauthorized' });
});

app.listen(8080, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Listening at http://localhost:8080');
});

