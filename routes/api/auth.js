var express = require('express');

var router = express.Router();

const jwt = require('jsonwebtoken');

const {secret} = require('../../config/config')

const UserModel = require('../../models/UserModel');

const md5 = require('md5');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const data = await UserModel.findOne({
      username: username,
      password: md5(password)
    }).exec();

    if (!data) {
      return res.json({
        code: '2002',
        msg: '用户名或密码错误~~~',
        data: null
      });
    }

    const token = jwt.sign(
        {
          username: data.username,
          _id: data._id
        },
        secret,
        { expiresIn: '7d' } // 7 天过期
    );

    res.json({
      code: '0000',
      msg: '登录成功',
      data: token
    });

  } catch (error) {
    res.json({
      code: '2001',
      msg: '数据库读取失败~~~',
      data: null,
      error: error.message
    });
  }
});


router.post('/logout', async (req, res) => {
  try {
    await new Promise((resolve) => req.session.destroy(resolve));

    res.render('success', { msg: '退出成功', url: '/login' });

  } catch (error) {
    res.json({
      code: '5000',
      msg: '退出失败~~',
      data: null,
      error: error.message
    });
  }
});


module.exports = router;