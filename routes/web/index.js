const express = require('express');

const moment = require('moment');

const AccountModel = require('../../models/AccountModel');

const checkLoginMiddleware = require('../../middlewares/checkLoginMiddleware');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/account');
})

router.get('/account', checkLoginMiddleware, function(req, res, next) {
  AccountModel.find().sort({time: -1}).exec((err, data) => {
    if(err){
      res.status(500).send('读取失败~~~');
      return;
    }
    //响应成功的提示
    res.render('list', {accounts: data, moment: moment});
  })
});
router.get('/account/create',checkLoginMiddleware, function(req, res, next) {
  res.render('create');
});

router.post('/account',checkLoginMiddleware, (req, res) => {
  AccountModel.create({
    ...req.body,
    time: moment(req.body.time).toDate()
  }, (err, data) => {
    if(err){
      res.status(500).send('插入失败~~');
      return
    }
    res.render('success', {msg: '添加成功哦~~~', url: '/account'});
  })
});

router.get('/account/:id', checkLoginMiddleware, (req, res) => {
  let id = req.params.id;
  AccountModel.deleteOne({_id: id}, (err, data) => {
    if(err) {
      res.status(500).send('删除失败~');
      return;
    }
    res.render('success', {msg: '删除成功~~~', url: '/account'});
  })
});

module.exports = router;
