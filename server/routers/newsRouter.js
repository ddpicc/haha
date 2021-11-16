const express = require('express');
const router = express.Router();
const api = require('../apis/news')

router.get('/getAllNews', (req, res, next) => {
  api.getAllNews(req, res, next);  
});

router.get('/getNewsById', (req, res, next) => {
  api.getNewsById(req, res, next);  
});

router.delete('/deleteNewsById', (req, res, next) => {
  api.deleteNewsById(req, res, next);
});

router.post('/createNews', (req, res, next) => {
  api.createNews(req, res, next);
});


router.post('/updateNews', (req, res, next) => {
  api.updateNews(req, res, next);
});
module.exports = router;