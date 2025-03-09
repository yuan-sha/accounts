var express = require('express');

var router = express.Router();

const UserModel = require('../../models/UserModel');

const md5 = require('md5');

router.get('/reg', (req, res) => {
  res.render('auth/reg');
});

router.post('/reg', async (req, res) => {
  try {
    const userData = {
      ...req.body,
      password: md5(req.body.password)
    };

    await UserModel.create(userData);

    res.render('success', { msg: '注册成功', url: '/login' });

  } catch (error) {
    res.status(500).send('注册失败, 请稍后再试~~');
  }
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const data = await UserModel.findOne({
      username: username,
      password: md5(password)
    }).exec();

    if (!data) {
      res.render('warning', {msg: '账号或密码错误~~', url: '/login'});
    }

    req.session.username = data.username;
    req.session._id = data._id;

    res.render('success', { msg: '登录成功', url: '/account' });

  } catch (error) {
    res.render('warning', {msg: '登录失败，请稍后再试~~', url: '/login'});
  }
});


router.post('/logout', (req, res) => {
  //销毁 session
  req.session.destroy(() => {
    res.render('success', {msg: '退出成功', url: '/login'});
  })
});

module.exports = router;