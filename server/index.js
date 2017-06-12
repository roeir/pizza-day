const express = require('express');
const bodyParser = require('body-parser');
const users = require('./routes/users');

const app = express();

app.use(bodyParser.json());

app.listen(8080, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Listening at http://localhost:8080');
});

