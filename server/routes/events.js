const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true });
});

router.post('/', (req, res) => {
  res.json({ success: true });
  console.log(req.body);
});

module.exports = router;