const express = require('express');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.get('/create', authenticate, (req, res) => {
  res.json({ success: true });
});

module.exports = router;