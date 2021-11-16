const express = require('express');
const router = express.Router();
const api = require('../apis/user')


router.post('/insertRecipient', (req, res, next) => {
  api.insertRecipient(req, res, next);
});

router.get('/existRecipient', (req, res, next) => {
  api.existRecipient(req, res, next);
});


module.exports = router;