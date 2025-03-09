var express = require('express');
var router = express.Router();
//导入 用户的模型
const UserModel = require('../../models/UserModel');
const md5 = require('md5');
//注册
router.get('/reg', (req, res) => {
  //响应 HTML 内容
  res.render('auth/reg');
});

//注册用户
router.post('/reg', async (req, res) => {
  try {
    // 获取请求体数据并加密密码
    const userData = {
      ...req.body,
      password: md5(req.body.password)
    };

    // 创建用户
    await UserModel.create(userData);

    // 注册成功，渲染成功页面
    res.render('success', { msg: '注册成功', url: '/login' });

  } catch (error) {
    res.status(500).send('注册失败, 请稍后再试~~');
  }
});

//登录页面
router.get('/login', (req, res) => {
  //响应 HTML 内容
  res.render('auth/login');
});

//登录操作
router.post('/login', async (req, res) => {
  try {
    // 获取用户名和密码
    const { username, password } = req.body;

    // 查询数据库
    const data = await UserModel.findOne({
      username: username,
      password: md5(password)
    }).exec();

    // 判断 data 是否存在
    if (!data) {
      res.render('warning', {msg: '账号或密码错误~~', url: '/login'});
    }

    // 写入 session
    req.session.username = data.username;
    req.session._id = data._id;

    // 登录成功响应
    res.render('success', { msg: '登录成功', url: '/account' });

  } catch (error) {
    res.render('warning', {msg: '登录失败，请稍后再试~~', url: '/login'});
  }
});


//退出登录
router.post('/logout', (req, res) => {
  //销毁 session
  req.session.destroy(() => {
    res.render('success', {msg: '退出成功', url: '/login'});
  })
});

module.exports = router;
