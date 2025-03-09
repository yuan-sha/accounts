var express = require('express');
var router = express.Router();

//Accounting book list
router.get('/account', function(req, res, next) {
  res.render('list');
});

//Add a record
router.get('/account/create', function(req, res, next) {
  res.render('create');
});


module.exports = router;
