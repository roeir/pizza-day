const express = require('express');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const database = require('./config/database');

const app = express();

database.connect();

app.use(bodyParser.json());

app.use('/api/users', users);

app.listen(8080, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Listening at http://localhost:8080');
});

