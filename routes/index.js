var express = require('express');
var router = express.Router();

router.get('/account', function(req, res, next) {
  res.render('list');
});

router.get('/account/create', function(req, res, next) {
  res.render('create');
});


module.exports = router;
