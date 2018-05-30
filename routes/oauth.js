const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling OAuth GET for request'
  });
});

router.post('/', (req, res, next) => {
  res.status(201).json({
    message: 'Handling OAuth POST for request'
  });
});

router.get('/:oauthID', (req, res, next) => {
  res.status(200).json({
    message: 'Handling OAuth POST for request',
    oauthID: req.params.oauthID
  });
});

router.delete('/:oauthID', (req, res, next) => {
  res.status(200).json({
    message: 'Handling OAuth DELETE for request',
    oauthID: req.params.oauthID
  });
});

module.exports = router;
