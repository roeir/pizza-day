const express = require('express');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.post('/', (req, res) => {
  res.json({ success: true });
});

router.get('/:ident', (req, res) => {
  res.json({ ident: req.params.ident });
});

module.exports = router;